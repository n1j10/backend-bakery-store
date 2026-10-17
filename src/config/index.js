require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  uploads: {
    dir: process.env.UPLOAD_DIR || "uploads",
    publicUrl: process.env.PUBLIC_URL || "http://localhost:5000",
    maxFileSize: 1024 * 1024, // 1 MB, same limit as the Next.js imageSchema
  },
  s3: {
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    publicUrl: process.env.S3_PUBLIC_URL,
  },
};

const required = ["DATABASE_URL", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (process.env.S3_BUCKET) {
  for (const key of ["S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "S3_PUBLIC_URL"]) {
    if (!process.env[key]) missing.push(key);
  }
}
if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(", ")}`);
}

module.exports = config;
