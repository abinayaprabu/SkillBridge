import express from "express";
import { createProject, getUserProjects } from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create project
router.post("/", protect, createProject);

// Get logged-in user projects
router.get("/", protect, getUserProjects);

export default router;
