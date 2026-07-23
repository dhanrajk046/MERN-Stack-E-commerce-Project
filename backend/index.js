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
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("ShopNest Backend is working properly!");
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productsRoutes.js/index.js'));
app.use('/api/orders', require('./routes/orderroutes.js/index.js'));
app.use('/api/payments', require('./routes/paymentsRoutes.js/index.js'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
