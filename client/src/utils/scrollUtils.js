// Direct scroll utility functions
export const forceScrollToTop = () => {
  try {
    // Method 1: Direct window scroll to 0
    window.scrollTo(0, 0);
    
    // Method 2: Force scroll position variables
    window.scrollX = 0;
    window.scrollY = 0;
    
    // Method 3: Direct DOM manipulation
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Method 4: Multiple immediate scrolls
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Method 5: setTimeout for additional force
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 1);
    
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 5);
    
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 10);
    
    console.log('🔥 FORCE scroll to top executed');
  } catch (error) {
    console.warn('Scroll error:', error);
  }
};

// Global scroll reset function
export const globalScrollReset = () => {
  try {
    // Force immediate scroll to top
    window.scrollTo(0, 0);
    
    // Force scroll position to 0
    window.scrollX = 0;
    window.scrollY = 0;
    
    // Force document scroll to 0
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Force window scroll to 0 again
    window.scrollTo(0, 0);
    
    console.log('🔥 Global scroll reset executed');
  } catch (error) {
    console.warn('Global scroll reset error:', error);
  }
};

// Add event listeners for scroll reset
export const setupScrollReset = () => {
  // Add event listener for popstate (browser back/forward)
  window.addEventListener('popstate', globalScrollReset);
  
  // Add event listener for page show (when returning to page)
  window.addEventListener('pageshow', globalScrollReset);
  
  // Add event listener for scroll events to catch any scroll restoration
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 1);
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: false });
  
  // Initial scroll reset
  globalScrollReset();
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('popstate', globalScrollReset);
    window.removeEventListener('pageshow', globalScrollReset);
  };
};
