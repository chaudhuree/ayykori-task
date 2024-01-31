const RequestCount = require("../models/RequestCount");

exports.requestCounter = async (req, res, next) => {
  // console.log("requestCounter");
  const token = req.headers.authorization;

  const apiKey = token.split(" ")[1];
  // const apiKey = req.user._id;

  try {
    // Update the count in the database for the user-specific counter
    await RequestCount.findOneAndUpdate(
      { API: apiKey },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error updating user-specific request count:", error);
  }
  next();
};
