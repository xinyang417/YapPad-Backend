const express = require("express");
const admin_check_middleware = require("../middleware/admin_check");
const User = require("../models/user_model");
const { getApiConsumption } = require("../services/api_consumption_service");

const router = express.Router();

router.get("/users", admin_check_middleware, async (req, res) => {
  const all_users = await User.find()
  const ret_users = await Promise.all(all_users.map(async (u) => {
    const consumption = await getApiConsumption(u.id)
    return { _id: u.id, username: u.username, email: u.email, isAdmin: u.isAdmin, consumption: consumption}
  }))

  res.json(ret_users);
});

module.exports = router;
