const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.Mongo_URI;
  if (!mongoUri || mongoUri.includes("your_mongodb_connection_string")) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB Connected successfully");
};

module.exports = connectDB;
