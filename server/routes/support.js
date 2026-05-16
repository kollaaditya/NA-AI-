const express = require('express');
const router = express.Router();
const { submitContact, sendChatMessage, getChatHistory } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { contactValidation } = require('../validations/aiValidation');
const validate = require('../middleware/validate');

router.post('/contact', contactValidation, validate, submitContact);
router.post('/chat', sendChatMessage);
router.get('/chat/:sessionId', protect, getChatHistory);

module.exports = router;
