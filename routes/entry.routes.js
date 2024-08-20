import express from "express";
import { authMiddleware } from "../middleware/auth.middelware.js";
import { createEntry, settleEntryRecord } from "../controller/entry.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create", createEntry);
router.post("/settle",settleEntryRecord)

export default router;
