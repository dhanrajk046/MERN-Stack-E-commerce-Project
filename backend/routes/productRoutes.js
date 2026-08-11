const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const admin = require("../middleware/adminMiddleware.js");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  generateDescription,
} = require("../controllers/productController.js");
const multer = require("multer");
const upload = multer({ dest: "upload/" });

const router = express.Router();

// AI description generation (Admin only)
router.post("/generate-description", protect, admin, generateDescription);

// All products
router
  .route("/")
  .get(getProducts)
  .post(protect, admin, upload.single("image"), createProduct);

// Specific product reviews
router.route("/:id/reviews").post(protect, createProductReview);

// Specific product
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
