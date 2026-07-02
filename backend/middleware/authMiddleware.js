// ============================================================================
// MIDDLEWARE: JWT Authentication Middleware
// ============================================================================
// What this file does:
// This middleware intercepts incoming HTTP requests targeting protected routes.
// It checks if the request has a valid JSON Web Token (JWT) in the headers.
//
// Why do we need this?
// HTTP is a stateless protocol (meaning each request is completely independent).
// To keep users logged in across multiple requests without asking for a password 
// every time, we use a JWT. This middleware verifies that JWT.
//
// Input:
// HTTP Request Headers containing: Authorization: Bearer <token>
//
// Output / Side Effects:
// - If valid: Decodes the token (which contains user ID) and attaches it to the 
//   request object (req.user), then calls next() to proceed.
// - If invalid or missing: Sends an HTTP 401 Unauthorized response back to client,
//   blocking the request from reaching the controllers.
// ============================================================================

const jwt = require('jsonwebtoken');

// Load env variables to access JWT_SECRET
require('dotenv').config();

const protect = (req, res, next) => {
  // 1. Get the Authorization header from the incoming request
  const authHeader = req.headers.authorization;

  // 2. Check if the header is present and starts with 'Bearer'
  // Standard format is: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access Denied. No authentication token provided.' 
    });
  }

  // 3. Extract the actual token string (split by space and take the second part)
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify the token signature using the secret key
    // If the token has been tampered with or has expired, this will throw an error.
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my_super_secret_key_123456');

    // 5. Attach the decoded user data (e.g., id, email) to the request object.
    // This allows subsequent controller functions to know *which* user is calling them.
    req.user = decoded;

    // 6. Call next() to hand over execution to the next middleware/controller in line
    next();
  } catch (error) {
    // If jwt.verify fails (e.g. token expired, invalid signature)
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Session expired or token is invalid. Please log in again.' 
    });
  }
};

module.exports = protect;
