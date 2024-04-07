const express = require("express");
const admin_check_middleware = require("../middleware/admin_check");
const User = require("../models/user_model");
const { getApiConsumption } = require("../services/api_consumption_service");
const api_usage_middleware = require("../middleware/api_usage_middleware");
const ApiUsage = require('../models/api_usage_model'); 
const mongoose = require("mongoose");


const router = express.Router();

router.get("/users", admin_check_middleware, async (req, res) => {
  const all_users = await User.find()
  const ret_users = await Promise.all(all_users.map(async (u) => {
    const consumption = await getApiConsumption(u.id)
    return { _id: u.id, username: u.username, email: u.email, isAdmin: u.isAdmin, consumption: consumption }
  }))

  res.json(ret_users);
});



router.get("/api-usage-stats", admin_check_middleware, async (req, res) => {
  try {
    //  fetch the API usage statistics
    const stats = await ApiUsage.find({});
    res.json(stats);
  } catch (error) {
    console.error("Error fetching API usage stats:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error." });
    }
  }
});



router.get("/api-usage-stats-per-user", admin_check_middleware, async (req, res) => {
  try {
    const users = await User.find().lean();
    const userStats = await Promise.all(users.map(async (user) => {
      const totalRequests = await ApiUsage.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(user._id) } }, 
        { $group: { _id: "$userId", totalRequests: { $sum: "$count" } } }
      ]);

      return {
        username: user.username,
        email: user.email,
        totalRequests: totalRequests.length > 0 ? totalRequests[0].totalRequests : 0,
      };
      console.log(userStats);

    }));

    res.json(userStats);
  } catch (error) {
    console.error("Error fetching API usage stats per user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



module.exports = router;
