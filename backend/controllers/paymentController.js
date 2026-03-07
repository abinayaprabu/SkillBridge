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

    if (!amount) {
      return res.status(400).json({
        message: "Amount is required"
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {

    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to create Razorpay order"
    });

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

    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "Incomplete Razorpay payment data"
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {

      return res.status(400).json({
        message: "Invalid payment signature"
      });
    }

    const existingPayment = await Payment.findOne({
      paymentId: razorpay_payment_id
    });

    if (existingPayment) {
      return res.json({
        success: true,
        message: "Payment already processed"
      });
    }

    const payment = await Payment.create({
      user: req.user._id,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount,
      status: "success",
      courses: Array.isArray(courses) ? courses : []
    });

    // Grant course access
    if (courses?.length > 0) {

      const titles = courses.map(c =>
        typeof c === "string" ? c : c.title
      );

      const skills = await Skill.find({
        title: { $in: titles }
      });

      const skillIds = skills.map(skill => skill._id);

      await User.findByIdAndUpdate(
        req.user._id,
        {
          $addToSet: {
            purchasedCourses: { $each: skillIds }
          }
        }
      );
    }

    // Send email
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

You can now access your purchased courses.

Thank you for choosing SkillBridge 🚀`
  );

}

    } catch (err) {

      console.error("EMAIL ERROR:", err.message);

    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      payment
    });

  } catch (error) {

    console.error("VERIFY PAYMENT ERROR:", error);

    res.status(500).json({
      message: "Payment verification failed"
    });

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

    console.error("GET PAYMENTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch payments"
    });

  }

};



// ================= DOWNLOAD INVOICE =================
export const downloadInvoice = async (req, res) => {

  try {

    const payment = await Payment.findById(req.params.id)
      .populate("user");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found"
      });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${payment._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("SkillBridge Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Invoice ID: ${payment._id}`);
    doc.text(`Customer: ${payment.user.name}`);
    doc.text(`Email: ${payment.user.email}`);
    doc.text(`Date: ${payment.createdAt.toLocaleString()}`);

    doc.moveDown();

    doc.fontSize(14).text("Purchased Courses:", { underline: true });
    doc.moveDown(0.5);

    payment.courses?.forEach((course, index) => {
      doc.text(`${index + 1}. ${course.title} — ₹ ${course.price}`);
    });

    doc.moveDown();
    doc.text(`Total Amount Paid: ₹ ${payment.amount}`);
    doc.text(`Status: ${payment.status}`);

    doc.end();

  } catch (error) {

    console.error("INVOICE ERROR:", error);

    res.status(500).json({
      message: "Invoice generation failed"
    });

  }

};