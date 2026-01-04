export default {
  dbURL: process.env.DB_URL,
  dbName: process.env.DB_NAME || "fiverr_shared",
  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};
