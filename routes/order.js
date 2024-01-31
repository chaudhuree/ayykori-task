const express =require("express");
const OrderRateLimiter = require("express-rate-limit");

const specificRouteLimiter = OrderRateLimiter({
  windowMs: 60 * 1000, // 1 minutes
  max: 4, // limit each IP to 100 requests per windowMs
  message: 'Wait for 1 minute for next request',
});
const router = express.Router();

// middlewares
const {authenticated,admin}= require("../middleware/authentication.js") ;

// controllers
const {
  createOrder,getAllOrders,updateOrder,getOrder,updatePaymentStatus
} =require("../controllers/order.js");

router.post("/order", authenticated, createOrder);
router.get("/all-orders",specificRouteLimiter, authenticated, getAllOrders);
router.get("/order/:id", authenticated, getOrder);
router.put("/order/:id", authenticated, updateOrder);
router.put("/payment/:id", authenticated, updatePaymentStatus);


module.exports= router;
