const mongoose = require("mongoose");

/**
 * Connect to the database
 * @returns {Promise<mongoose.Connection>} An object representing a connection to the database
 */
async function dbConnect() {
  const { MongoClient, ServerApiVersion } = require("mongodb");
  const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/YapPad";

  // Create a MongoClient
  const client = new MongoClient(MONGO_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB!");

    // Return the mongoose connection from the client
    return client.db();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = {
  dbConnect,
};
