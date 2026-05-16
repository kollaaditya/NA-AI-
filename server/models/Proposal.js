const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true, trim: true },
  budget: { type: Number, required: true },
  industry: { type: String, required: true, trim: true },
  aiResult: {
    recommendations: [{ product: String, description: String, cost: Number }],
    budgetAllocation: [{ category: String, percentage: Number, amount: Number }],
    roiEstimate: { percentage: Number, timeframe: String, savings: Number },
    sustainabilitySummary: String,
    totalCost: Number,
  },
  status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
