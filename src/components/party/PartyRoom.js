/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Logo from "../Logo";
import SpinnerMovie from "../SpinnerMovie";
import { getDeviceId } from "../../lib/partyDevice";
import JoinForm from "./JoinForm";
import PartyLobby from "./PartyLobby";
import SwipeDeck from "./SwipeDeck";
import MatchResult from "./MatchResult";

const POLL_MS = 2500;

const colors = {
  light: { text: "black", subtleText: "rgba(0,0,0,0.6)" },
  dark: { text: "white", subtleText: "rgba(255,255,255,0.6)" },
};

function PartyRoom({ code, mode, location }) {
  const router = useRouter();
  const palette = colors[mode] || colors.dark;
  const deviceId = useRef(getDeviceId());

  const [phase, setPhase] = useState("loading");
  const [room, setRoom] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [mySwipes, setMySwipes] = useState({});
  const [stack, setStack] = useState(null);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState(null);

  async function fetchStatus() {
    let response;
    try {
      response = await fetch(`/api/party/rooms/${code}?sessionId=${deviceId.current}`);
    } catch {
      return; // Transient network hiccup - the next poll tick will retry.
    }
    if (response.status === 404) {
      setPhase("not_found");
      return;
    }
    if (!response.ok) return;
    const data = await response.json();
    setRoom(data);

    if (data.status === "expired") {
      setPhase("expired");
      return;
    }
    if (data.me) {
      setParticipantId(data.me.participantId);
      setMySwipes(data.me.swipes || {});
      setPhase(data.status); // "lobby" | "active" | "finished"
    } else if (data.status === "lobby") {
      setPhase("join");
    } else {
      setPhase("blocked");
    }
  }

  useEffect(() => {
    if (!code) return;
    fetchStatus();
    const interval = setInterval(fetchStatus, POLL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    if ((phase === "active" || phase === "finished") && !stack) {
      fetch(`/api/party/rooms/${code}/stack`)
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => data && setStack(data.stack));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, stack, code]);

  async function handleJoin(displayName) {
    setJoining(true);
    setJoinError(null);
    try {
      const response = await fetch(`/api/party/rooms/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: deviceId.current, displayName }),
      });
      const data = await response.json();
      if (!response.ok) {
        setJoinError(
          data.error === "room_full"
            ? "This room is full."
            : data.error === "already_started"
            ? "This game has already started."
            : "Couldn't join that room."
        );
        return;
      }
      await fetchStatus();
    } finally {
      setJoining(false);
    }
  }

  async function handleStart() {
    setStarting(true);
    setStartError(null);
    try {
      const response = await fetch(`/api/party/rooms/${code}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setStartError(
          data.error === "no_results"
            ? "Couldn't find enough titles for these filters."
            : "Couldn't start the round."
        );
        return;
      }
      await fetchStatus();
    } finally {
      setStarting(false);
    }
  }

  function handleSwipe(movieId, direction) {
    setMySwipes((prev) => ({ ...prev, [movieId]: direction }));
    fetch(`/api/party/rooms/${code}/swipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId, movieId, direction }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && data.finished) fetchStatus();
      });
  }

  async function handlePlayAgain() {
    // Re-uses this room's own stored filters/view - simplest path back into
    // a fresh lobby without re-visiting search.
    const createResponse = await fetch("/api/party/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ view: room.view, filters: room.filters, location }),
    });
    const created = await createResponse.json();
    if (created.code) router.push(`/play/${created.code}`);
  }

  const styles = {
    page: css({ minHeight: "100vh", paddingBottom: 40, color: palette.text }),
    header: css({ display: "flex", justifyContent: "center", padding: "20px 0" }),
    centered: css({ textAlign: "center", padding: "80px 20px", color: palette.subtleText }),
  };

  let body;
  if (phase === "loading") {
    body = <SpinnerMovie view="movie" mode={mode} />;
  } else if (phase === "not_found") {
    body = <p css={styles.centered}>That room doesn&rsquo;t exist. Double check the code?</p>;
  } else if (phase === "expired") {
    body = <p css={styles.centered}>This game has ended. Ask the host for a new link.</p>;
  } else if (phase === "blocked") {
    body = (
      <p css={styles.centered}>
        This game has already started without you - ask the host to start a new one.
      </p>
    );
  } else if (phase === "join") {
    body = (
      <JoinForm code={code} mode={mode} onJoin={handleJoin} joining={joining} error={joinError} />
    );
  } else if (phase === "lobby") {
    body = (
      <PartyLobby
        code={code}
        mode={mode}
        participants={room.participants}
        isHost={room.me && room.me.isHost}
        starting={starting}
        startError={startError}
        onStart={handleStart}
      />
    );
  } else if (phase === "active") {
    body = stack ? (
      <SwipeDeck
        stack={stack}
        mySwipes={mySwipes}
        onSwipe={handleSwipe}
        participants={room.participants}
        mode={mode}
      />
    ) : (
      <SpinnerMovie view="movie" mode={mode} />
    );
  } else if (phase === "finished") {
    body = room && room.winner ? (
      <MatchResult
        view={room.view}
        winner={room.winner}
        mode={mode}
        location={location}
        onPlayAgain={handlePlayAgain}
        onBackToSearch={() => router.push("/")}
      />
    ) : (
      <SpinnerMovie view="movie" mode={mode} />
    );
  }

  return (
    <div css={styles.page}>
      <div css={styles.header}>
        <Logo logo="main" width={140} />
      </div>
      {body}
    </div>
  );
}

export default PartyRoom;
