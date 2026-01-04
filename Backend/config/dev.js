export default {
  dbURL: process.env.DB_URL,
  dbName: process.env.DB_NAME || "fiverr_shared",
  corsOrigins: (
    process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};
