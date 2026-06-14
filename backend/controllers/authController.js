const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const jwt = require('jsonwebtoken');

/**
 * POST /api/auth/signup
 * Register a new user
 */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 409);
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferences: user.preferences,
          streak: user.streak,
          createdAt: user.createdAt,
        },
      },
      'Account created successfully',
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user._id);

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        streak: user.streak,
      },
    }, 'Login successful');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * POST /api/auth/forgot-password
 * Simulate sending a password reset email
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return errorResponse(res, 'Email is required', 400);

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Don't leak whether the email exists or not
      return successResponse(res, {}, 'If that email is registered, a reset link will be sent.');
    }

    // Generate a reset token that expires in 15 minutes
    // By incorporating the password hash in the secret, the token becomes invalid as soon as the password is changed
    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: '15m' });

    // Generate link
    const resetLink = `http://localhost:5173/reset-password/${user._id}/${token}`;
    
    // Simulate email send by logging it
    console.log(`\n=======================================\nPASSWORD RESET LINK FOR ${user.email}:\n${resetLink}\n=======================================\n`);

    return successResponse(res, { resetLink }, 'If that email is registered, a reset link has been generated (check backend console).');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * POST /api/auth/reset-password/:id/:token
 * Reset the user's password
 */
const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    const user = await User.findById(id).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid or expired reset link', 400);
    }

    const secret = process.env.JWT_SECRET + user.password;
    try {
      jwt.verify(token, secret);
    } catch (err) {
      return errorResponse(res, 'Invalid or expired reset link', 400);
    }

    // Token is valid, update password
    user.password = password;
    await user.save();

    return successResponse(res, {}, 'Password successfully reset');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { signup, login, forgotPassword, resetPassword };
