const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendResponse, sendError } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password, company } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return sendError(res, 409, 'Email already registered.');

    const user = await User.create({ name, email, password, company });
    const token = generateToken({ id: user._id, role: user.role });

    sendResponse(res, 201, true, 'Registration successful.', { token, user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 401, 'Invalid email or password.');
    }
    if (!user.isActive) return sendError(res, 403, 'Account deactivated.');

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken({ id: user._id, role: user.role });
    const userObj = user.toJSON();

    sendResponse(res, 200, true, 'Login successful.', { token, user: userObj });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  sendResponse(res, 200, true, 'User profile fetched.', { user: req.user });
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, company } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, company },
      { new: true, runValidators: true }
    );
    sendResponse(res, 200, true, 'Profile updated.', { user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
