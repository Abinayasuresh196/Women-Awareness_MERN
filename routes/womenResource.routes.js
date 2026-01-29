const express = require('express');
const womenResourceController = require('../controllers/womenResource.controller');
const womenResourceValidation = require('../validations/womenResource.validation');
const protect = require('../middleware/auth.middleware'); // JWT auth
const authorize = require('../middleware/role.middleware'); // Role-based access
const validate = require('../middleware/validate.middleware');

const router = express.Router();

// Public routes
router.get('/by-category', womenResourceController.getResourcesByCategory);
router.get('/search', womenResourceController.searchResources);
router.get('/', womenResourceController.getResources);
router.get('/:id', womenResourceController.getResource);

const {
  createWomenResource,
  updateWomenResource,
  getWomenResources,
  getWomenResource,
  deleteWomenResource
} = womenResourceValidation;

// Admin only routes
router.post(
  '/',
  protect,
  authorize('admin', 'super-admin'),
  validate(womenResourceValidation.createWomenResource),
  womenResourceController.createResource
);

router.patch(
  '/:id',
  protect,
  authorize('admin', 'super-admin'),
  validate(womenResourceValidation.updateWomenResource),
  womenResourceController.updateResource
);

router.delete(
  '/:id',
  protect,
  authorize('super-admin'),
  validate(womenResourceValidation.deleteWomenResource),
  womenResourceController.deleteResource
);

// Admin stats route
router.get(
  '/admin/stats',
  protect,
  authorize('admin', 'super-admin'),
  womenResourceController.getResourceStats
);

module.exports = router;
