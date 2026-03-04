import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
    },

    paymentId: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "success",
    },

    courses: [
      {
        title: String,
        price: Number,
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);