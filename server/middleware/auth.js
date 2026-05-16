const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { sendError } = require('../utils/response');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Access denied. No token provided.');
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return sendError(res, 401, 'User not found or deactivated.');
    }
    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token.');
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return sendError(res, 403, 'Admin access required.');
  }
  next();
};

module.exports = { protect, adminOnly };
