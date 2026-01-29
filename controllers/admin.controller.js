/**
 * Admin Controller
 * Handles all admin-related operations
 */

const Admin = require('../models/Admin.model');
const { hashPassword, comparePassword } = require('../utils/password');
const jwt = require('../utils/jwt');
const logger = require('../utils/logger');

/* ============================
   REGISTER NEW ADMIN
============================ */
exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ============================
   GET DASHBOARD STATS (PUBLIC - NO AUTH)
============================ */
exports.getPublicDashboardStats = async (req, res, next) => {
  try {
    const Law = require('../models/Law.model');
    const Scheme = require('../models/Scheme.model');
    const Article = require('../models/Article.model');
    const User = require('../models/User.model');

    // Get counts from database
    const [totalArticles, totalLaws, totalSchemes, totalUsers] = await Promise.all([
      Article.countDocuments(),
      Law.countDocuments(),
      Scheme.countDocuments(),
      User.countDocuments()
    ]);

    // Get pending approvals (articles with status 'pending' or similar)
    const pendingApprovals = await Article.countDocuments({
      status: { $in: ['pending', 'draft'] }
    });

    // Get recent activity (articles from last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentArticles = await Article.find({
      createdAt: { $gte: sevenDaysAgo }
    }).select('createdAt').sort({ createdAt: -1 });

    // Group by day for chart
    const chartData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];

      const count = recentArticles.filter(article => {
        const articleDate = new Date(article.createdAt);
        return articleDate.toDateString() === date.toDateString();
      }).length;

      chartData.push({
        name: dayName,
        articles: count
      });
    }

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalArticles,
          totalLaws,
          totalSchemes,
          totalUsers,
          pendingApprovals
        },
        chartData
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ============================
   GET DASHBOARD STATS
============================ */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const Law = require('../models/Law.model');
    const Scheme = require('../models/Scheme.model');
    const Article = require('../models/Article.model');
    const User = require('../models/User.model');

    // Get counts from database
    const [totalArticles, totalLaws, totalSchemes, totalUsers] = await Promise.all([
      Article.countDocuments(),
      Law.countDocuments(),
      Scheme.countDocuments(),
      User.countDocuments()
    ]);

    // Get pending approvals (articles with status 'pending' or similar)
    const pendingApprovals = await Article.countDocuments({
      status: { $in: ['pending', 'draft'] }
    });

    // Get recent activity (articles from last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentArticles = await Article.find({
      createdAt: { $gte: sevenDaysAgo }
    }).select('createdAt').sort({ createdAt: -1 });

    // Group by day for chart
    const chartData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];

      const count = recentArticles.filter(article => {
        const articleDate = new Date(article.createdAt);
        return articleDate.toDateString() === date.toDateString();
      }).length;

      chartData.push({
        name: dayName,
        articles: count
      });
    }

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalArticles,
          totalLaws,
          totalSchemes,
          totalUsers,
          pendingApprovals
        },
        chartData
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ============================
   ADMIN LOGIN
============================ */
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.generateToken({ id: admin._id, role: admin.role });

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      token,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ============================
   GET ALL ADMINS
============================ */
exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select('-password'); // exclude passwords
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (err) {
    next(err);
  }
};

/* ============================
   GET SINGLE ADMIN BY ID
============================ */
exports.getAdminById = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (err) {
    next(err);
  }
};

/* ============================
   UPDATE ADMIN
============================ */
exports.updateAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const updateData = { name, email, role };

    // If password provided, hash it
    if (password) {
      updateData.password = await hashPassword(password);
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: admin
    });
  } catch (err) {
    next(err);
  }
};

/* ============================
   DELETE ADMIN
============================ */
exports.deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
