const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'AccessAnalyser',
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('MongoDB connected');

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);

    // Retry safely
    setTimeout(() => {
      console.log('Retrying MongoDB connection...');
      connectDB();
    }, 5000);
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