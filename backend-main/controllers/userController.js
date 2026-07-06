const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();

async function signup(req, res) {
  const { username, password, email } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    });

    const result = await newUser.save();

    const token = jwt.sign(
      { id: result._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token, userId: result._id });
  } catch (err) {
    console.error("Error during signup: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during login: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function getUserProfile(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateUserProfile(req, res) {
  const { id } = req.params;
  const { email, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    let updateFields = {};
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error updating user: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteUserProfile(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ message: "User profile deleted!" });
  } catch (err) {
    console.error("Error deleting user: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function followUser(req, res) {
  const { id } = req.params;
  const { currentUserId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { followedUsers: id },
    });
    res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    console.error("Error following user:", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function unfollowUser(req, res) {
  const { id } = req.params;
  const { currentUserId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { followedUsers: id },
    });
    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.error("Error unfollowing user:", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  followUser,
  unfollowUser,
};
