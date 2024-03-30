const { incrementApiConsumption } = require("../services/api_consumption_service")
const User = require("../models/user_model")

// assumes a logged in user and working session
async function api_consumption_middleware(req, res, next) {
  try {
    const current_user = await User.findById(req.session.user_id);
    if (!current_user) {
      return res.status(404).json({ message: "User not found." });
    }
    await incrementApiConsumption(current_user.id);
    next();
  } catch (error) {
    console.error("Error in API consumption middleware:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}


module.exports = api_consumption_middleware