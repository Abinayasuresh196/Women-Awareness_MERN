/**
 * Admin Model
 * Stores admin user details
 */

const mongoose = require('mongoose');
const { hashPassword } = require('../utils/password');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false // Do not return password by default
    },
    role: {
      type: String,
      enum: ['admin', 'super-admin'],
      default: 'admin'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

/* ==========================
   PASSWORD HASHING BEFORE SAVE
========================== */
adminSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  try {
    const hashedPassword = await hashPassword(this.password);
    this.password = hashedPassword;
  } catch (error) {
    console.error('Error in password hashing:', error);
    throw error;
  }
});

/* ==========================
   INSTANCE METHOD: COMPARE PASSWORD
========================== */
adminSchema.methods.comparePassword = async function (password) {
  const { comparePassword } = require('../utils/password');
  return comparePassword(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
