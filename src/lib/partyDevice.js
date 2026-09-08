const KEY = "couchbuddy_party_device_id";

// One anonymous id per browser, reused across every room it joins or
// creates - no login. Rejoining a room with the same id is how a closed/
// reopened tab resumes instead of restarting (see party.js's joinRoom).
export function getDeviceId() {
  if (typeof window === "undefined") return null;
  let id;
  try {
    id = localStorage.getItem(KEY);
  } catch {
    return crypto.randomUUID();
  }
  if (!id) {
    id = crypto.randomUUID();
    try {
      localStorage.setItem(KEY, id);
    } catch {
      // Private browsing / storage disabled - fall through with an
      // in-memory id; resume just won't survive a reload for this viewer.
    }
  }
  return id;
}
