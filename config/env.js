/**
 * Environment variable loader
 * Central place to load and validate env variables
 */

const dotenv = require('dotenv');
const path = require('path');

const loadEnv = () => {
  // Try to load .env file for local development, but don't fail in production
  const envPath = path.resolve(__dirname, '..', '.env');
  const result = dotenv.config({ path: envPath });

  // Only log error in development, don't exit in production
  if (result.error && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ Could not load .env file (expected in production)');
  }

  // Basic environment validation - only warn in production
  const requiredVars = ['PORT', 'MONGO_URI', 'JWT_SECRET'];

  const missingVars = requiredVars.filter((key) => !process.env[key]);
  
  if (missingVars.length > 0) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
      console.warn('Please set these in your deployment platform environment variables');
    } else {
      console.error(`❌ Missing environment variables: ${missingVars.join(', ')}`);
      console.error('Please add them to your .env file');
      process.exit(1);
    }
  }
};

module.exports = { loadEnv };
