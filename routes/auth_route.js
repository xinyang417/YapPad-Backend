const express = require("express");
const router = express.Router();
const userService = require("../services/user_service");
const pswResetService = require("../services/psw_reset_service");
const loggedInMiddleware = require("../middleware/logged_in_check");
const apiConsumptionService = require("../services/api_consumption_service");
const User = require('../models/user_model'); // Import User model

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
      user.password = undefined;
      // Set both user ID and email in the session
      req.session.user_id = user._id;
      req.session.userEmail = user.email; // Store user's email in the session
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
router.get("/reset-password", async (req, res) => {
  try {
    const { email, token } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    res.json({ email, token });
  } catch (error) {
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
    const { newEmail } = req.body; // Update to extract 'newEmail' from request body
    const updatedUser = await userService.updateUser(email, { email: newEmail }); // Pass 'newEmail' to updateUser function
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ message: "Error updating user data" });
  }
});

// Route to update user's email
router.put('/api/update-email', loggedInMiddleware, async (req, res) => {
  const { newEmail } = req.body;
  const userId = req.session.user_id; // Assuming user ID is stored in the session

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's email
    user.email = newEmail;
    await user.save();

    res.status(200).json({ message: 'Email updated successfully', user: user });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ message: 'Failed to update email. Please try again later.' });
  }
});

// Add a new route to check authentication status
router.get("/check-auth", loggedInMiddleware, async (req, res) => {
  try {
    // If the request reaches here, it means the user is authenticated
    res.json({ authenticated: true });
  } catch (error) {
    console.error("Error checking authentication status:", error);
    res.status(500).json({ message: "Error checking authentication status" });
  }
});

// Express route to fetch current user's email
router.get("/current-user-email", loggedInMiddleware, async (req, res) => {
  try {
    // Assuming the user's email is stored in the session
    const userEmail = req.session.userEmail;
    if (!userEmail) {
      throw new Error("User email not found");
    }
    // Send the user's email as JSON response
    res.json({ email: userEmail });
  } catch (error) {
    console.error("Error fetching current user email:", error);
    res.status(500).json({ message: "Error fetching current user email" });
  }
});

module.exports = router;
