const User = require("../models/user_model")
const logged_in_check_middleware = require("./logged_in_check")

function admin_check_middleware(req, res, next) {
  logged_in_check_middleware(req, res, async () => {
    const current_user = await User.findById(req.session.user_id)
    if (current_user.isAdmin) {
      next()
    } else {
      res.status(400).json({ message: "Not an admin!" })
    }
  })
}

module.exports = admin_check_middleware