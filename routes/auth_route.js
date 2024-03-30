const express = require("express");
const router = express.Router();
const userService = require("../services/user_service");
const loggedInMiddleware = require("../middleware/logged_in_check");
const apiConsumptionService = require("../services/api_consumption_service");

// registration endpoint
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await userService.createUser(username, email, password);
    await apiConsumptionService.initApiConsumption(user.id)

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error registering new user:", error);
    res.status(500).json({ message: "Error registering new user" });
  }
});

// login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    try {
      const { user, token } = await userService.loginUser(email, password);
      user.password = undefined
      // Assuming you have access to 'req.session'
      req.session.user_id = user._id;
      req.session.save(() => {
        res.status(200).json({ user, token, message: "Login successful" });
      });
    } catch (error) {
      // Handle login errors
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.post("/logout", loggedInMiddleware, async (req, res) => {
  req.session.destroy(() => {
    return res.json({ message: "Logged out successfully" });
  });
});

// fetch user data endpoint
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userService.getUser(email);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// update user data endpoint
router.put("/update/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;
    const updatedUser = await userService.updateUser(email, updateData);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ message: "Error updating user data" });
  }
});

module.exports = router;
