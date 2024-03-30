const { incrementApiConsumption } = require("../services/api_consumption_service")
const User = require("../models/user_model")

// assumes a logged in user and working session
async function api_consumption_middleware(req, res, next) {
  const current_user = await User.findById(req.session.user_id)
  await incrementApiConsumption(current_user.id)
  next()
}

module.exports = api_consumption_middleware