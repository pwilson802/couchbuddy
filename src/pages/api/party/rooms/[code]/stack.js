import { getStack } from "../../../../../lib/party";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { code } = req.query;

  try {
    const stack = await getStack(String(code).toUpperCase());
    if (!stack) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    // Immutable once a round starts - safe to cache briefly per client.
    res.setHeader("Cache-Control", "private, max-age=300");
    res.status(200).json({ stack });
  } catch (err) {
    console.error("Failed to load party stack", err);
    res.status(500).json({ error: "server_error" });
  }
}
