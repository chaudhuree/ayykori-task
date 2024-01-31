const express =require("express");

const router = express.Router();

// middlewares
const {authenticated,admin}= require("../middleware/authentication.js") ;

// controllers
const {
  createOrder,getAllOrders,updateOrder,getOrder,updatePaymentStatus
} =require("../controllers/order.js");

router.post("/order", authenticated, createOrder);
router.get("/all-orders", authenticated, getAllOrders);
router.get("/order/:id", authenticated, getOrder);
router.put("/order/:id", authenticated, updateOrder);
router.put("/payment/:id", authenticated, updatePaymentStatus);


module.exports= router;
