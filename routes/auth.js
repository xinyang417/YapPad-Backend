const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../services/db_user.js");
const path = require("path");

const router = express.Router();

// registration endpoint
router.post("/register", async (req, res) => {
  console.log("Register called");
  try {
    const { username, email, password } = req.body;
    console.log(req.body)

    // check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering new user" });
  }
});

// login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // validate
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user" });
  }
});

// fetch user data endpoint
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // fetch user data by email, excluding the password cuz security
    const userData = await User.findOne({ email }, { password: 0 });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// update user data endpoint
router.put("/update/:email", async (req, res) => {
  const { email } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ message: "Error updating user data" });
  }
});

module.exports = router