const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();

const app = express();
app.disable("x-powered-by");
// Trust proxy (Render/Heroku) so secure cookies and rate limiters work correctly
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Gzip compression for static assets and API responses
app.use(compression());

const allowedOrigins = new Set(
  [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
);

const isLocalDevelopmentOrigin = (origin) =>
  process.env.NODE_ENV !== "production" &&
  /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}):3000$/.test(
    origin,
  );

app.use(
  cors({
    origin(origin, callback) {
      if (
        process.env.NODE_ENV !== "production" ||
        !origin ||
        allowedOrigins.has(origin) ||
        isLocalDevelopmentOrigin(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

// Register API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentsRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api", (req, res) =>
  res.status(404).json({ message: "API route not found" }),
);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("ShopNest API is running in Development mode...");
  });
}

app.use((error, req, res, next) => {
  console.error(error.message);
  res
    .status(error.status || 500)
    .json({ message: error.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}`),
    );
  } catch (error) {
    console.error(`Unable to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
