import { createRoom } from "../../../../lib/party";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { view, filters, location } = req.body || {};
  if ((view !== "movie" && view !== "tv") || !filters || !location) {
    res.status(400).json({ error: "invalid_request" });
    return;
  }

  try {
    const code = await createRoom({ view, filters, location });
    res.status(200).json({ code });
  } catch (err) {
    console.error("Failed to create party room", err);
    res.status(500).json({ error: "server_error" });
  }
}
