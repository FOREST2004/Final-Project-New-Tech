import models from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { User } = models;

// Generate JWT token
const generateToken = (userId, username, email, role) => {
  return jwt.sign({ 
    id: userId, 
    username, 
    email, 
    role 
  }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, full_name, phone, address } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [models.Sequelize.Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user (password will be hashed by model hook)
    const newUser = await User.create({
      username,
      email,
      password,
      full_name,
      phone,
      address,
      role: 'user'
    });

    // Generate token
    const token = generateToken(newUser.user_id, newUser.username, newUser.email, newUser.role);

    // Remove password from response
    const userResponse = {
      user_id: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
      full_name: newUser.full_name,
      phone: newUser.phone,
      address: newUser.address,
      role: newUser.role,
      created_at: newUser.created_at
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Validate password using model method
    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.user_id, user.username, user.email, user.role);

    // Remove password from response
    const userResponse = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      address: user.address,
      role: user.role,
      created_at: user.created_at
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in user',
      error: error.message
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    const userResponse = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      address: user.address,
      role: user.role,
      created_at: user.created_at,
      created_at: user.created_at
    };

    res.json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, username, phone, address } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if username is already taken (if being updated)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    await user.update({
      full_name: full_name || user.full_name,
      username: username || user.username,
      phone: phone !== undefined ? phone : user.phone,
      address: address !== undefined ? address : user.address
    });

    // Remove password from response
    const userResponse = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      address: user.address,
      role: user.role,
      created_at: user.created_at
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    });
  }
};