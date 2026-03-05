import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createOrder,
  verifyPayment,
  getMyPayments,
  downloadInvoice
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);

router.post("/verify", protect, verifyPayment);

router.get("/my-payments", protect, getMyPayments);

router.get("/invoice/:id", protect, downloadInvoice);

export default router;