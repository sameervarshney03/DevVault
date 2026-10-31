const express = require("express");
const repoController = require("../controllers/repoController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRepoOwner } = require("../middleware/authorizeMiddleware");

const repoRouter = express.Router();

repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRouter.get("/repo/:id/tree", repoController.getFileTree);

repoRouter.post("/repo/create", authMiddleware, repoController.createRepository);
repoRouter.post("/repo/star/:id", authMiddleware, repoController.toggleStar);

repoRouter.put("/repo/update/:id", authMiddleware, authorizeRepoOwner, repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", authMiddleware, authorizeRepoOwner, repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", authMiddleware, authorizeRepoOwner, repoController.toggleVisibilityById);

module.exports = repoRouter;

