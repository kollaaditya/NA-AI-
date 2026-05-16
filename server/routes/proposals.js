const express = require('express');
const router = express.Router();
const { createProposal, getProposals, getProposal, deleteProposal } = require('../controllers/proposalController');
const { protect } = require('../middleware/auth');
const { proposalValidation } = require('../validations/aiValidation');
const validate = require('../middleware/validate');

router.use(protect);
router.post('/', proposalValidation, validate, createProposal);
router.get('/', getProposals);
router.get('/:id', getProposal);
router.delete('/:id', deleteProposal);

module.exports = router;
