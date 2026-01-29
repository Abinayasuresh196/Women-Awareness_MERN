import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loader from "./Loader";

/**
 * ProtectedRoute
 * @param {Array} allowedRoles - roles allowed to access this route
 *
 * Usage:
 * <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
 *    <Route path="/admin/dashboard" element={<Dashboard />} />
 * </Route>
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  /* 🔄 While checking authentication */
  if (loading) {
    return <Loader fullScreen />;
  }

  /* 🚫 Not logged in */
  if (!user) {
    // Show message and redirect to login
    const message = "Please login to access this feature";
    alert(message);
    
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: message }}
        replace
      />
    );
  }

  /* ⏰ Check admin session expiry */
  if (user.role && (user.role === 'admin' || user.role === 'super-admin')) {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime) {
      const currentTime = new Date().getTime();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (currentTime - parseInt(loginTime) > sessionDuration) {
        // Session expired, redirect to login
        alert("Your admin session has expired. Please login again.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRole");
        localStorage.removeItem("loginTime");
        
        return (
          <Navigate
            to="/login"
            state={{ from: location, message: "Your session has expired. Please login again." }}
            replace
          />
        );
      }
    }
  }

  /* ⛔ Role not allowed */
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Check for admin roles (handle both 'admin' and 'super-admin')
    const isAdmin = user.role === "admin" || user.role === "super-admin";
    
    // If user is admin but trying to access user routes, redirect to admin dashboard
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // If user is regular user trying to access admin routes, redirect to home
    return <Navigate to="/home" replace />;
  }

  /* ✅ Authorized */
  return <Outlet />;
};

/**
 * AuthGuard - Redirects based on authentication status
 * Shows login if not authenticated, redirects to appropriate dashboard if authenticated
 */
export const AuthGuard = () => {
  const { user, loading } = useAuth();

  /* 🔄 While checking authentication */
  if (loading) {
    return <Loader fullScreen />;
  }

  /* 🚫 Not logged in - show login */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* ⏰ Check admin session expiry */
  if (user.role && (user.role === 'admin' || user.role === 'super-admin')) {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime) {
      const currentTime = new Date().getTime();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (currentTime - parseInt(loginTime) > sessionDuration) {
        // Session expired, redirect to login
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRole");
        localStorage.removeItem("loginTime");
        
        return (
          <Navigate
            to="/login"
            state={{ message: "Your admin session has expired. Please login again." }}
            replace
          />
        );
      }
    }
  }

  /* ✅ Logged in - redirect to appropriate dashboard */
  const isAdmin = user.role === "admin" || user.role === "super-admin";
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/home" replace />;
  }
};

export default ProtectedRoute;
