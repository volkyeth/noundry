import { MongoClient, Db } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";
import { appConfig } from "../../variants/config";

const pool = new MongoClient(process.env.MONGODB_HOST!, {
  auth: {
    username: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
  },
  maxPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxIdleTimeMS: 30000,
});

// Attach the pool to ensure idle connections close before suspension
attachDatabasePool(pool);

let isConnected = false;

export async function getDatabase(): Promise<Db> {
  if (!isConnected) {
    await pool.connect();
    isConnected = true;
  }

  return pool.db(appConfig.databaseName);
}
