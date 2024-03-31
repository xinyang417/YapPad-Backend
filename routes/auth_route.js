const express = require("express");
const router = express.Router();
const userService = require("../services/user_service");
const pswResetService = require("../services/psw_reset_service");
const loggedInMiddleware = require("../middleware/logged_in_check");
const apiConsumptionService = require("../services/api_consumption_service");

// registration endpoint
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;
    const user = await userService.createUser(username, email, password, isAdmin);
    await apiConsumptionService.initApiConsumption(user.id);

    // user is logged in asap as soon as they register
    const { token } = await userService.loginUser(email, password);
    req.session.user_id = user._id;
    req.session.save(() => {
      res.status(201).json({ message: "User created and logged in successfully", token });
    });
  } catch (error) {
    console.error("Error during user registration/login:", error);
    res.status(500).json({ message: "Error during user registration/login" });
  }
});

// login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    try {
      const { user, token } = await userService.loginUser(email, password);
      user.password = undefined;
      // since we have access to req.session
      req.session.user_id = user._id;
      req.session.save(() => {
        res.status(200).json({ user, token, message: "Login successful" });
      });
    } catch (error) {
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

// password reset endpoint
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pswResetService.handlePasswordResetRequest(email);
    if (result === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: result });
  } catch (error) {
    console.error("Error handling password reset request:", error);
    res.status(500).json({ message: "Error handling password reset request" });
  }
});

// Handle password reset link
router.post("/reset-password", async (req, res) => {
  try {
    const { email, token, password } = req.body;
    console.log(email, token, password)

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await pswResetService.resetPassword(email, token, password)
    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error handling password reset link" });
  }
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
