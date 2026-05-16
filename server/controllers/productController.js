const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const { generateProductCategory } = require('../services/aiService');
const { sendResponse, sendError } = require('../utils/response');

const analyzeProduct = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'na-ai-systems/products', resource_type: 'image' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const aiResult = await generateProductCategory(req.user._id, title, description);

    const product = await Product.create({
      user: req.user._id,
      title,
      description,
      imageUrl,
      aiResult,
      rawJson: aiResult,
    });

    await req.user.updateOne({ $inc: { aiUsageCount: 1 } });

    sendResponse(res, 201, true, 'Product analyzed successfully.', { product });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    sendResponse(res, 200, true, 'Products fetched.', {
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
    if (!product) return sendError(res, 404, 'Product not found.');
    sendResponse(res, 200, true, 'Product fetched.', { product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!product) return sendError(res, 404, 'Product not found.');
    sendResponse(res, 200, true, 'Product deleted.');
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeProduct, getProducts, getProduct, deleteProduct };
