const mongoose = require("mongoose")

const apiConsumptionSchema = new mongoose.Schema({
  calls: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
})

const ApiConsumption = mongoose.model("ApiConsumption", apiConsumptionSchema);
module.exports = ApiConsumption;