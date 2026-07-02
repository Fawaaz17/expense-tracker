// ============================================================================
// ROUTES: Dashboard Analytics (Protected)
// ============================================================================
// What this file does:
// Configures route paths for dashboard analytics reports.
//
// Endpoints:
// - GET /api/dashboard : Retrieve income, expense totals, category, and monthly trends
// ============================================================================

const express = require('express');
const router = express.Router();

// Import controllers
const { getDashboardStats } = require('../controllers/dashboardController');

// Import authentication protector middleware
const protect = require('../middleware/authMiddleware');

// Define routes and attach controllers
router.get('/', protect, getDashboardStats);

module.exports = router;
