-- "Swipe to Decide" party game schema. Run this once in the Supabase SQL
-- Editor (Project -> SQL Editor -> New query) - the app connects with
-- @supabase/supabase-js using the service_role key (see src/lib/supabase.js)
-- and talks to these tables directly, so there's no app-side migration
-- step or ORM involved.

create table if not exists party_rooms (
  code text primary key,
  view text not null,
  filters jsonb not null,
  location text not null,
  status text not null default 'lobby',
  stack jsonb,
  participant_count integer,
  winner_movie_id integer,
  winner_kind text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists party_participants (
  id uuid primary key,
  room_code text not null references party_rooms(code) on delete cascade,
  session_id text not null,
  display_name text not null,
  is_host boolean not null default false,
  joined_at timestamptz not null default now(),
  unique (room_code, session_id)
);

create table if not exists party_swipes (
  room_code text not null references party_rooms(code) on delete cascade,
  participant_id uuid not null references party_participants(id) on delete cascade,
  movie_id integer not null,
  direction text not null,
  created_at timestamptz not null default now(),
  primary key (room_code, participant_id, movie_id)
);

create index if not exists party_swipes_room_movie_idx on party_swipes(room_code, movie_id);

-- Default-deny safety net: the app only ever talks to these tables with
-- the service_role key (which bypasses RLS), so no policies are defined -
-- if the anon/publishable key were ever used against them by mistake, this
-- makes that a no-op instead of an open read/write.
alter table party_rooms enable row level security;
alter table party_participants enable row level security;
alter table party_swipes enable row level security;
