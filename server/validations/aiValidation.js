const { body } = require('express-validator');

const productValidation = [
  body('title').trim().notEmpty().withMessage('Product title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
];

const proposalValidation = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('budget').isFloat({ min: 1000 }).withMessage('Budget must be at least 1000'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
];

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
];

module.exports = { productValidation, proposalValidation, contactValidation };
