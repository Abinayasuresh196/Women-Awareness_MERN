import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/adminService";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import "../../styles/login.css";
import "../../styles/admin-advanced.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginAdmin({ email, password });

      if (response.success) {
        // Use the useAuth hook to properly set up the admin session with timestamp
        login(response.data.data, response.data.token, true);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect to unified login page
  const handleRedirectToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <p className="subtitle">Use the unified login page for admin access</p>
        
        <div className="redirect-message">
          <p>Both admin and user accounts can now use the same login page.</p>
          <p>Based on your role, you will be automatically redirected to the appropriate dashboard.</p>
        </div>

        <button type="button" className="redirect-btn" onClick={handleRedirectToLogin}>
          Go to Login Page
        </button>

        {/* Legacy form for direct admin access (optional) */}
        <div className="divider">OR</div>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? <Loader small /> : "Admin Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
