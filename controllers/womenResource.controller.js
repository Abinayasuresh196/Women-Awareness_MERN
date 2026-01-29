const womenResourceService = require('../services/womenResource.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

/**
 * Create a new women resource
 * @route POST /api/women-resources
 * @access Admin, SuperAdmin
 */
const createResource = catchAsync(async (req, res) => {
  const resource = await womenResourceService.createResource(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Women resource created successfully',
    data: resource
  });
});

/**
 * Get all women resources with filtering and pagination
 * @route GET /api/women-resources
 * @access Public
 */
const getResources = catchAsync(async (req, res) => {
  console.log('Controller: Full req.query:', req.query);
  const filter = pick(req.query || {}, ['category', 'type']);
  const options = {
    language: req.query.language || 'en',
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
    sortBy: req.query.sort || 'priority',
    sortOrder: req.query.sortOrder || 'desc'
  };
  console.log('Controller: Direct options:', options);

  // Handle category array from query string
  if (req.query.category && typeof req.query.category === 'string') {
    try {
      filter.category = JSON.parse(req.query.category);
    } catch (e) {
      // If parsing fails, treat as single value
      filter.category = req.query.category;
    }
  }

  const result = await womenResourceService.getResources(filter, options);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

/**
 * Get resources grouped by category
 * @route GET /api/women-resources/by-category
 * @access Public
 */
const getResourcesByCategory = catchAsync(async (req, res) => {
  const { language = 'en' } = req.query;

  const resources = await womenResourceService.getResourcesByCategory(language);

  res.status(200).json({
    status: 'success',
    data: resources
  });
});

/**
 * Get single resource by ID
 * @route GET /api/women-resources/:id
 * @access Public
 */
const getResource = catchAsync(async (req, res) => {
  const { language = 'en' } = req.query;

  const resource = await womenResourceService.getResourceById(req.params.id, language);

  res.status(200).json({
    status: 'success',
    data: resource
  });
});

/**
 * Update resource by ID
 * @route PATCH /api/women-resources/:id
 * @access Admin, SuperAdmin
 */
const updateResource = catchAsync(async (req, res) => {
  const resource = await womenResourceService.updateResource(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Women resource updated successfully',
    data: resource
  });
});

/**
 * Delete resource by ID
 * @route DELETE /api/women-resources/:id
 * @access Admin, SuperAdmin
 */
const deleteResource = catchAsync(async (req, res) => {
  const result = await womenResourceService.deleteResource(req.params.id);

  res.status(200).json({
    status: 'success',
    message: result.message
  });
});

/**
 * Search resources
 * @route GET /api/women-resources/search
 * @access Public
 */
const searchResources = catchAsync(async (req, res) => {
  const { q: query, language = 'en', limit = 20 } = req.query;

  if (!query || query.trim().length < 2) {
    throw new ApiError(400, 'Search query must be at least 2 characters long');
  }

  const results = await womenResourceService.searchResources(query.trim(), language, { limit });

  res.status(200).json({
    status: 'success',
    data: results
  });
});

/**
 * Get resource statistics
 * @route GET /api/women-resources/stats
 * @access Admin, SuperAdmin
 */
const getResourceStats = catchAsync(async (req, res) => {
  const stats = await womenResourceService.getResourceStats();

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

module.exports = {
  createResource,
  getResources,
  getResourcesByCategory,
  getResource,
  updateResource,
  deleteResource,
  searchResources,
  getResourceStats
};
