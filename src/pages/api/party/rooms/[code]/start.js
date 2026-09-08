import { startRoom } from "../../../../../lib/party";

const ERROR_STATUS = {
  not_found: 404,
  expired: 410,
  already_started: 409,
  not_host: 403,
  no_results: 422,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { code } = req.query;
  const { participantId } = req.body || {};
  if (!participantId) {
    res.status(400).json({ error: "invalid_request" });
    return;
  }

  try {
    const result = await startRoom(String(code).toUpperCase(), participantId);
    if (result.error) {
      res.status(ERROR_STATUS[result.error] || 400).json({ error: result.error });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to start party round", err);
    res.status(500).json({ error: "server_error" });
  }
}
