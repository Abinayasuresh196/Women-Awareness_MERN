const WomenResource = require('../models/WomenResource.model');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Create a new women resource
 * @param {Object} resourceData - Resource data
 * @returns {Promise<Object>} Created resource
 */
const createResource = async (resourceData) => {
  try {
    const resource = new WomenResource(resourceData);
    await resource.save();
    logger.info(`Women resource created: ${resource._id}`);
    return resource;
  } catch (error) {
    logger.error('Error creating women resource:', error);
    throw new ApiError(500, 'Failed to create women resource');
  }
};

/**
 * Get all women resources with filtering and pagination
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Resources with pagination info
 */
const getResources = async (filter = {}, options = {}) => {
  try {
    const {
      category,
      type,
      language = 'en',
      page,
      limit = 4,
      search,
      sortBy = 'priority',
      sortOrder = 'desc'
    } = options;

    // Set defaults if not provided
    const finalPage = parseInt(page) || 1;
    const finalLimit = parseInt(limit) || 4;

    console.log(`Backend: Raw params - page: ${page} (${typeof page}), limit: ${limit} (${typeof limit})`);
    console.log(`Backend: Final values - finalPage: ${finalPage}, finalLimit: ${finalLimit}`);

    // Build filter object
    const queryFilter = { isActive: true };

    if (category) {
      if (Array.isArray(category)) {
        queryFilter.category = { $in: category };
      } else {
        queryFilter.category = category;
      }
    }

    if (type) {
      queryFilter.type = type;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      queryFilter.$or = [
        { [`title.${language}`]: searchRegex },
        { [`description.${language}`]: searchRegex },
        { tags: { $in: [searchRegex] } },
        { category: searchRegex },
        { type: searchRegex }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get total count for pagination first
    const total = await WomenResource.countDocuments(queryFilter);

    // Calculate pagination
    const skip = (finalPage - 1) * finalLimit;

    // Execute query
    const resources = await WomenResource
      .find(queryFilter)
      .sort(sort)
      .skip(skip)
      .limit(finalLimit)
      .select({
        title: 1,
        description: 1,
        link: 1,
        category: 1,
        type: 1,
        benefits: 1,
        features: 1,
        services: 1,
        contact: 1,
        priority: 1,
        tags: 1,
        createdAt: 1
      });

    console.log(`Backend: Page ${finalPage}, Skip ${skip}, Limit ${finalLimit}`);
    console.log('Backend: Returned resource IDs:', resources.map(r => ({ id: r._id, title: r.title.en, priority: r.priority })));

    // Localize resources
    const localizedResources = resources.map(resource => resource.getLocalized(language));

    return {
      resources: localizedResources,
      pagination: {
        page: parseInt(finalPage),
        limit: parseInt(finalLimit),
        total,
        pages: Math.ceil(total / finalLimit),
        hasNext: finalPage * finalLimit < total,
        hasPrev: finalPage > 1
      }
    };
  } catch (error) {
    logger.error('Error getting women resources:', error);
    throw new ApiError(500, 'Failed to get women resources');
  }
};

/**
 * Get resources grouped by category
 * @param {string} language - Language preference
 * @returns {Promise<Object>} Resources grouped by category
 */
const getResourcesByCategory = async (language = 'en') => {
  try {
    const categories = ['Emergency', 'Safety', 'Education', 'Health', 'Legal', 'Financial', 'NGO', 'Government', 'International', 'Digital'];
    const result = {};

    for (const category of categories) {
      const resources = await WomenResource
        .find({ category, isActive: true })
        .sort({ priority: -1, createdAt: -1 })
        .select({
          title: 1,
          description: 1,
          link: 1,
          category: 1,
          type: 1,
          benefits: 1,
          features: 1,
          services: 1,
          contact: 1,
          priority: 1,
          tags: 1,
          createdAt: 1
        });

      result[category.toLowerCase().replace(' ', '-')] = resources.map(resource => resource.getLocalized(language));
    }

    return result;
  } catch (error) {
    logger.error('Error getting resources by category:', error);
    throw new ApiError(500, 'Failed to get resources by category');
  }
};

/**
 * Get single resource by ID
 * @param {string} resourceId - Resource ID
 * @param {string} language - Language preference
 * @returns {Promise<Object>} Resource data
 */
const getResourceById = async (resourceId, language = 'en') => {
  try {
    const resource = await WomenResource.findOne({ _id: resourceId, isActive: true });

    if (!resource) {
      throw new ApiError(404, 'Women resource not found');
    }

    return resource.getLocalized(language);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Error getting women resource by ID:', error);
    throw new ApiError(500, 'Failed to get women resource');
  }
};

/**
 * Update resource by ID
 * @param {string} resourceId - Resource ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated resource
 */
const updateResource = async (resourceId, updateData) => {
  try {
    const resource = await WomenResource.findOneAndUpdate(
      { _id: resourceId, isActive: true },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!resource) {
      throw new ApiError(404, 'Women resource not found');
    }

    logger.info(`Women resource updated: ${resourceId}`);
    return resource;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Error updating women resource:', error);
    throw new ApiError(500, 'Failed to update women resource');
  }
};

/**
 * Delete resource by ID (soft delete)
 * @param {string} resourceId - Resource ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteResource = async (resourceId) => {
  try {
    const resource = await WomenResource.findOneAndUpdate(
      { _id: resourceId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!resource) {
      throw new ApiError(404, 'Women resource not found');
    }

    logger.info(`Women resource deleted (soft): ${resourceId}`);
    return { message: 'Women resource deleted successfully' };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Error deleting women resource:', error);
    throw new ApiError(500, 'Failed to delete women resource');
  }
};

/**
 * Search resources
 * @param {string} query - Search query
 * @param {string} language - Language preference
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Search results
 */
const searchResources = async (query, language = 'en', options = {}) => {
  try {
    const { limit = 4 } = options;

    const resources = await WomenResource.search(query, language)
      .limit(limit)
      .select({
        title: 1,
        description: 1,
        link: 1,
        category: 1,
        type: 1,
        benefits: 1,
        features: 1,
        services: 1,
        contact: 1,
        priority: 1,
        tags: 1,
        createdAt: 1
      });

    return resources.map(resource => resource.getLocalized(language));
  } catch (error) {
    logger.error('Error searching women resources:', error);
    throw new ApiError(500, 'Failed to search women resources');
  }
};

/**
 * Get resource statistics
 * @returns {Promise<Object>} Statistics
 */
const getResourceStats = async () => {
  try {
    const stats = await WomenResource.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byCategory: {
            $push: '$category'
          },
          byType: {
            $push: '$type'
          },
          avgPriority: { $avg: '$priority' }
        }
      }
    ]);

    if (stats.length === 0) {
      return {
        total: 0,
        byCategory: {},
        byType: {},
        avgPriority: 0
      };
    }

    const result = stats[0];

    // Count by category
    const categoryCount = {};
    result.byCategory.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    // Count by type
    const typeCount = {};
    result.byType.forEach(type => {
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return {
      total: result.total,
      byCategory: categoryCount,
      byType: typeCount,
      avgPriority: Math.round(result.avgPriority * 10) / 10
    };
  } catch (error) {
    logger.error('Error getting resource stats:', error);
    throw new ApiError(500, 'Failed to get resource statistics');
  }
};

module.exports = {
  createResource,
  getResources,
  getResourcesByCategory,
  getResourceById,
  updateResource,
  deleteResource,
  searchResources,
  getResourceStats
};
