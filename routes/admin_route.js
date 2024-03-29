const express = require("express");
const admin_check_middleware = require("../middleware/admin_check");

const router = express.Router();

router.get("/users", admin_check_middleware, async (req, res, next) => {
  res.json({});
});

module.exports = router;
