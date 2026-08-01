const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlas URI format handles retryWrites etc.
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Automatic reconnection handlers for robustness
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection lost. Mongoose will try to reconnect automatically.');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

module.exports = connectDB;
