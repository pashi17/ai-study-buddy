const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responseHelper');

/**
 * Protect routes — verify JWT and attach user to req
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Support Bearer token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return errorResponse(res, 'User not found. Token invalid.', 401);
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired. Please log in again.', 401);
    }
    return errorResponse(res, 'Invalid token.', 401);
  }
};

module.exports = { protect };
