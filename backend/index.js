const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/authRoutes.js");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("ShopNest Backend is working properly!");
});

app.use("/api/auth", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
