const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
      required: [true, "order is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refunded", "failed"],
      default: "pending",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Payment", PaymentSchema);
