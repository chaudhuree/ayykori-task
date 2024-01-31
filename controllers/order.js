const mongoose = require("mongoose");
const Inventory = require("../models/Inventory.js");
const Order = require("../models/Order.js");
const Payment = require("../models/Payment.js");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

// create order
exports.createOrder = async (req, res) => {
  const client = req.user._id;
  const { products } = req.body;
  // calculate total amount
  let totalAmount = 0;
  for (let i = 0; i < products.length; i++) {
    let product = await Inventory.findById(products[i].productId);
    if (!product) {
      throw new BadRequestError("Product not found");
    }
    totalAmount += product.price * products[i].quantity;
  }

  if (!products) {
    throw new BadRequestError("Please provide all the fields");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check product quantities
    for (let i = 0; i < products.length; i++) {
      // let product = await Inventory.findById(products[i].productId);
      let product = await Inventory.findById(products[i].productId).session(
        session
      );

      if (!product) {
        throw new BadRequestError("Product not found");
      }

      if (product.availableQuantity < products[i].quantity) {
        throw new BadRequestError("Product quantity not available");
      }
    }

    // If all product checks pass, update quantities
    for (let i = 0; i < products.length; i++) {
      // let product = await Inventory.findById(products[i].productId);
      let product = await Inventory.findById(products[i].productId).session(
        session
      );

      // Update product quantities
      product.availableQuantity -= products[i].quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create([{ client, products, totalAmount }], {
      session,
    });
    console.log("order", order);

    // Create payment
    const payment = await Payment.create(
      [{ order: order[0]._id, amount: totalAmount, status: "completed" }],
      { session }
    );

    // Update order with payment id and status
    const updatedOrder = await Order.findByIdAndUpdate(
      order[0]._id,
      { payment: payment[0]._id, status: "confirmed" },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.CREATED).json({ updatedOrder });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// get all orders
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("client")
    .populate("products.productId")
    .populate("payment");
  res.status(StatusCodes.OK).json({ orders });
};

// get single order
exports.getOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate("client")
    .populate("products.productId")
    .populate("payment");
  if (!order) {
    throw new BadRequestError("Order not found");
  }
  res.status(StatusCodes.OK).json({ order });
};

// updateOrder
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    throw new BadRequestError("Please provide all the fields");
  }
  // if order status is cancelled then refund payment and update order status and update product quantity
  if (status === "cancelled" || status === "failed") {
    const order = await Order.findById(id);
    if (!order) {
      throw new BadRequestError("Order not found");
    }
    const payment = await Payment.findById(order.payment);
    if (!payment) {
      throw new BadRequestError("Payment not found");
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Update order status
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true, session }
      );
      // Update payment status
      const updatedPayment = await Payment.findByIdAndUpdate(
        payment._id,
        { status: "refunded" },
        { new: true, runValidators: true, session }
      );
      // Update product quantity
      for (let i = 0; i < updatedOrder.products.length; i++) {
        let product = await Inventory.findById(
          updatedOrder.products[i].productId
        ).session(session);
        // Update product quantities
        product.availableQuantity += updatedOrder.products[i].quantity;
        await product.save();
      }
      await session.commitTransaction();
      session.endSession();
      res.status(StatusCodes.OK).json({ updatedOrder });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // update order status
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (!order) {
    throw new BadRequestError("Order not found");
  }
  res.status(StatusCodes.OK).json({ order });
};

/*
order workflow:
- when customer place an order it will first check the avaibility of the product
- if product is available then it will create an order with status pending
- then it will create a payment with status completed
--> if payment is successfull then it will update the order status to confirmed
--> if payment is failed then it will update the order status to failed and rollback the product quantity


## order status update
- if order status is cancelled or failed then refund payment and update order status and update product quantity
- otherwise just update the order status
*/
