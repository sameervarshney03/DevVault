const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeSelf } = require("../middleware/authorizeMiddleware");

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);

// Protected routes (require valid JWT)
userRouter.put("/updateProfile/:id", authMiddleware, authorizeSelf, userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", authMiddleware, authorizeSelf, userController.deleteUserProfile);
userRouter.post("/user/:id/follow", authMiddleware, userController.followUser);
userRouter.delete("/user/:id/follow", authMiddleware, userController.unfollowUser);

module.exports = userRouter;

