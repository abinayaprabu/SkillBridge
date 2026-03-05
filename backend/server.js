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

/* ================= CORS ================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://skill-bridge.vercel.app",
      /\.vercel\.app$/   // allow all vercel preview deployments
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* Handle preflight requests */
app.options("*", cors());

/* ======================================== */

app.use(express.json());

/* ================= UPLOADS ================= */

const uploadPath = path.resolve("uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

app.use("/uploads", express.static(uploadPath));

/* =========================================== */

app.get("/", (req, res) => {
  res.send("SkillBridge API Running 🚀");
});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/payments", paymentRoutes);

/* ========================================== */

/* ============== ERROR HANDLER ============== */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

/* ========================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});