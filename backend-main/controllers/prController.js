const mongoose = require("mongoose");
const PullRequest = require("../models/prModel");

async function createPR(req, res) {
  const { title, description, sourceBranch, targetBranch, repository, author } = req.body;
  try {
    const newPR = new PullRequest({
      title,
      description,
      sourceBranch,
      targetBranch,
      repository,
      author,
    });

    const savedPR = await newPR.save();
    res.status(201).json(savedPR);
  } catch (err) {
    console.error("Error creating PR:", err.message);
    res.status(500).send("Server error");
  }
}

async function getPRsByRepository(req, res) {
  const { repoId } = req.params;
  try {
    const prs = await PullRequest.find({ repository: repoId }).populate("author", "username");
    res.status(200).json(prs);
  } catch (err) {
    console.error("Error fetching PRs:", err.message);
    res.status(500).send("Server error");
  }
}

async function mergePR(req, res) {
  const { id } = req.params;
  try {
    const pr = await PullRequest.findByIdAndUpdate(
      id,
      { status: "merged" },
      { new: true }
    );
    if (!pr) {
      return res.status(404).json({ message: "PR not found" });
    }
    // In a real system, you would also trigger a git merge operation here.
    res.status(200).json(pr);
  } catch (err) {
    console.error("Error merging PR:", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createPR,
  getPRsByRepository,
  mergePR,
};
