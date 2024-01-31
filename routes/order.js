const express =require("express");

const router = express.Router();

// middlewares
const {authenticated,admin}= require("../middleware/authentication.js") ;

// controllers
const {
  createOrder,getAllOrders,updateOrder,getOrder
} =require("../controllers/order.js");

router.post("/order", authenticated, createOrder);
router.get("/all-orders", authenticated, getAllOrders);
router.put("/order/:id", authenticated, updateOrder);
router.get("/order/:id", authenticated, getOrder);


module.exports= router;
