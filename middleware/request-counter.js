const RequestCount = require("../models/RequestCount");
// const { UnauthenticatedError } = require("../errors");

// let globalRequestCount = 0;
// exports.requestCounter =(globalRequestCount) =>async (req, res, next) => {
exports.requestCounter = async (req, res, next) => {
  // console.log("requestCounter");
  const token = req.headers.authorization;

  // If Bearer token is not present, return an error
  if (!token || !token.startsWith("Bearer ")) {
    globalRequestCount++;
    // if(globalRequestCount>2){
    //   console.log("globalRequestCount",globalRequestCount);
    // }
    next();
  }

  const apiKey = token.split(" ")[1];

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

  // Update the global request count
  globalRequestCount++;
  // console.log("globalRequestCount",globalRequestCount);
  next();
};
