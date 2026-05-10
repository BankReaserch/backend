const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return Promise.resolve();

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "ribis_database", // ⚠️ no spaces
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log("MongoDB connected");

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    // Retry
    return new Promise((resolve) => {
      setTimeout(async () => {
        console.log("Retrying MongoDB connection...");
        await connectDB();
        resolve();
      }, 5000);
    });
  }
};
// Events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('MongoDB disconnected');

  setTimeout(connectDB, 5000);
});

module.exports = connectDB;