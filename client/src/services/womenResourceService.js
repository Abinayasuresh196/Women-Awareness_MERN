import api from './api';

const womenResourceService = {
  // Get all women resources with filtering
  getResources: async (params = {}) => {
    try {
      const response = await api.get('/women-resources', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching women resources:', error);
      throw error;
    }
  },

  // Get resources grouped by category
  getResourcesByCategory: async (language = 'en') => {
    try {
      const response = await api.get('/women-resources/by-category', {
        params: { language }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching resources by category:', error);
      throw error;
    }
  },

  // Get single resource by ID
  getResourceById: async (id, language = 'en') => {
    try {
      const response = await api.get(`/women-resources/${id}`, {
        params: { language }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching resource by ID:', error);
      throw error;
    }
  },

  // Search resources
  searchResources: async (query, language = 'en', limit = 20) => {
    try {
      const response = await api.get('/women-resources/search', {
        params: { q: query, language, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching resources:', error);
      throw error;
    }
  },

  // Create new resource (Admin only)
  createResource: async (resourceData) => {
    try {
      const response = await api.post('/women-resources', resourceData);
      return response.data;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  },

  // Update resource (Admin only)
  updateResource: async (id, resourceData) => {
    try {
      const response = await api.patch(`/women-resources/${id}`, resourceData);
      return response.data;
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  },

  // Delete resource (Admin only)
  deleteResource: async (id) => {
    try {
      const response = await api.delete(`/women-resources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },

  // Get resource statistics (Admin only)
  getResourceStats: async () => {
    try {
      const response = await api.get('/women-resources/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching resource stats:', error);
      throw error;
    }
  }
};

export default womenResourceService;
