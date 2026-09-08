import { joinRoom } from "../../../../../lib/party";

const ERROR_STATUS = {
  not_found: 404,
  expired: 410,
  already_started: 409,
  room_full: 409,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { code } = req.query;
  const { sessionId, displayName } = req.body || {};
  if (!sessionId) {
    res.status(400).json({ error: "invalid_request" });
    return;
  }

  try {
    const result = await joinRoom(String(code).toUpperCase(), { sessionId, displayName });
    if (result.error) {
      res.status(ERROR_STATUS[result.error] || 400).json({ error: result.error });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to join party room", err);
    res.status(500).json({ error: "server_error" });
  }
}
