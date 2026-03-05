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

    // ✅ User already available from protect middleware
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // 🔐 Verify Razorpay signature
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

    // ✅ Save payment
    const payment = await Payment.create({
      user: user._id,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount,
      status: "success",
      courses: Array.isArray(courses) ? courses : []
    });

    // ✅ Add purchased courses to user
    if (Array.isArray(courses) && courses.length > 0) {

      const skillDocs = await Skill.find({
        title: { $in: courses.map(c => c.title) }
      });

      const skillIds = skillDocs.map(skill => skill._id);

      await User.findByIdAndUpdate(
        user._id,
        {
          $addToSet: {
            purchasedCourses: { $each: skillIds }
          }
        }
      );
    }

    // ✅ Send confirmation email
    try {

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
    }

    return res.json({
      success: true,
      message: "Payment verified, saved & courses added",
    });

  } catch (error) {

    console.error("Verify Payment Error:", error);

    return res.status(500).json({
      message: error.message
    });

  }
};