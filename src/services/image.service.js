const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const config = require("../config");

// With S3_BUCKET set, images go to S3-compatible storage (AWS S3, Cloudflare R2,
// Supabase Storage...), which is required on Vercel because its filesystem is
// read-only. Without it, images are stored on disk under UPLOAD_DIR (local dev).
const { s3 } = config;
const client = s3.bucket
  ? new S3Client({
      region: s3.region,
      endpoint: s3.endpoint,
      forcePathStyle: Boolean(s3.endpoint),
      credentials: { accessKeyId: s3.accessKeyId, secretAccessKey: s3.secretAccessKey },
    })
  : null;

const newFilename = (file) => `${crypto.randomUUID()}${path.extname(file.originalname)}`;

// Stores an uploaded file (multer memory storage) and returns its public URL.
const saveImage = async (file) => {
  const filename = newFilename(file);

  if (client) {
    await client.send(
      new PutObjectCommand({
        Bucket: s3.bucket,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );
    return `${s3.publicUrl.replace(/\/$/, "")}/${filename}`;
  }

  await fs.mkdir(config.uploads.dir, { recursive: true });
  await fs.writeFile(path.join(config.uploads.dir, filename), file.buffer);
  return `${config.uploads.publicUrl}/${config.uploads.dir}/${filename}`;
};

const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;

  const filename = path.basename(imageUrl);
  try {
    if (client) {
      await client.send(new DeleteObjectCommand({ Bucket: s3.bucket, Key: filename }));
    } else {
      await fs.unlink(path.join(config.uploads.dir, filename));
    }
  } catch (error) {
    // A missing file should not fail the request that owns it.
    if (error.code !== "ENOENT") console.error("Failed to delete image:", error.message);
  }
};

module.exports = { saveImage, deleteImage };
