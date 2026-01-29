/**
 * Admin Service
 * Handles all database operations related to Admins
 */

const Admin = require('../models/Admin.model');
const { hashPassword, comparePassword } = require('../utils/password');
const jwt = require('../utils/jwt');

class AdminService {
  /**
   * Register a new admin
   * @param {Object} adminData - { name, email, password, role }
   */
  static async register(adminData) {
    const { name, email, password, role } = adminData;

    // Check if email exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
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

    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };
  }

  /**
   * Admin login
   * @param {Object} credentials - { email, password }
   */
  static async login({ email, password }) {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, role: admin.role });

    return {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    };
  }

  /**
   * Get all admins
   */
  static async getAll() {
    const admins = await Admin.find().select('-password');
    return admins;
  }

  /**
   * Get single admin by ID
   * @param {string} adminId
   */
  static async getById(adminId) {
    const admin = await Admin.findById(adminId).select('-password');
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }

  /**
   * Update admin by ID
   * @param {string} adminId
   * @param {Object} updateData
   */
  static async update(adminId, updateData) {
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    const admin = await Admin.findByIdAndUpdate(adminId, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!admin) {
      throw new Error('Admin not found');
    }

    return admin;
  }

  /**
   * Delete admin by ID
   * @param {string} adminId
   */
  static async delete(adminId) {
    const admin = await Admin.findByIdAndDelete(adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }
    return true;
  }
}

module.exports = AdminService;
