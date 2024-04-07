const ApiUsage = require("../models/api_usage_model");

async function incrementEndpointUsage(req, _, next) {
  const method = req.method;
  let endpoint = req.originalUrl;
  console.log(`Original endpoint: ${endpoint}`); 

// normalize endpoint for PUT and DELETE requests
// normalize the endpoint for all delete operations to be tracked under a single record
// or else u get a new inserted record for every unique yap deleted!!!
  if ((method === 'PUT' && endpoint.startsWith('/v1/yaps/update/')) ||
      (method === 'DELETE' && endpoint.startsWith('/v1/yaps/delete/'))) {
    endpoint = `/v1/yaps/${method === 'PUT' ? 'update' : 'delete'}`;
    console.log(`Normalized endpoint for DELETE: ${endpoint}`);
    console.log(`Normalized endpoint: ${endpoint}`);
  }

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
