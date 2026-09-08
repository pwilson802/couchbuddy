import { getRoomStatus } from "../../../../../lib/party";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { code, sessionId } = req.query;

  try {
    const room = await getRoomStatus(String(code).toUpperCase(), sessionId || null);
    if (!room) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(room);
  } catch (err) {
    console.error("Failed to load party room", err);
    res.status(500).json({ error: "server_error" });
  }
}
