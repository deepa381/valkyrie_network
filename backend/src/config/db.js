const mongoose = require('mongoose');

// Disable buffering so DB failures fail instantly (no long retries)
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/valkyrie_network';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // fail fast
      connectTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected:', mongoose.connection.host);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Do not silently continue without DB — bubble up the error so the app fails fast
    throw err;
  }
};

module.exports = { connectDB };
