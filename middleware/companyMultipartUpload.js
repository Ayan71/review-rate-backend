const fs = require("node:fs/promises");

const { formidable } = require("formidable");

const { cloudinary } = require("../storage/storage");

/** Match previous CloudinaryStorage `allowedFormats` behavior (+ filename fallback for Postman's application/octet-stream). */
const ALLOWED_IMAGE_MIME = /^image\/(jpeg|jpg|png)$/i;

function mimeOrFilenameOk(imageFile) {
  const mime = imageFile.mimetype || "";
  if (ALLOWED_IMAGE_MIME.test(mime)) return true;
  const name = imageFile.originalFilename || "";
  return /\.(jpe?g|png)$/i.test(name);
}

function firstField(arr) {
  if (arr == null) return undefined;
  const v = Array.isArray(arr) ? arr[0] : arr;
  return typeof v === "string" ? v : String(v ?? "");
}

/**
 * Parses multipart company forms (multipart only). JSON/urlencoded skips to next().
 * Runs Cloudinary upload for field name "image"; sets req.body and req.file like multer did.
 */
async function parseCompanyMultipart(req, res, next) {
  const ct = req.get("Content-Type") || "";
  if (!ct.toLowerCase().startsWith("multipart/form-data")) {
    return next();
  }

  const form = formidable({
    multiples: false,
    maxFields: 30,
    maxFiles: 5,
    maxFileSize: 10 * 1024 * 1024,
    keepExtensions: true,
  });

  let writtenFiles = [];

  try {
    const [fields, files] = await form.parse(req);

    const body = Object.create(null);
    for (const [key, vals] of Object.entries(fields)) {
      body[key] = firstField(vals);
    }
    req.body = body;

    const imageParts = files.image;
    const imageFile = Array.isArray(imageParts)
      ? imageParts[0]
      : imageParts;

    writtenFiles = Object.values(files)
      .flat()
      .filter((f) => f && typeof f.filepath === "string");

    req.file = null;

    if (imageFile && imageFile.originalFilename && imageFile.size > 0) {
      const mime = imageFile.mimetype || "";
      if (!mimeOrFilenameOk(imageFile)) {
        return res.status(400).json({
          success: false,
          message:
            "Image must be a JPEG or PNG file. Wrong Content-Type often shows as octet-stream; ensure the filename ends in .jpg, .jpeg, or .png.",
        });
      }

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          imageFile.filepath,
          { folder: "Menu", resource_type: "image" },
          (err, r) => {
            if (err) reject(err);
            else resolve(r);
          }
        );
      });

      req.file = {
        fieldname: "image",
        originalname: imageFile.originalFilename,
        mimetype: mime,
        path: result.secure_url,
        size: result.bytes,
        filename: result.public_id,
      };
    }

    return next();
  } catch (err) {
    const status = typeof err.httpCode === "number" ? err.httpCode : 400;
    return res.status(status).json({
      success: false,
      message: err.message || "Failed to parse multipart form.",
    });
  } finally {
    await Promise.all(
      writtenFiles.map((f) =>
        fs.unlink(f.filepath).catch(() => {})
      )
    );
  }
}

module.exports = { parseCompanyMultipart };
