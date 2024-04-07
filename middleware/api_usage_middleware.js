const ApiUsage = require("../models/api_usage_model");

async function incrementEndpointUsage(req, _, next) {
  const method = req.method;
  const endpoint = req.originalUrl; 

  try {
    const usage = await ApiUsage.findOneAndUpdate(
      { method, endpoint },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    console.log(`Usage for ${method} ${endpoint} incremented to ${usage.count}`);
  } catch (error) {
    console.error("Error incrementing API usage:", error);
  }

  next();
}

module.exports = incrementEndpointUsage;