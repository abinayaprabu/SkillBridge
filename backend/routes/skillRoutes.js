import express from "express";
import {
  createSkill,
  getSkills,
  getSkillById,
  getMySkills
} from "../controllers/skillController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Instructor create
router.post("/", protect, authorizeRoles("instructor"), createSkill);

// 🔥 ADD THIS
router.get("/my", protect, authorizeRoles("instructor"), getMySkills);

// Public
router.get("/", getSkills);
router.get("/:id", getSkillById);

export default router;