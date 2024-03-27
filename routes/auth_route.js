const express = require("express");
const router = express.Router();
const userService = require("../services/user_service");

// registration endpoint
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await userService.createUser(username, email, password);
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

    const user = await userService.loginUser(email, password);
    req.session.user_id = user._id
    return req.session.save(() => {
      return res.json({ message: "Login successful" });
    })

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in user" });
  }
});

router.post("/logout", async (req, res) => {
  if (req.session.user_id) {
    req.session.destroy(() => {
      return res.json({ message: "Logged out succesfully" })
    })
  } else {
    return res.json({ message: "No one is currently logged in" })
  }
})

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
