const ApiUsage = require("../models/api_usage_model");

async function incrementEndpointUsage(req, _, next) {
  let method = req.method;
  let endpoint = req.originalUrl; 

  console.log(`Original endpoint: ${endpoint}`); 

  // normalize delete endpoint for yap deletion
  if (req.method === 'DELETE' && endpoint.startsWith('/v1/yaps/delete/')) {
    // normalize the endpoint for all delete operations to be tracked under a single record
    // or else u get a new inserted record for every unique yap deleted!!!
    endpoint = '/v1/yaps/delete'; // reassignment now affects endpoint variable 
    console.log(`Normalized endpoint for DELETE: ${endpoint}`);
}


 // normalize put endpoint for all yap updates
 if (req.method === 'PUT' && endpoint.startsWith('/v1/yaps/update/')) {
    endpoint = '/v1/yaps/update'; 
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