import express from "express";
import {
  createOrder,
  verifyPayment,
  getMyPayments,
  downloadInvoice
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// create order
router.post("/create-order", protect, createOrder);

// verify payment
router.post("/verify", protect, verifyPayment);

// payment history
router.get("/my-payments", protect, getMyPayments);

// download invoice
router.get("/invoice/:id", protect, downloadInvoice);

export default router;