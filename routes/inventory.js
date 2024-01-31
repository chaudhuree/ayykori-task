const express =require("express");

const router = express.Router();

// middlewares
const {authenticated,admin}= require("../middleware/authentication.js") ;

// controllers
const {
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
}= require("../controllers/inventory.js");

router.post("/create-product", authenticated, createProduct);
router.get("/all-products", getAllProducts); 
router.get("/product/:id", getProduct);
router.delete("/product/:id", authenticated, deleteProduct);
router.put("/product/:id", authenticated, updateProduct);

module.exports= router;