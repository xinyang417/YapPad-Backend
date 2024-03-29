const express = require("express");
const admin_check_middleware = require("../middleware/admin_check");
const User = require("../models/user_model");

const router = express.Router();

router.get("/users", admin_check_middleware, async (req, res) => {
  const all_users = await User.find()
  all_users.forEach((u) => {
    u.password = undefined
  })

  res.json(all_users);
});

module.exports = router;
