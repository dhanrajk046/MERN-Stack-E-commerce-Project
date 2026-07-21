const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.Mongo_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
