const mongoose = require("mongoose");

const RequestCountSchema = new mongoose.Schema(
  {
    API: {
      type: String,
      required: [true, "api key is required"],
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("RequestCount", RequestCountSchema);
