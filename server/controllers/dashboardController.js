const User = require('../models/User');
const Product = require('../models/Product');
const Proposal = require('../models/Proposal');
const AILog = require('../models/AILog');
const Contact = require('../models/Contact');
const { generateImpactReport } = require('../services/aiService');
const { sendResponse, sendError } = require('../utils/response');

const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [productsCount, proposalsCount, aiLogs, proposals] = await Promise.all([
      Product.countDocuments({ user: userId }),
      Proposal.countDocuments({ user: userId }),
      AILog.find({ user: userId }).sort({ createdAt: -1 }).limit(10),
      Proposal.find({ user: userId }).select('budget'),
    ]);

    const totalBudget = proposals.reduce((sum, p) => sum + (p.budget || 0), 0);
    const successRate = aiLogs.length
      ? Math.round((aiLogs.filter((l) => l.success).length / aiLogs.length) * 100)
      : 100;

    sendResponse(res, 200, true, 'Dashboard stats fetched.', {
      stats: { productsCount, proposalsCount, totalBudget, successRate, aiCallsCount: aiLogs.length },
      recentActivity: aiLogs,
    });
  } catch (error) {
    next(error);
  }
};

const generateReport = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [productsCount, proposalsCount, proposals] = await Promise.all([
      Product.countDocuments({ user: userId }),
      Proposal.countDocuments({ user: userId }),
      Proposal.find({ user: userId }).select('budget industry'),
    ]);

    const totalBudget = proposals.reduce((sum, p) => sum + (p.budget || 0), 0);
    const industry = proposals[0]?.industry || 'Mixed';

    const report = await generateImpactReport(userId, { productsCount, proposalsCount, totalBudget, industry });
    sendResponse(res, 200, true, 'Impact report generated.', { report });
  } catch (error) {
    next(error);
  }
};

// Admin controllers
const adminGetStats = async (req, res, next) => {
  try {
    const [usersCount, productsCount, proposalsCount, aiLogsCount, contacts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Proposal.countDocuments(),
      AILog.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt role');
    const recentLogs = await AILog.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email');

    sendResponse(res, 200, true, 'Admin stats fetched.', {
      stats: { usersCount, productsCount, proposalsCount, aiLogsCount, newContacts: contacts },
      recentUsers,
      recentLogs,
    });
  } catch (error) {
    next(error);
  }
};

const adminGetUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search;

    const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    sendResponse(res, 200, true, 'Users fetched.', {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const adminToggleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found.');
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    sendResponse(res, 200, true, `User ${user.isActive ? 'activated' : 'deactivated'}.`, { user });
  } catch (error) {
    next(error);
  }
};

const adminGetContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(50);
    sendResponse(res, 200, true, 'Contacts fetched.', { contacts });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, generateReport, adminGetStats, adminGetUsers, adminToggleUser, adminGetContacts };
