import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// User Pages
import Home from "./pages/user/Home";
import Laws from "./pages/user/Laws";
import Schemes from "./pages/user/Schemes";
import Awareness from "./pages/user/Awareness";
import About from "./pages/user/About";
import Articles from "./pages/user/Articles";
import ArticleDetails from "./pages/user/ArticleDetails";
import FIRGenerator from "./pages/user/FIRGenerator";
import WomenResources from "./pages/user/WomenResources";
import SchemeAI from "./pages/user/SchemeAI";
import GeneralNews from "./pages/user/GeneralNews";
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManageLaws from "./pages/admin/ManageLaws";
import ManageSchemes from "./pages/admin/ManageSchemes";
import ManageArticles from "./pages/admin/ManageArticles";
import ManageWomenResources from "./pages/admin/ManageWomenResources";
import ManageFeedback from "./pages/admin/ManageFeedback";

// Common
import ProtectedRoute from "./components/common/ProtectedRoute";
import ScrollToTop from "./components/common/ScrollToTop";

// Layouts
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// Main App Content Component
function AppContent() {
  return (
    <div className="app-wrapper">
      <div className="app-container">
        {/* Toast notifications temporarily disabled to fix white space issue */}
        {/* <ToastContainer
          position="bottom-right"
          autoClose={5000}
          theme="colored"
          className="toast-notification"
          style={{ margin: 0, padding: 0 }}
        /> */}
        <ScrollToTop />
        <Routes>
            {/* Public Routes - No Login Required */}
            <Route path="/" element={<UserLayout><Home /></UserLayout>} />
            <Route path="/home" element={<UserLayout><Home /></UserLayout>} />
            <Route path="/about" element={<UserLayout><About /></UserLayout>} />
            <Route path="/laws" element={<UserLayout><Laws /></UserLayout>} />
            <Route path="/schemes" element={<UserLayout><Schemes /></UserLayout>} />
            <Route path="/awareness" element={<UserLayout><Awareness /></UserLayout>} />
            <Route path="/women-resources" element={<UserLayout><WomenResources /></UserLayout>} />
            <Route path="/general-news" element={<UserLayout><GeneralNews /></UserLayout>} />
            
            {/* Auth Routes - No Layout */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />

            {/* Protected Routes - Login Required */}
            <Route element={<ProtectedRoute allowedRoles={["user", "admin", "super-admin"]} />}>
              <Route path="/articles" element={<UserLayout><Articles /></UserLayout>} />
              <Route path="/articles/:id" element={<UserLayout><ArticleDetails /></UserLayout>} />
              <Route path="/fir-generator" element={<UserLayout><FIRGenerator /></UserLayout>} />
              <Route path="/scheme-ai" element={<UserLayout><SchemeAI /></UserLayout>} />
            </Route>

            {/* Admin Routes with AdminLayout */}
            <Route element={<ProtectedRoute allowedRoles={["admin", "super-admin"]} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/manage-laws" element={<ManageLaws />} />
                <Route path="/admin/manage-schemes" element={<ManageSchemes />} />
                <Route path="/admin/manage-articles" element={<ManageArticles />} />
                <Route path="/admin/women-resources" element={<ManageWomenResources />} />
                <Route path="/admin/feedback" element={<ManageFeedback />} />
              </Route>
            </Route>
            
            {/* Catch-all fallback */}
            <Route path="*" element={<div style={{ textAlign: "center", marginTop: "50px" }}>
              <h2>404 - Page Not Found</h2>
            </div>} />
          </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
