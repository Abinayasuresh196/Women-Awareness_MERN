// src/pages/user/UserLogin.jsx

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { login as authLogin } from "../../services/authService";
import "../../styles/login.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path and message from location state
  const from = location.state?.from?.pathname || "/home";
  const redirectMessage = location.state?.message;

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call authentication service
      const response = await authLogin({
        email: email.trim(),
        password
      });

      if (response.success) {
        // Login successful
        const { user, token, isAdmin } = response.data;

        console.log('Login successful - User data:', {
          user: user,
          token: token,
          isAdmin: isAdmin,
          role: user.role
        });

        // Store authentication data
        login(user, token, isAdmin);

        // Show success message
        toast.success(`Welcome back, ${user.name || 'User'}!`);

        // Redirect based on user role
        const isSuperAdmin = user.role === 'super-admin';
        const isRegularAdmin = user.role === 'admin';
        
        console.log('Role detection:', {
          isSuperAdmin: isSuperAdmin,
          isRegularAdmin: isRegularAdmin,
          userRole: user.role
        });
        
        if (isSuperAdmin || isRegularAdmin) {
          // Admin/superadmin redirect to admin dashboard
          console.log('Redirecting to admin dashboard');
          navigate('/admin/dashboard', { replace: true });
        } else {
          // Regular user redirect to intended page or default
          console.log('Redirecting to home page');
          navigate(from, { replace: true });
        }
      } else {
        // Login failed - show error message
        toast.error(response.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || "Login failed. Please try again.";
        toast.error(errorMessage);
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your internet connection.");
      } else {
        // Other error
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      toast.warn("Please enter your email address first");
      return;
    }
    // Navigate to forgot password page with email pre-filled
    navigate("/forgot-password", { state: { email: email.trim() } });
  };

  return (
    <div className="login-page">
      {/* LEFT */}
      <div className="login-left">
        <div className="login-card animate-card">
          {/* Show redirect message if exists */}
          {redirectMessage && (
            <div className="redirect-message" style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              color: '#856404',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {redirectMessage}
            </div>
          )}
          
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">
            Sign in to access women's empowerment resources
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "error-input" : ""}
                disabled={loading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "error-input" : ""}
                disabled={loading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
              <div className="forgot-wrapper" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button 
                  type="button" 
                  className="forgot-password-btn"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-btn" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="login-divider">or</div>

          <p className="login-bottom">
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right animate-image"></div>
    </div>
  );
};

export default UserLogin;
