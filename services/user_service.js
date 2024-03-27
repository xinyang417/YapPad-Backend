const bcrypt = require("bcrypt");
const User = require("../models/user_model.js");

// Create a user
async function createUser(username, email, password) {
  try {
    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
}

// Login user
async function loginUser(email, password) {
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User does not exist");
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

// Fetch user data by email, excluding the password cuz security
async function getUser(email) {
  try {
    const user = await User.findOne({ email }, { password: 0 });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
}

// Update user data by email
async function updateUser(email, updateData) {
  try {
    const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUser,
};
