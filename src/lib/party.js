import { randomInt, randomUUID } from "crypto";
import { getSupabase } from "./supabase";
import { generateStack } from "./movieStack";
import { MAX_PLAYERS } from "./partyConstants";

// A room is reported as "expired" to clients once it's gone quiet this
// long (covers "host never starts", "everyone wanders off mid-round",
// etc). Rows aren't deleted the moment they cross this line - only swept
// up later (see cleanupStaleRooms) - so this is a read-time check, not a
// stored flag.
const EXPIRE_MINUTES = 45;
// Deliberately later than EXPIRE_MINUTES: a room should read as "expired"
// well before it's actually gone, so a client that was mid-poll never sees
// a 404 it can't explain.
const SWEEP_MINUTES = 60;
// Unambiguous-on-a-phone-screen alphabet - no 0/O, 1/I/L.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 5;

function generateRoomCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return code;
}

// Opportunistic - runs off the back of room creation instead of a cron job
// (Vercel's Hobby-tier cron can't run more than once a day anyway), so a
// quiet stretch just means slightly more housekeeping on the next room
// someone actually creates.
async function cleanupStaleRooms() {
  const cutoff = new Date(Date.now() - SWEEP_MINUTES * 60 * 1000).toISOString();
  await getSupabase().from("party_rooms").delete().lt("updated_at", cutoff);
}

export function isExpired(room) {
  const ageMs = Date.now() - new Date(room.updated_at).getTime();
  return ageMs > EXPIRE_MINUTES * 60 * 1000;
}

function touchRoom(code) {
  return getSupabase()
    .from("party_rooms")
    .update({ updated_at: new Date().toISOString() })
    .eq("code", code);
}

function toRoomSummary(room) {
  return {
    code: room.code,
    view: room.view,
    // Small enough to always include (a handful of genre/provider ids) -
    // lets the client offer "play again with these filters" without a
    // second round trip.
    filters: room.filters,
    status: isExpired(room) ? "expired" : room.status,
    participantCount: room.participant_count,
    stackSize: room.stack ? room.stack.length : null,
    winner:
      room.winner_movie_id != null
        ? {
            kind: room.winner_kind,
            movie: (room.stack || []).find((m) => m.id === room.winner_movie_id) || null,
          }
        : null,
  };
}

export async function createRoom({ view, filters, location }) {
  await cleanupStaleRooms();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRoomCode();
    const { error } = await getSupabase()
      .from("party_rooms")
      .insert({ code, view, filters, location });
    if (!error) return code;
    if (error.code !== "23505") throw new Error(error.message); // not a code collision - give up
  }
  throw new Error("Could not allocate a room code");
}

