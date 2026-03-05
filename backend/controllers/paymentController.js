import crypto from "crypto";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Skill from "../models/Skill.js";
import { sendEmail } from "../utils/sendEmail.js";

export const verifyPayment = async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      courses
    } = req.body;

    // DEBUG LOGS (very important for deployment)
    console.log("VERIFY BODY:", req.body);
    console.log("AUTH HEADER:", req.headers.authorization);
    console.log("USER:", req.user);

    // 1️⃣ Validate Razorpay fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Incomplete payment details received from gateway.",
      });
    }

    // 2️⃣ Ensure user exists (protect middleware)
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User context missing. Please login again.",
      });
    }

    // 3️⃣ Ensure Razorpay secret exists
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY SECRET NOT FOUND");
      return res.status(500).json({
        success: false,
        message: "Server configuration error."
      });
    }

    // 4️⃣ Generate signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // 5️⃣ Compare signatures
    if (generatedSignature !== razorpay_signature) {

      console.error("----- SIGNATURE MISMATCH -----");
      console.log("Generated:", generatedSignature);
      console.log("Received:", razorpay_signature);
      console.error("------------------------------");

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    // 6️⃣ Prevent duplicate payments
    const existingPayment = await Payment.findOne({
      paymentId: razorpay_payment_id
    });

    if (existingPayment) {
      return res.status(200).json({
        success: true,
        message: "Payment already processed.",
      });
    }

    // 7️⃣ Save payment
    const payment = await Payment.create({
      user: user._id,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount,
      status: "success",
      courses: Array.isArray(courses) ? courses : []
    });

    // 8️⃣ Grant course access
    if (courses && courses.length > 0) {

      const titles = courses.map(c =>
        typeof c === "string" ? c : c.title
      );

      const skillDocs = await Skill.find({
        title: { $in: titles }
      });

      const skillIds = skillDocs.map(skill => skill._id);

      await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { purchasedCourses: { $each: skillIds } } }
      );
    }

    // 9️⃣ Send email (non-blocking)
    if (user.email) {
      sendEmail(
        user.email,
        "Course Purchase Successful 🎉",
        `Hello ${user.name},

Your payment of ₹${amount} was successful!

Order ID: ${razorpay_order_id}
Payment ID: ${razorpay_payment_id}

You can now access your courses in your dashboard.

Thank you for choosing SkillBridge 🚀`
      ).catch(err =>
        console.error("Email notification failed:", err.message)
      );
    }

    // 🔟 Success response
    return res.status(200).json({
      success: true,
      message: "Payment verified and courses added.",
      payment
    });

  } catch (error) {

    console.error("CRITICAL VERIFY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed."
    });

  }
};