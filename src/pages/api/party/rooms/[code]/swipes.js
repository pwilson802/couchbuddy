import { recordSwipe } from "../../../../../lib/party";

const ERROR_STATUS = {
  not_found: 404,
  not_active: 409,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { code } = req.query;
  const { participantId, movieId, direction } = req.body || {};
  if (!participantId || !movieId || (direction !== "yes" && direction !== "no")) {
    res.status(400).json({ error: "invalid_request" });
    return;
  }

  try {
    const result = await recordSwipe(String(code).toUpperCase(), {
      participantId,
      movieId: Number(movieId),
      direction,
    });
    if (result.error) {
      res.status(ERROR_STATUS[result.error] || 400).json({ error: result.error });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to record party swipe", err);
    res.status(500).json({ error: "server_error" });
  }
}
