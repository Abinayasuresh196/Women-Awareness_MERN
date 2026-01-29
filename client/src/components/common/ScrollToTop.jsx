import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Primary Window Scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // 2. Backup for HTML and Body
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, behavior: 'instant' });

    // 3. THE FIX: Find any scrolling div and reset it
    // Sila layouts-la inner container thaan scroll aagum, athai ithu fix pannum
    const scrollableContainers = document.querySelectorAll('.main-content, .app-container, main, .user-content, .admin-main, .page-container, .page-content');
    scrollableContainers.forEach(container => {
      container.scrollTop = 0;
    });

    // 4. Additional force methods for stubborn layouts
    try {
      // Force scroll position variables
      window.scrollX = 0;
      window.scrollY = 0;
      
      // Multiple immediate scrolls
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // setTimeout for additional force
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
    } catch (error) {
      console.warn('Scroll error:', error);
    }

    console.log('🚀 Forced scroll to top for:', pathname);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
