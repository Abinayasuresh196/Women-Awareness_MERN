/**
 * Environment variable loader
 * Central place to load and validate env variables
 */

const dotenv = require('dotenv');
const path = require('path');

const loadEnv = () => {
  const envPath = path.resolve(__dirname, '..', '.env');

  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error('❌ Failed to load environment variables');
    process.exit(1);
  }

  // Basic environment validation
  const requiredVars = ['PORT', 'MONGO_URI', 'JWT_SECRET'];

  requiredVars.forEach((key) => {
    if (!process.env[key]) {
      console.error(`❌ Missing environment variable: ${key}`);
      process.exit(1);
    }
  });
};

module.exports = { loadEnv };
