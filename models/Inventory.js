const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "product name is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    availableQuantity: {
      type: Number,
      required: [true, "quantity is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Inventory", InventorySchema);
