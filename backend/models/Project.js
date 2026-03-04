import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "pending",
    },
    paymentStatus: {
      type: String,
      default: "unpaid",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
