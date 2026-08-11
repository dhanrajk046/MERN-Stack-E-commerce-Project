const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
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

module.exports = router;
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
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

module.exports = router;
