// ===========================================
// User Authentication Service
// Handles Register, Login, and Token Storage
// ===========================================

import axios from './api'; // Axios instance with baseURL and headers

// ===== Register User =====
export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/users/register', userData);
    // Save token to localStorage
    if (response.data.token) localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Register User Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ===== Login User =====
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('/users/login', credentials);
    // Save token to localStorage
    if (response.data.token) localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login User Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ===== Login Admin =====
export const loginAdmin = async (credentials) => {
  try {
    const response = await axios.post('/admin/login', credentials);
    // Save admin token to localStorage
    if (response.data.token) localStorage.setItem('adminToken', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login Admin Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ===== Login (for use in components) - Unified Login =====
export const login = async (credentials) => {
  try {
    // First try admin login
    const adminResponse = await axios.post('/admin/login', credentials);
    return {
      success: true,
      data: {
        user: adminResponse.data.data,
        token: adminResponse.data.token,
        isAdmin: true
      }
    };
  } catch (adminError) {
    try {
      // If admin login fails, try user login
      const userResponse = await axios.post('/users/login', credentials);
      
      // Check if user has admin role (super-admin, admin)
      const userRole = userResponse.data.user?.role;
      const isAdmin = userRole === 'admin' || userRole === 'super-admin';
      
      console.log('User login response:', {
        user: userResponse.data.user,
        role: userRole,
        isAdmin: isAdmin
      });
      
      return {
        success: true,
        data: {
          user: userResponse.data.user,
          token: userResponse.data.token,
          isAdmin: isAdmin
        }
      };
    } catch (userError) {
      console.error('Login Error:', adminError.response?.data || userError.response?.data || adminError.message || userError.message);
      return {
        success: false,
        message: adminError.response?.data?.message || userError.response?.data?.message || 'Invalid credentials'
      };
    }
  }
};

// ===== Logout User =====
export const logoutUser = () => {
  localStorage.removeItem('token');
};

// ===== Get Auth Token =====
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// ===== Set Auth Header =====
// Call this in axios instance or before API requests
export const setAuthHeader = () => {
  const token = getAuthToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
