const express = require('express');
const router = express.Router();
const { analyzeProduct, getProducts, getProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { productValidation } = require('../validations/aiValidation');
const validate = require('../middleware/validate');

router.use(protect);
router.post('/analyze', upload.single('image'), productValidation, validate, analyzeProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
