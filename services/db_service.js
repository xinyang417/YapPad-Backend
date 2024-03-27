const mongoose = require("mongoose");
require("dotenv").config();

class DbService {
  constructor() {
    if (DbService._instance) {
      return DbService._instance;
    }

    DbService._instance = this;
  }

  async connect() {
    const MONGO_URL = process.env.MONGO_URL;

    try {
      // Connect the client to the server
      await mongoose.connect(MONGO_URL);
      console.log("Connected to MongoDB!");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }
}

module.exports = DbService;
