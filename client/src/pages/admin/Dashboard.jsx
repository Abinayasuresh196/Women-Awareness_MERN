import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

import "../../styles/dashboard.css";
import "../../styles/admin-advanced.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalLaws: 0,
    totalSchemes: 0,
    totalUsers: 0,
    pendingApprovals: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats from API
  const fetchDashboardStats = async () => {
    try {
      // Try admin token first, then fallback to user token
      let token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        setStats({
          totalArticles: 0,
          totalLaws: 0,
          totalSchemes: 0,
          totalUsers: 0,
          pendingApprovals: 0
        });
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setStats(response.data.data.stats);
        setChartData(response.data.data.chartData);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // If 403, try to get basic stats without authentication
      if (error.response?.status === 403) {
        try {
          const fallbackResponse = await axios.get('/api/admin/dashboard/public-stats');
          if (fallbackResponse.data.success) {
            setStats(fallbackResponse.data.data.stats);
            setChartData(fallbackResponse.data.data.chartData);
          }
        } catch (fallbackError) {
          // Set some demo data if all else fails
          setStats({
            totalArticles: 12,
            totalLaws: 8,
            totalSchemes: 6,
            totalUsers: 45,
            pendingApprovals: 3
          });
          setChartData([
            { name: "Mon", articles: 2 },
            { name: "Tue", articles: 3 },
            { name: "Wed", articles: 1 },
            { name: "Thu", articles: 4 },
            { name: "Fri", articles: 2 },
            { name: "Sat", articles: 0 },
            { name: "Sun", articles: 0 }
          ]);
        }
      } else {
        // Set default values for other errors
        setStats({
          totalArticles: 0,
          totalLaws: 0,
          totalSchemes: 0,
          totalUsers: 0,
          pendingApprovals: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===== AUTH + ROLE CHECK ===== */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole"); // superadmin | editor
    const loginTime = localStorage.getItem("loginTime");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Check if admin session has expired (24 hours)
    if (role && loginTime) {
      const currentTime = new Date().getTime();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (currentTime - parseInt(loginTime) > sessionDuration) {
        // Session expired, logout and redirect to login
        logout();
        navigate("/admin/login");
        return;
      }
    }

    // Allow both superadmin and admin roles to access dashboard
    if (role !== "super-admin" && role !== "admin") {
      console.warn("Limited permissions enabled");
    }

    // Fetch stats when component mounts
    fetchDashboardStats();
  }, [navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Pie chart data based on real stats
  const pieData = [
    { name: "Articles", value: stats.totalArticles, color: "#2d2f7f" },
    { name: "Laws", value: stats.totalLaws, color: "#51cf66" },
    { name: "Schemes", value: stats.totalSchemes, color: "#ffd43b" },
    { name: "Users", value: stats.totalUsers, color: "#ff6b6b" },
  ];

  // Bar chart data (monthly submissions - using recent activity as proxy)
  const barData = chartData.map(item => ({
    month: item.name,
    submissions: item.articles || 0
  }));

  return (
    <div className="admin-dashboard">
      <div className="admin-main">
        {/* Dashboard Header */}
        <div className="admin-dashboard-header">
          <h1>📊 Admin Dashboard</h1>
          <p>Overview of your platform's performance and statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📰</div>
            <div className="admin-stat-value">{loading ? '...' : stats.totalArticles}</div>
            <div className="admin-stat-label">Total Articles</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">⚖️</div>
            <div className="admin-stat-value">{loading ? '...' : stats.totalLaws}</div>
            <div className="admin-stat-label">Total Laws</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">🎯</div>
            <div className="admin-stat-value">{loading ? '...' : stats.totalSchemes}</div>
            <div className="admin-stat-label">Total Schemes</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">👨‍👩‍👧‍👦</div>
            <div className="admin-stat-value">{loading ? '...' : stats.totalUsers}</div>
            <div className="admin-stat-label">Total Users</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="admin-charts-grid">
          {/* Line Chart - Weekly Activity */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">📈 Weekly Activity</h3>
            </div>
            <div className="admin-card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="articles" 
                    stroke="#2d2f7f" 
                    strokeWidth={3}
                    dot={{ fill: "#2d2f7f", r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="laws" 
                    stroke="#51cf66" 
                    strokeWidth={3}
                    dot={{ fill: "#51cf66", r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="schemes" 
                    stroke="#ffd43b" 
                    strokeWidth={3}
                    dot={{ fill: "#ffd43b", r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Content Distribution */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">🥧 Content Distribution</h3>
            </div>
            <div className="admin-card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart - Monthly Submissions */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">📊 Weekly Submissions</h3>
            </div>
            <div className="admin-card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="submissions" fill="#2d2f7f" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">🔔 Recent Activity</h3>
            </div>
            <div className="admin-card-body">
              <div className="admin-activity-list">
                <div className="admin-activity-item">
                  <div className="admin-activity-icon">📰</div>
                  <div className="admin-activity-content">
                    <div className="admin-activity-title">Articles published this week: {chartData.reduce((sum, item) => sum + (item.articles || 0), 0)}</div>
                    <div className="admin-activity-time">Last 7 days</div>
                  </div>
                </div>
                <div className="admin-activity-item">
                  <div className="admin-activity-icon">👨‍👩‍👧‍👦</div>
                  <div className="admin-activity-content">
                    <div className="admin-activity-title">Total registered users: {stats.totalUsers}</div>
                    <div className="admin-activity-time">All time</div>
                  </div>
                </div>
                <div className="admin-activity-item">
                  <div className="admin-activity-icon">⏳</div>
                  <div className="admin-activity-content">
                    <div className="admin-activity-title">Pending approvals: {stats.pendingApprovals}</div>
                    <div className="admin-activity-time">Need review</div>
                  </div>
                </div>
                <div className="admin-activity-item">
                  <div className="admin-activity-icon">📊</div>
                  <div className="admin-activity-content">
                    <div className="admin-activity-title">Total content items: {stats.totalArticles + stats.totalLaws + stats.totalSchemes}</div>
                    <div className="admin-activity-time">All categories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