async function fetchRoomRow(code) {
  const { data, error } = await getSupabase()
    .from("party_rooms")
    .select("*")
    .eq("code", code)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

async function fetchParticipantRows(code) {
  const { data, error } = await getSupabase()
    .from("party_participants")
    .select("*")
    .eq("room_code", code)
    .order("joined_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

async function fetchSwipeRows(code) {
  const { data, error } = await getSupabase()
    .from("party_swipes")
    .select("participant_id, movie_id, direction")
    .eq("room_code", code);
  if (error) throw new Error(error.message);
  return data || [];
}

// Lightweight room view for polling - never includes the stack itself (see
// getStack), so repeated polls during a round stay cheap. Includes the
// caller's own participant/swipe state when sessionId matches a member, so
// the client can tell "not joined yet" from "resuming".
export async function getRoomStatus(code, sessionId) {
  const room = await fetchRoomRow(code);
  if (!room) return null;

  const [participantRows, swipeRows] = await Promise.all([
    fetchParticipantRows(code),
    fetchSwipeRows(code),
  ]);

  const swipedCountByParticipant = {};
  for (const swipe of swipeRows) {
    swipedCountByParticipant[swipe.participant_id] =
      (swipedCountByParticipant[swipe.participant_id] || 0) + 1;
  }

  const participants = participantRows.map((row) => ({
    id: row.id,
    displayName: row.display_name,
    isHost: row.is_host,
    swipedCount: swipedCountByParticipant[row.id] || 0,
  }));

  let me = null;
  if (sessionId) {
    const mine = participantRows.find((row) => row.session_id === sessionId);
    if (mine) {
      const swipes = {};
      for (const swipe of swipeRows) {
        if (swipe.participant_id === mine.id) swipes[swipe.movie_id] = swipe.direction;
      }
      me = { participantId: mine.id, isHost: mine.is_host, swipes };
    }
  }

  return { ...toRoomSummary(room), participants, me };
}

export async function getStack(code) {
  const room = await fetchRoomRow(code);
  if (!room || !room.stack) return null;
  return room.stack;
}

export async function joinRoom(code, { sessionId, displayName }) {
  const room = await fetchRoomRow(code);
  if (!room) return { error: "not_found" };
  if (isExpired(room)) return { error: "expired" };

  const participants = await fetchParticipantRows(code);
  const existing = participants.find((row) => row.session_id === sessionId);
  if (existing) {
    // Resuming (tab closed/reopened, or the host re-hitting join after
    // creating the room) - never re-validate room status/capacity for an
    // already-seated participant.
    await touchRoom(code);
    return { participantId: existing.id, isHost: existing.is_host };
  }

  if (room.status !== "lobby") return { error: "already_started" };
  if (participants.length >= MAX_PLAYERS) return { error: "room_full" };

  const isHost = participants.length === 0;
  const id = randomUUID();
  const { error } = await getSupabase().from("party_participants").insert({
    id,
    room_code: code,
    session_id: sessionId,
    display_name: (displayName || "").trim().slice(0, 24) || "Player",
    is_host: isHost,
  });
  if (error) throw new Error(error.message);
  await touchRoom(code);
  return { participantId: id, isHost };
}

export async function startRoom(code, participantId) {
  const room = await fetchRoomRow(code);
  if (!room) return { error: "not_found" };
  if (isExpired(room)) return { error: "expired" };
  if (room.status !== "lobby") return { error: "already_started" };

  const participants = await fetchParticipantRows(code);
  const host = participants.find((row) => row.id === participantId);
  if (!host || !host.is_host) return { error: "not_host" };

  const stack = await generateStack({ view: room.view, filters: room.filters, location: room.location });
  if (stack.length === 0) return { error: "no_results" };

  const { error } = await getSupabase()
    .from("party_rooms")
    .update({
      status: "active",
      stack,
      participant_count: participants.length,
      updated_at: new Date().toISOString(),
    })
    .eq("code", code);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function recordSwipe(code, { participantId, movieId, direction }) {
  const room = await fetchRoomRow(code);
  if (!room) return { error: "not_found" };
  if (room.status !== "active") return { error: "not_active" };

  const { error } = await getSupabase()
    .from("party_swipes")
    .upsert(
      { room_code: code, participant_id: participantId, movie_id: movieId, direction },
      { onConflict: "room_code,participant_id,movie_id" }
    );
  if (error) throw new Error(error.message);
  await touchRoom(code);

  const swipeRows = await fetchSwipeRows(code);

  let winner = null;

  if (direction === "yes") {
    const yesCount = swipeRows.filter(
      (row) => row.movie_id === movieId && row.direction === "yes"
    ).length;
    if (yesCount >= room.participant_count) {
      winner = { movieId, kind: "match" };
    }
  }

  if (!winner) {
    const countsByParticipant = {};
    for (const row of swipeRows) {
      countsByParticipant[row.participant_id] = (countsByParticipant[row.participant_id] || 0) + 1;
    }
    const participantIds = Object.keys(countsByParticipant);
    const stackLength = room.stack.length;
    const everyoneDone =
      participantIds.length >= room.participant_count &&
      participantIds.every((id) => countsByParticipant[id] >= stackLength);

    if (everyoneDone) {
      const yesCountsByMovie = {};
      for (const row of swipeRows) {
        if (row.direction === "yes") {
          yesCountsByMovie[row.movie_id] = (yesCountsByMovie[row.movie_id] || 0) + 1;
        }
      }
      let bestMovieId = room.stack[0].id;
      let bestCount = -1;
      for (const movie of room.stack) {
        const count = yesCountsByMovie[movie.id] || 0;
        if (count > bestCount) {
          bestCount = count;
          bestMovieId = movie.id;
        }
      }
      winner = { movieId: bestMovieId, kind: "closest" };
    }
  }

  if (winner) {
    const { error: updateError } = await getSupabase()
      .from("party_rooms")
      .update({
        status: "finished",
        winner_movie_id: winner.movieId,
        winner_kind: winner.kind,
        updated_at: new Date().toISOString(),
      })
      .eq("code", code);
    if (updateError) throw new Error(updateError.message);
  }

  return { finished: Boolean(winner) };
}
