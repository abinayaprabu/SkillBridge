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

router.post(
  "/verify",
  protect,
  authorizeRoles("buyer", "instructor", "admin"),
  verifyPayment
);

router.get(
  "/my-payments",
  protect,
  authorizeRoles("buyer", "instructor", "admin"),
  getMyPayments
);

router.get(
  "/invoice/:id",
  protect,
  authorizeRoles("buyer", "instructor", "admin"),
  downloadInvoice
);

export default router;