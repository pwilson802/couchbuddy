import { createClient } from "@supabase/supabase-js";

// Server-only client using the service_role key (never exposed to the
// browser, never used from client code) - the party feature has no login,
// so every read/write is mediated by our own API routes rather than RLS
// policies scoped to a user. Row Level Security is left enabled with no
// policies on the party_* tables (see supabase/schema.sql) purely as a
// default-deny safety net; service_role bypasses it regardless.
let client;
export function getSupabase() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERIVCE_API,
      { auth: { persistSession: false } }
    );
  }
  return client;
}
