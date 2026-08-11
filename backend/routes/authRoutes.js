const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers);
router.post("/verify-email", async (req, res) => {
  const { email } = req.body;
  // Placeholder for email verification implementation
  res.status(501).json({ message: "Not implemented" });
});

router.route("/wishlist").get(protect, getWishlist).post(protect, addToWishlist);
router.route("/wishlist/:productId").delete(protect, removeFromWishlist);

module.exports = router;
