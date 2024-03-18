const mongoose = require("mongoose");

/**
 * Connect to the database
 * @returns {Promise<mongoose.Connection>} An object representing a connection to the database
 */
async function db_connect() {
  const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/YapPad";
  return mongoose.connect(MONGO_URL);
}

module.exports = {
    db_connect
}