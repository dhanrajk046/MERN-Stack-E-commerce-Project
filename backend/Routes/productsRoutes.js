const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const { admin } = require("../middleware/adminMiddleware.js");
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController")

const router = express.Router();
// All products

router.route('/').get(getProducts).post(protect. admin, createProduct);
//specific product

router.route('/:id').get(getProductById).put(protect, admin, updateproduct).delete(protect, admin, deleteProduct);

module.exports = router;

