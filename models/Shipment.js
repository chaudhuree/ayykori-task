const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    provider: {
      enum: ["Sundarban", "SA Paribahan", "Pathao", "Shohoz"],
      type: String,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Shipment", ShipmentSchema);
