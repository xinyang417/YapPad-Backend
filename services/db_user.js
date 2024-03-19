const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  apiCalls: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
