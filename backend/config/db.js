const mongoose = require("mongoose");
require("dotenv").config(); // Make sure to load the environment variables

const mongo_uri = process.env.MONGO_DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(mongo_uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectDB;
