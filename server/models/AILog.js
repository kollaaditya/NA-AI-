const mongoose = require('mongoose');

const aiLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['product_category', 'b2b_proposal', 'impact_report', 'chat'], required: true },
  inputTokens: { type: Number, default: 0 },
  outputTokens: { type: Number, default: 0 },
  model: { type: String, default: 'gpt-4o-mini' },
  success: { type: Boolean, default: true },
  errorMessage: { type: String },
  duration: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('AILog', aiLogSchema);
