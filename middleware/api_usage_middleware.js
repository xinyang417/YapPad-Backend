const ApiUsage = require("../models/api_usage_model");

// router.use((req, res, next) => {
//     console.log("Session user_id:", req.session.user_id);
//     next();
// });


async function incrementEndpointUsage(req, _, next) {
  const method = req.method;
//   let endpoint = req.originalUrl;
let endpoint = req.originalUrl.split('?')[0];
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


  const userId = req.user?._id || req.session?.user_id || req.userId;
  console.log(userId);
  if (!userId) {
      console.error("No user ID found in request");
      return next(); 
  }



  try {
    const usage = await ApiUsage.findOneAndUpdate(
      { userId, method, endpoint },
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
