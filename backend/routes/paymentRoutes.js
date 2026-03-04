import express from "express";

import {
  createOrder,
  verifyPayment,
  getMyPayments,
  downloadInvoice
} from "../controllers/paymentController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Buyer + Instructor + Admin can create order
router.post(
  "/create-order",
  protect,
  authorizeRoles("buyer", "instructor", "admin"),
  createOrder
);

// ✅ Verify payment (NO AUTH HERE)
router.post("/verify", verifyPayment);

// ✅ Buyer + Instructor + Admin can see their payments
router.get(
  "/my-payments",
  protect,
  authorizeRoles("buyer", "instructor", "admin"),
  getMyPayments
);

// ✅ Buyer + Instructor + Admin can download invoice
router.get(
  "/invoice/:id",
  protect,
  authorizeRoles("buyer", "instructor", "admin"),
  downloadInvoice
);

export default router;