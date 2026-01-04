import { MongoClient } from "mongodb";
import { config } from "../config/index.js";
import { loggerService } from "./logger.service.js";

let dbConn = null;
let client = null;

export const dbService = {
  getCollection,
  close,
};

async function getCollection(collectionName) {
  try {
    const db = await _connect();
    return db.collection(collectionName);
  } catch (err) {
    loggerService.error("Cannot get collection:", collectionName, err);
    throw err;
  }
}

async function _connect() {
  if (dbConn) return dbConn;

  if (!config.dbURL) {
    throw new Error("Missing MongoDB URL (config.dbURL)");
  }

  client = new MongoClient(config.dbURL);
  await client.connect();

  dbConn = client.db(config.dbName);
  loggerService.info(`MongoDB connected: ${config.dbName}`);

  return dbConn;
}

// Optional (for tests / graceful shutdown)
async function close() {
  if (!client) return;
  await client.close();
  client = null;
  dbConn = null;
  loggerService.info("MongoDB connection closed");
}
