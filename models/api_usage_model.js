const mongoose = require("mongoose");

const apiUsageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  method: { type: String, required: true },
  endpoint: { type: String, required: true },
  count: { type: Number, required: true, default: 0 }
});

const ApiUsage = mongoose.model("ApiUsage", apiUsageSchema);

module.exports = ApiUsage;