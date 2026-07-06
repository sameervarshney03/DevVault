const mongoose = require("mongoose");
const { Schema } = mongoose;

const PRSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed", "merged"],
      default: "open",
    },
    sourceBranch: {
      type: String,
      required: true,
    },
    targetBranch: {
      type: String,
      required: true,
    },
    repository: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const PullRequest = mongoose.model("PullRequest", PRSchema);
module.exports = PullRequest;
