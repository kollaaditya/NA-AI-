const Proposal = require('../models/Proposal');
const { generateB2BProposal } = require('../services/aiService');
const { sendResponse, sendError } = require('../utils/response');

const createProposal = async (req, res, next) => {
  try {
    const { companyName, budget, industry } = req.body;
    const aiResult = await generateB2BProposal(req.user._id, companyName, budget, industry);

    const proposal = await Proposal.create({
      user: req.user._id,
      companyName,
      budget,
      industry,
      aiResult,
    });

    await req.user.updateOne({ $inc: { aiUsageCount: 1 } });
    sendResponse(res, 201, true, 'Proposal generated successfully.', { proposal });
  } catch (error) {
    next(error);
  }
};

const getProposals = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };
    if (req.query.search) {
      query.companyName = { $regex: req.query.search, $options: 'i' };
    }

    const [proposals, total] = await Promise.all([
      Proposal.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Proposal.countDocuments(query),
    ]);

    sendResponse(res, 200, true, 'Proposals fetched.', {
      proposals,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findOne({ _id: req.params.id, user: req.user._id });
    if (!proposal) return sendError(res, 404, 'Proposal not found.');
    sendResponse(res, 200, true, 'Proposal fetched.', { proposal });
  } catch (error) {
    next(error);
  }
};

const deleteProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!proposal) return sendError(res, 404, 'Proposal not found.');
    sendResponse(res, 200, true, 'Proposal deleted.');
  } catch (error) {
    next(error);
  }
};

module.exports = { createProposal, getProposals, getProposal, deleteProposal };
