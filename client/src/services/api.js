import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.PROD ? 'https://women-awareness-mern-1.onrender.com/api' : 'http://localhost:5000/api', // 🔗 Backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for regular operations (increased from 30s)
});

// Create separate axios instance for AI operations with longer timeout
const aiApiInstance = axios.create({
  baseURL: import.meta.env.PROD ? 'https://women-awareness-mern-1.onrender.com/api' : 'http://localhost:5000/api', // 🔗 Backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for AI operations (can take longer)
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // Public GET endpoints that don't require authentication
    // Only the main listing endpoints are public, not admin-specific ones
    const publicGetEndpoints = ['/laws', '/schemes', '/articles']; // Make /articles fully public

    // Check if this is a public GET request (exact match or main listing)
    const isPublicGet = config.method === 'get' && (
      publicGetEndpoints.some(endpoint => config.url === endpoint || config.url === endpoint.replace('$', '')) ||
      (config.url.startsWith('/articles?') && !config.url.includes('pending')) // Allow public article queries but not pending
    );

    // For admin operations (PATCH, DELETE, PUT) or admin-specific GETs, always require authentication
    const isAdminOperation = ['patch', 'delete', 'put'].includes(config.method.toLowerCase());
    const isAdminGet = config.method === 'get' && (
      config.url.includes('/pending') ||
      config.url.includes('/admin/') ||
      config.url.startsWith('/articles/') // Article detail pages might need auth
    );

    if (!isPublicGet || isAdminOperation || isAdminGet) {
      // Try admin token first, then regular token
      let token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add request interceptor to AI API instance as well
aiApiInstance.interceptors.request.use(
  (config) => {
    // Public GET endpoints that don't require authentication
    // Only the main listing endpoints are public, not admin-specific ones
    const publicGetEndpoints = ['/laws', '/schemes', '/articles']; // Make /articles fully public

    // Check if this is a public GET request (exact match or main listing)
    const isPublicGet = config.method === 'get' && (
      publicGetEndpoints.some(endpoint => config.url === endpoint || config.url === endpoint.replace('$', '')) ||
      (config.url.startsWith('/articles?') && !config.url.includes('pending')) // Allow public article queries but not pending
    );

    // For admin operations (PATCH, DELETE, PUT) or admin-specific GETs, always require authentication
    const isAdminOperation = ['patch', 'delete', 'put'].includes(config.method.toLowerCase());
    const isAdminGet = config.method === 'get' && (
      config.url.includes('/pending') ||
      config.url.includes('/admin/') ||
      config.url.startsWith('/articles/') // Article detail pages might need auth
    );

    if (!isPublicGet || isAdminOperation || isAdminGet) {
      // Try admin token first, then regular token
      let token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Backend returned a response (4xx or 5xx)
      console.error('API Error:', error.response.data.message || error.message);
    } else {
      // Network or other errors
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for AI API with better timeout handling
aiApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      // Timeout error - provide more helpful message
      console.error('AI Operation Timeout:', error.message);
      console.log('Note: AI operations can take up to 60 seconds. Please try again.');
    } else if (error.response) {
      // Backend returned a response (4xx or 5xx)
      console.error('AI API Error:', error.response.data.message || error.message);
    } else {
      // Network or other errors
      console.error('AI Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
