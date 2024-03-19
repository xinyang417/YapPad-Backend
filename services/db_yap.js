const mongoose = require("mongoose");

const yapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Yap = mongoose.model("Yap", yapSchema);
module.exports = Yap;
