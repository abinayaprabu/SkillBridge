import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import PDFDocument from "pdfkit";

import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Skill from "../models/Skill.js";
import { sendEmail } from "../utils/sendEmail.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ================= CREATE ORDER =================
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      courses
    } = req.body;

    // 🛑 Safety check
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // 🔐 Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ✅ Save Payment
    const payment = await Payment.create({
      user: req.user._id,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount,
      status: "success",
      courses: Array.isArray(courses) ? courses : []
    });

    // ✅ Add Purchased Courses to User
    if (Array.isArray(courses) && courses.length > 0) {

      const skillDocs = await Skill.find({
        title: { $in: courses.map(c => c.title) }
      });

      const skillIds = skillDocs.map(skill => skill._id);

      await User.findByIdAndUpdate(
        req.user._id,
        {
          $addToSet: {
            purchasedCourses: { $each: skillIds }
          }
        }
      );
    }

    // ✅ Send Confirmation Email (SAFE)
    try {
      const user = await User.findById(req.user._id);

      if (user?.email) {
        await sendEmail(
          user.email,
          "Course Purchase Successful 🎉",
          `Hello ${user.name},

Your payment was successful!

Order ID: ${razorpay_order_id}
Payment ID: ${razorpay_payment_id}
Amount Paid: ₹ ${amount}

Thank you for choosing SkillBridge 🚀`
        );
      }

    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      // ❗ Do NOT throw error
    }

    return res.json({
      success: true,
      message: "Payment verified, saved & courses added",
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({ message: error.message });
  }
};


// ================= GET MY PAYMENTS =================
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.json(payments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DOWNLOAD INVOICE =================
export const downloadInvoice = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${payment._id}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).text("SkillBridge Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Invoice ID: ${payment._id}`);
    doc.text(`Customer: ${payment.user.name}`);
    doc.text(`Email: ${payment.user.email}`);
    doc.text(`Date: ${payment.createdAt.toLocaleString()}`);
    doc.moveDown();

    // Courses Section
    doc.fontSize(14).text("Purchased Courses:", { underline: true });
    doc.moveDown(0.5);

    if (payment.courses && payment.courses.length > 0) {
      payment.courses.forEach((course, index) => {
        doc.text(`${index + 1}. ${course.title} — ₹ ${course.price}`);
      });
    } else {
      doc.text("No course details available.");
    }

    doc.moveDown();
    doc.text(`Total Amount Paid: ₹ ${payment.amount}`);
    doc.text(`Status: ${payment.status}`);

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invoice generation failed" });
  }
};