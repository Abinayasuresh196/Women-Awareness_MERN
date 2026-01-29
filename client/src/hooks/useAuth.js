import { useState, useEffect, useCallback } from "react";

/**
 * useAuth
 * Handles authentication state using localStorage
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoize the auth check function to prevent infinite loops
  const checkAuth = useCallback(() => {
    try {
      // Check for admin session first
      const adminUser = localStorage.getItem("adminUser");
      const adminToken = localStorage.getItem("adminToken");
      const adminRole = localStorage.getItem("adminRole");
      const loginTime = localStorage.getItem("loginTime");

      // Check for regular user session
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      // Prioritize admin session if both exist
      if (adminUser && adminToken) {
        const userData = JSON.parse(adminUser);

        // Add role to user data if not present
        if (adminRole && !userData.role) {
          userData.role = adminRole;
        }

        // Check if admin session should auto-expire (24 hours for all admin roles)
        if (adminRole && loginTime) {
          const currentTime = new Date().getTime();
          const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

          if (currentTime - parseInt(loginTime) > sessionDuration) {
            // Auto logout admin after 24 hours
            localStorage.removeItem("adminUser");
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminRole");
            localStorage.removeItem("loginTime");
            setUser(null);
            setToken(null);
            setLoading(false);
            return;
          }
        }

        setUser(userData);
        setToken(adminToken);
      }
      // Fall back to regular user session
      else if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);

        // Check if user session should auto-expire (only for admin roles)
        if (userData.role && (userData.role === 'admin' || userData.role === 'super-admin') && loginTime) {
          const currentTime = new Date().getTime();
          const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

          if (currentTime - parseInt(loginTime) > sessionDuration) {
            // Auto logout admin after 24 hours
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("adminRole");
            localStorage.removeItem("loginTime");
            setUser(null);
            setToken(null);
            setLoading(false);
            return;
          }
        }

        setUser(userData);
        setToken(storedToken);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("useAuth error:", error);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false); // ✅ auth check completed
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /* 🔐 Login helper */
  const login = useCallback((userData, authToken, isAdmin = false) => {
    if (isAdmin) {
      localStorage.setItem("adminUser", JSON.stringify(userData));
      localStorage.setItem("adminToken", authToken);
      if (userData.role) {
        localStorage.setItem("adminRole", userData.role);
      }
      // Clear user tokens when admin logs in
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", authToken);
      // Clear admin tokens when user logs in
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRole");
    }

    // Store login time for session management (admin auto-logout after 24 hours)
    if (userData.role && (userData.role === 'admin' || userData.role === 'super-admin')) {
      localStorage.setItem("loginTime", new Date().getTime().toString());
    }

    setUser(userData);
    setToken(authToken);
  }, []);

  /* 🚪 Logout helper */
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("loginTime");
    setUser(null);
    setToken(null);
  }, []);

  /* 🚪 Logout with redirect to home */
  const logoutWithRedirect = useCallback((navigate) => {
    logout();
    if (navigate) {
      navigate("/home", { replace: true });
    }
  }, [logout]);

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    logoutWithRedirect,
  };
};
