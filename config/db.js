/**
 * MongoDB database connection
 * Uses mongoose for ODM
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true, // optional, builds indexes automatically
      // Connection pooling and retry settings
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // Retry settings
      retryWrites: true,
      retryReads: true,
      // Additional stability options
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      heartbeatFrequencyMS: 10000, // Check server status every 10 seconds
      // useNewUrlParser and useUnifiedTopology are defaults in Mongoose 6+
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    // Print full error for debugging
    logger.error('❌ MongoDB connection failed:', error);
    console.error('Full MongoDB error:', error); // shows stack & details
    process.exit(1);
  }
};

module.exports = connectDB;
