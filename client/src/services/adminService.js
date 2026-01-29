// ===========================================
// Admin Service
// Handles Admin Authentication & CRUD
// ===========================================

import axios from './api'; // Axios instance with baseURL and headers
import { getAuthToken } from './authService'; // Optional if you want to reuse token

// ===== Admin Login =====
export const loginAdmin = async (credentials) => {
  try {
    const response = await axios.post('/admin/login', credentials);
    // Save token and user data to localStorage
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminRole', response.data.data?.role || 'admin');
      localStorage.setItem('adminUser', JSON.stringify(response.data.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    let errorMessage = 'Admin login failed';
    if (error.response) {
      // Server responded with error
      if (error.response.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response.status === 404) {
        errorMessage = 'Admin account not found';
      } else {
        errorMessage = error.response.data.message || 'Admin login failed';
      }
    } else if (error.request) {
      // No response received
      errorMessage = 'Network error. Please check your connection';
    } else {
      // Other errors
      errorMessage = error.message || 'Admin login failed';
    }

    console.error('Admin Login Error:', errorMessage);
    throw { message: errorMessage, status: error.response?.status };
  }
};

// ===== Logout Admin =====
export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  delete axios.defaults.headers.common['Authorization'];
};

// ===== Set Auth Header =====
export const setAdminAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// ===== Get All Admins =====
export const getAllAdmins = async () => {
  try {
    setAdminAuthHeader();
    const response = await axios.get('/admin');
    return response.data;
  } catch (error) {
    console.error('Get All Admins Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ===== Get Admin by ID =====
export const getAdminById = async (id) => {
  try {
    setAdminAuthHeader();
    const response = await axios.get(`/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get Admin Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ===== Create Admin =====
export const createAdmin = async (adminData) => {
  try {
    setAdminAuthHeader();
    const response = await axios.post('/admin', adminData);
    return response.data;
  } catch (error) {
    console.error('Create Admin Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ===== Update Admin =====
export const updateAdmin = async (id, adminData) => {
  try {
    setAdminAuthHeader();
    const response = await axios.put(`/admin/${id}`, adminData);
    return response.data;
  } catch (error) {
    console.error('Update Admin Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ===== Delete Admin =====
export const deleteAdmin = async (id) => {
  try {
    setAdminAuthHeader();
    const response = await axios.delete(`/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Admin Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
