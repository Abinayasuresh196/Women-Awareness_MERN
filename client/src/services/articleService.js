import axios from './api';
import { setAdminAuthHeader } from './adminService';

// ===== Get All Articles =====
export const getAllArticles = async () => {
  try {
    const response = await axios.get('/articles');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== Get Article by ID =====
export const getArticleById = async (id) => {
  try {
    const response = await axios.get(`/articles/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== Create Article (Admin Only) =====
export const createArticle = async (articleData) => {
  try {
    setAdminAuthHeader();
    const response = await axios.post('/articles', articleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== Update Article (Admin Only) =====
export const updateArticle = async (id, articleData) => {
  try {
    setAdminAuthHeader();
    const response = await axios.put(`/articles/${id}`, articleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ===== Delete Article (Admin Only) =====
export const deleteArticle = async (id) => {
  try {
    setAdminAuthHeader();
    const response = await axios.delete(`/articles/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
