import express from "express";
import { authMiddleware } from "../middleware/auth.middelware.js";
import { addMembersinGroup, createGroup, getGroupDetails, getUserGroups } from "../controller/group.controller.js";
var router = express.Router();

router.use(authMiddleware);

router.post("/create", createGroup);
router.get("/fetch", getUserGroups);
router.get("/fetch/:groupId",getGroupDetails);
router.post("/update",addMembersinGroup)

export default router;
