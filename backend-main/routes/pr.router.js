const express = require("express");
const prController = require("../controllers/prController");

const prRouter = express.Router();

prRouter.post("/pr/create", prController.createPR);
prRouter.get("/pr/repo/:repoId", prController.getPRsByRepository);
prRouter.put("/pr/merge/:id", prController.mergePR);

module.exports = prRouter;
