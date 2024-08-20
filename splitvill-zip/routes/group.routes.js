import express from "express";
import { authMiddleware } from "../middleware/auth.middelware.js";
import { createGroup, getUserGroups } from "../controller/group.controller.js";
var router = express.Router();

router.use(authMiddleware);

router.post("/create", createGroup);
router.get("/fetch", getUserGroups);

export default router;
