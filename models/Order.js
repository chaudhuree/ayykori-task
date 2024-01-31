const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Inventory",
          required: [true, "product is required"],
        },
        quantity: {
          type: Number,
          required: [true, "quantity is required"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "total amount is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed","delivered","cancelled", "failed"],
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.ObjectId,
      ref: "Payment",
    },
    shipment: {
      type: mongoose.Schema.ObjectId,
      ref: "Shipment",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Order", OrderSchema);

