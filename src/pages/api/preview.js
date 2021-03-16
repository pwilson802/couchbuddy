let SECRET_KEY = process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_SECRET;

export default function handler(req, res) {
  res.setPreviewData({});
  res.end("Preview mode enabled");
}
