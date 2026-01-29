/**
 * Custom MongoDB Sanitize Middleware
 * Prevents NoSQL injection attacks by sanitizing user-supplied data
 * Compatible with Express 5
 */

const sanitizationOptions = {
  replaceWith: '_',
  allowDots: true,
  allowPrototypes: true,
  allowArrayDepth: true,
  isEnabled: true
};

// Characters to remove from keys
const charsToRemove = ['$'];

/**
 * Recursively sanitizes an object or array
 * @param {*} obj - Object or value to sanitize
 * @param {Object} options - Sanitization options
 * @returns {*} - Sanitized object
 */
function sanitize(obj, options = sanitizationOptions) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitize(item, options));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    
    for (const key of Object.keys(obj)) {
      let sanitizedKey = key;
      
      // Remove $ characters from keys (MongoDB operators)
      if (options.isEnabled) {
        sanitizedKey = key.replace(/\$/g, options.replaceWith);
      }
      
      sanitized[sanitizedKey] = sanitize(obj[key], options);
    }
    
    return sanitized;
  }

  return obj;
}

/**
 * Express middleware to sanitize request data
 * Prevents NoSQL injection by removing MongoDB operators
 */
function mongoSanitize(options = {}) {
  const opts = { ...sanitizationOptions, ...options };
  
  return function(req, res, next) {
    if (!opts.isEnabled) {
      return next();
    }

    // Sanitize body, query, and params
    // Create new objects instead of modifying existing ones (required for Express 5)
    if (req.body && typeof req.body === 'object') {
      req.body = sanitize(req.body, opts);
    }
    
    if (req.query && typeof req.query === 'object') {
      req.query = sanitize(req.query, opts);
    }
    
    if (req.params && typeof req.params === 'object') {
      req.params = sanitize(req.params, opts);
    }
    
    next();
  };
}

module.exports = mongoSanitize;
