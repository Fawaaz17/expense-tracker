// ============================================================================
// CONTROLLER: Authentication
// ============================================================================
// What this file does:
// Contains the logical route handlers for User Registration, Login, and
// Profile fetching. It validates inputs, encrypts passwords, runs database 
// queries, and handles JWT generation.
//
// Key Concepts:
// 1. Password Hashing: Hashing is a one-way cryptographic function. We NEVER 
//    store plain text passwords. We hash them using bcryptjs so that even if 
//    the database is compromised, passwords remain secure.
// 2. JWT (JSON Web Tokens): Signed tokens containing payload data (user info). 
//    Once generated, they are stored client-side (e.g. localStorage) and sent
//    in the request header to verify session legitimacy.
// ============================================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // MySQL connection pool

// Load env variables
require('dotenv').config();

// ============================================================================
// 1. REGISTER USER
// Route: POST /api/auth/register
// ============================================================================
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // --- Input Validation ---
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
  }

  // Basic email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  // Password length restriction
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  try {
    // Check if email already exists in database
    // SELECT statement searches for existing matching record
    const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    
    // existingUser is an array. If length > 0, the email is already in use
    if (existingUser.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // --- Hashing the Password ---
    // Salt is random data added to the password before hashing to prevent identical passwords
    // from generating identical hashes (protects against rainbow table attacks).
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // --- Database Insert ---
    // INSERT statement adds the user to the database
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Retrieve the auto-generated ID of the newly inserted user
    const newUserId = result.insertId;

    // --- Generate JWT Token ---
    // Immediately log the user in after registration by issuing a token
    const token = jwt.sign(
      { id: newUserId, email: email },
      process.env.JWT_SECRET || 'my_super_secret_key_123456',
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Return success response with user info and token
    return res.status(210).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: newUserId,
        name,
        email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error during registration.' });
  }
};

// ============================================================================
// 2. LOGIN USER
// Route: POST /api/auth/login
// ============================================================================
const login = async (req, res) => {
  const { email, password } = req.body;

  // --- Input Validation ---
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  try {
    // Retrieve the user record from database by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    // If no user is found with this email
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Access the user object from the query result array
    const user = users[0];

    // --- Compare Passwords ---
    // bcrypt.compare hashes the incoming password and compares it to the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // --- Generate JWT Token ---
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'my_super_secret_key_123456',
      { expiresIn: '24h' }
    );

    // Return success response with token and public user details
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error during login.' });
  }
};

// ============================================================================
// 3. GET PROFILE
// Route: GET /api/auth/profile (Protected Route)
// ============================================================================
const getProfile = async (req, res) => {
  // req.user is set by the authMiddleware after successful token validation
  const userId = req.user.id;

  try {
    // Query database to fetch user details (excluding password for security)
    const [users] = await db.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    return res.status(200).json({
      success: true,
      user: users[0]
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error fetching profile.' });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
