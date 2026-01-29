const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Generate JWT
const generateToken = (id, role = 'user') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ success: true, token, user });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(user._id, user.role);
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
