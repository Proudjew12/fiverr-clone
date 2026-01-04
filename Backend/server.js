// server.js
import "dotenv/config";

import http from "node:http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config } from "./config/index.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { fiverrRoutes } from "./api/fiverr/fiverr.routes.js";
import { loggerService } from "./services/logger.service.js";
import { dbService } from "./services/db.service.js";

const app = express();
const httpServer = http.createServer(app);

// --------------------
// Middleware
// --------------------
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));

const fallbackDevOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const origins =
  Array.isArray(config.corsOrigins) && config.corsOrigins.length
    ? config.corsOrigins
    : fallbackDevOrigins;

app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);

app.use(loggerMiddleware);

// --------------------
// Routes
// --------------------
app.get("/api/health", (req, res) => res.send({ ok: true }));
app.use("/api/fiverr", fiverrRoutes);

// --------------------
// 404
// --------------------
app.use((req, res) => {
  res.status(404).send({ error: "Not found" });
});

// --------------------
// Error handler
// --------------------
app.use((err, req, res, next) => {
  loggerService.error("Server error:", err);
  res.status(err.status || 500).send({ error: err.message || "Server error" });
});

// --------------------
// Start
// --------------------
const port = process.env.PORT || 3030;

(async () => {
  try {
    // Fail fast if DB creds are wrong
    await dbService.getCollection("fiverr");

    httpServer.listen(port, () => {
      loggerService.info(`Server running on port ${port}`);
    });
  } catch (err) {
    loggerService.error("Failed to start server (DB connection issue)", err);
    process.exit(1);
  }
})();

// --------------------
// Graceful shutdown
// --------------------
process.on("SIGINT", async () => {
  try {
    await dbService.close?.();
  } finally {
    process.exit(0);
  }
});

process.on("SIGTERM", async () => {
  try {
    await dbService.close?.();
  } finally {
    process.exit(0);
  }
});
