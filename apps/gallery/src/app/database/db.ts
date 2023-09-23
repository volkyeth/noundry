import { MongoClient } from "mongodb";

function main() {
  const client = new MongoClient(process.env.MONGODB_HOST, {
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
const client = main();
const database = client.db("nouns-wall");

module.exports = { database, client };
