
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ FIXED CORS (works with Vercel + localhost)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// ✅ Create uploads folder if not exists
const uploadPath = path.resolve("uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ✅ Serve uploaded images
app.use("/uploads", express.static(uploadPath));

app.get("/", (req, res) => {
  res.send("SkillBridge API Running");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
