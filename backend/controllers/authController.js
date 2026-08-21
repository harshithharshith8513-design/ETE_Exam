const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey123', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user'
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    // On-demand creation/reset for pre-configured Admin account
    if (normalizedEmail === 'admin@innovationhub.org') {
      const adminPasswordHash = await bcrypt.hash('admin123', 10);
      if (!user) {
        user = await User.create({
          name: 'System Admin',
          email: 'admin@innovationhub.org',
          password: adminPasswordHash,
          role: 'admin'
        });
      } else if (password === 'admin123') {
        user.password = adminPasswordHash;
        user.role = 'admin';
        await user.save();
      }
    }

    // On-demand creation/reset for pre-configured Dr. Elena account
    if (normalizedEmail === 'elena@innovationhub.org' && !user) {
      const userPasswordHash = await bcrypt.hash('password123', 10);
      user = await User.create({
        name: 'Dr. Elena Rostova',
        email: 'elena@innovationhub.org',
        password: userPasswordHash,
        role: 'user'
      });
    }

    // On-demand creation/reset for pre-configured Marcus account
    if (normalizedEmail === 'marcus@techlabs.io' && !user) {
      const userPasswordHash = await bcrypt.hash('password123', 10);
      user = await User.create({
        name: 'Marcus Chen',
        email: 'marcus@techlabs.io',
        password: userPasswordHash,
        role: 'user'
      });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          createdAt: user.createdAt
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid email or password credentials'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
