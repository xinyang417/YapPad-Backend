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
    const hashedPassword = await hashPassword(password);

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
    // Hash password if it is included in the update data
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

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

// Delete user by email
async function deleteUser(email) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    await user.remove();

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

// Hash password with salt
async function hashPassword(password) {
  try {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
};
