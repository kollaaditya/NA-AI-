const express = require('express');
const router = express.Router();
const { getDashboardStats, generateReport, adminGetStats, adminGetUsers, adminToggleUser, adminGetContacts } = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/stats', getDashboardStats);
router.post('/impact-report', generateReport);

// Admin routes
router.get('/admin/stats', adminOnly, adminGetStats);
router.get('/admin/users', adminOnly, adminGetUsers);
router.put('/admin/users/:id/toggle', adminOnly, adminToggleUser);
router.get('/admin/contacts', adminOnly, adminGetContacts);

module.exports = router;
