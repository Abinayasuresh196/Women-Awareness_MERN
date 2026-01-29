// ==========================
// API BASE URL
// ==========================
export const BASE_API_URL = 'http://localhost:5000/api';

// ==========================
// USER ROLES
// ==========================
export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  USER: 'user',
};

// ==========================
// LOCAL STORAGE KEYS
// ==========================
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
};

// ==========================
// PAGINATION / LIMITS
// ==========================
export const DEFAULT_PAGE_SIZE = 10;

// ==========================
// DEFAULT MESSAGES
// ==========================
export const MESSAGES = {
  NETWORK_ERROR: 'Network error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SUCCESS: 'Operation successful!',
  FAILURE: 'Something went wrong. Please try again.',
};
