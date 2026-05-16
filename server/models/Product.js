const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  aiResult: {
    category: String,
    subCategory: String,
    seoTags: [String],
    sustainabilityFilters: [String],
    ecoScore: { type: Number, min: 0, max: 100 },
    summary: String,
  },
  rawJson: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
