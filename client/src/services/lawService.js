import axios from './api';
import { setAdminAuthHeader } from './adminService';

// ===== Get All Laws =====
export const getAllLaws = async () => {
  try {
    const response = await axios.get('/laws');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== Get Law by ID =====
export const getLawById = async (id) => {
  try {
    const response = await axios.get(`/laws/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== Create Law (Admin Only) =====
export const createLaw = async (lawData) => {
  try {
    setAdminAuthHeader();
    const response = await axios.post('/laws', lawData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== Update Law (Admin Only) =====
export const updateLaw = async (id, lawData) => {
  try {
    setAdminAuthHeader();
    const response = await axios.put(`/laws/${id}`, lawData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== Delete Law (Admin Only) =====
export const deleteLaw = async (id) => {
  try {
    setAdminAuthHeader();
    const response = await axios.delete(`/laws/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
