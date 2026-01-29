// ==========================
// FORMAT DATE
// ==========================
export const formatDate = (dateString, options = {}) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      ...options 
    });
  } catch (error) {
    console.error('formatDate error:', error);
    return dateString;
  }
};

// ==========================
// TRUNCATE TEXT
// ==========================
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// ==========================
// HANDLE API ERRORS
// ==========================
export const handleApiError = (error) => {
  if (!error) return 'Something went wrong';
  
  if (error.response) {
    // Server responded with a status
    return error.response.data.message || `Error: ${error.response.status}`;
  } else if (error.request) {
    // Request was made but no response
    return 'No response from server. Please try again.';
  } else {
    // Something else
    return error.message || 'An unexpected error occurred.';
  }
};

// ==========================
// CHECK USER ROLE
// ==========================
export const isRole = (user, role) => {
  if (!user || !user.role) return false;
  return user.role === role;
};

// ==========================
// SCROLL TO TOP
// ==========================
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
