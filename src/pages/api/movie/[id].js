export default function handler(req, res) {
  const {
    query: { id },
  } = req;
  res.status(200).json({ text: `Post: ${id}` });
}
