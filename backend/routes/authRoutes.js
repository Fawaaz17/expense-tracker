// ============================================================================
// ROUTES: Authentication
// ============================================================================
// What this file does:
// Defines the API end points for auth and maps them to their controllers.
//
// Endpoints:
// - POST /api/auth/register : Create a new user account (Public)
// - POST /api/auth/login    : Log in existing user and return a JWT (Public)
// - GET /api/auth/profile   : Retrieve logged-in user profile details (Protected)
// ============================================================================

const express = require('express');
const router = express.Router();

// Import controllers
const { register, login, getProfile } = require('../controllers/authController');

// Import authentication protector middleware
const protect = require('../middleware/authMiddleware');

// Define routes and attach controllers
router.post('/register', register);
router.post('/login', login);

// This endpoint is protected. We pass the 'protect' middleware function first.
// If the token is valid, it calls the 'getProfile' controller.
router.get('/profile', protect, getProfile);

module.exports = router;
