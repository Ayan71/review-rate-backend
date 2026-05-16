/**
 * Validates multipart uploads before parsers run (multer/formidable/etc).
 * Wrong Content-Type (e.g. manual "multipart/form-data" without boundary in Postman)
 * breaks multipart parsers.
 */

function multipartBoundary(headerValue) {
  if (!headerValue || typeof headerValue !== "string") return null;
  const parts = headerValue.split(";");
  for (const segment of parts) {
    const s = segment.trim();
    const lower = s.toLowerCase();
    if (!lower.startsWith("boundary=")) continue;
    let b = s.slice("boundary=".length).trim();
    if (b.startsWith('"') && b.endsWith('"')) b = b.slice(1, -1);
    return b || null;
  }
  return null;
}

function requireMultipartBoundary(req, res, next) {
  const ct = req.get("Content-Type") || "";
  if (!ct.toLowerCase().startsWith("multipart/form-data")) return next();

  const boundary = multipartBoundary(ct);
  if (!boundary) {
    return res.status(400).json({
      success: false,
      message:
        'multipart/form-data is missing a valid boundary. In Postman: Body → form-data, key "image" as File — and remove any manually set Content-Type header so Postman can send boundary automatically.',
    });
  }
  next();
}

module.exports = {
  requireMultipartBoundary,
};
