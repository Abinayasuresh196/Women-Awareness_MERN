import axios from './api';
import { setAdminAuthHeader } from './adminService';

// ===== Get All Schemes =====
export const getAllSchemes = async () => {
  try {
    const response = await axios.get('/schemes');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== Get Scheme by ID =====
export const getSchemeById = async (id) => {
  try {
    const response = await axios.get(`/schemes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== Create Scheme (Admin Only) =====
export const createScheme = async (schemeData) => {
  try {
    setAdminAuthHeader();
    const response = await axios.post('/schemes', schemeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== Update Scheme (Admin Only) =====
export const updateScheme = async (id, schemeData) => {
  try {
    setAdminAuthHeader();
    const response = await axios.put(`/schemes/${id}`, schemeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== Delete Scheme (Admin Only) =====
export const deleteScheme = async (id) => {
  try {
    setAdminAuthHeader();
    const response = await axios.delete(`/schemes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
