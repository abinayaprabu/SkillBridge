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

    // 1. Validation: Ensure all Razorpay fields are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Incomplete payment details received from gateway.",
      });
    }

    // 2. Authentication: Ensure user exists (from protect middleware)
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User context missing. Please log in again.",
      });
    }

    // 3. Signature Verification
    // Use the secret key exactly as it is in your .env
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // DEBUGGING: If verification fails, check these logs in your terminal/Render console
    if (generated_signature !== razorpay_signature) {
      console.error("--- SIGNATURE MISMATCH ---");
      console.log("Generated:", generated_signature);
      console.log("Received:", razorpay_signature);
      console.error("--------------------------");
      
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Transaction could not be verified.",
      });
    }

    // 4. Idempotency: Prevent duplicate processing of the same payment ID
    const existingPayment = await Payment.findOne({ paymentId: razorpay_payment_id });
    if (existingPayment) {
      return res.status(200).json({
        success: true,
        message: "Payment already processed.",
      });
    }

    // 5. Database Update: Save the Payment record
    const payment = await Payment.create({
      user: user._id,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: amount,
      status: "success",
      courses: Array.isArray(courses) ? courses : []
    });

    // 6. User Access: Grant access to purchased skills/courses
    if (courses && courses.length > 0) {
      // Find the actual Skill documents by title to get their ObjectIDs
      const skillDocs = await Skill.find({
        title: { $in: courses.map(c => c.title) }
      });

      const skillIds = skillDocs.map(skill => skill._id);

      // Add unique IDs to the user's purchasedCourses array
      await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { purchasedCourses: { $each: skillIds } } },
        { new: true }
      );
    }

    // 7. Notification: Send Confirmation Email (Async)
    if (user.email) {
      sendEmail(
        user.email,
        "Course Purchase Successful 🎉",
        `Hello ${user.name},\n\nYour payment of ₹${amount} was successful!\n\nOrder ID: ${razorpay_order_id}\nPayment ID: ${razorpay_payment_id}\n\nYou can now access your courses in your dashboard.\n\nThank you for choosing SkillBridge 🚀`
      ).catch(err => console.error("Email notification failed:", err.message));
    }

    // 8. Final Response
    return res.status(200).json({
      success: true,
      message: "Payment verified and courses added to your account.",
      payment
    });

  } catch (error) {
    console.error("CRITICAL: Verify Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal error occurred during payment verification."
    });
  }
};