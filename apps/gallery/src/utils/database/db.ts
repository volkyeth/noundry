import { MongoClient } from "mongodb";
import { appConfig } from "../../variants/config";

function main() {
  const client = new MongoClient(process.env.MONGODB_HOST!, {
    auth: {
      username: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASSWORD,
    },
  });

  try {
    // Connect to the MongoDB cluster
    client.connect();

    // Make the appropriate DB calls
    return client;
  } catch (e) {
    console.error(e);
  }
}

export const client = main();
export const database = client!.db(appConfig.databaseName);
