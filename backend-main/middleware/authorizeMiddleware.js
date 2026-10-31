const mongoose = require("mongoose");
const Repository = require("../models/repoModel");

const authorizeRepoOwner = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repository.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to modify this repository",
      });
    }

    req.repository = repository;
    next();
  } catch (err) {
    console.error("Authorization error:", err.message);
    res.status(500).json({ message: "Server error during authorization" });
  }
};

const authorizeSelf = (req, res, next) => {
  const { id } = req.params;

  if (req.user.id !== id) {
    return res.status(403).json({
      message: "Forbidden: You are not authorized to modify this user account",
    });
  }

  next();
};

module.exports = {
  authorizeRepoOwner,
  authorizeSelf,
};
