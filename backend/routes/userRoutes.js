import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// 🔥 GET FULL USER
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("purchasedCourses")
      .populate("createdCourses");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Existing
router.get("/profile", protect, getUserProfile);

// 🔥 IMPORTANT: add upload middleware here
router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  updateUserProfile
);

export default router;