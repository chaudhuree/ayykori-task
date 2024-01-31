const mongoose = require("mongoose");
const Inventory = require("../models/Inventory.js");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

// create product
//  productName,price,availableQuantity

exports.createProduct = async (req, res) => {
  const { productName, price, availableQuantity } = req.body;
  if (!productName || !price || !availableQuantity) {
    throw new BadRequestError("Please provide all the fields");
  }
  const product = await Inventory.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ product });
};

// get all products
exports.getAllProducts = async (req, res) => {
  const products = await Inventory.find({});
  res.status(StatusCodes.OK).json({ products });
};

// get single product
exports.getProduct = async (req, res) => {
  let product = await Inventory.findById(req.params.id);
  if (!product) {
    throw new BadRequestError("Product not found");
  }
  res.status(StatusCodes.OK).json({ product });
};

// delete product
exports.deleteProduct = async (req, res) => {
  let product = await Inventory.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new BadRequestError("Product not found");
  }
  res.status(StatusCodes.OK).json({ product });
};

// update product
exports.updateProduct = async (req, res) => {
  let product = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new BadRequestError("Product not found");
  }
  res.status(StatusCodes.OK).json({ product });
};
