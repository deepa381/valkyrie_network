const mongoose = require('mongoose');

// Disable buffering so DB failures fail instantly (no long retries)
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  
  console.log('--- MongoDB Connection Debug ---');
  console.log('MONGODB_URI defined:', !!process.env.MONGODB_URI);
  console.log('MONGO_URI defined:', !!process.env.MONGO_URI);
  
  if (!uri) {
    console.error('❌ Error: No MongoDB connection string found in process.env');
    throw new Error('MONGODB_URI is undefined. Check your .env file placement and content.');
  }

  // Mask sensitive info for logging
  const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
  console.log('Connecting to:', maskedUri);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully to:', mongoose.connection.host);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

module.exports = { connectDB };
