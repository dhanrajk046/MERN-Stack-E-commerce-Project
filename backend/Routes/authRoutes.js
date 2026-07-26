const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/authController.js");
const { protect, admin } = require("../middleware/authMiddleware.js");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers);
router.post("/verify-email", async (req, res) => {
  const { email } = req.body;
  //Implementationfor email verification
});
module.exports = router;
