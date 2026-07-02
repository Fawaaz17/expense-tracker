// ============================================================================
// BACKEND ENTRY POINT: Express Server Configuration
// ============================================================================
// What this file does:
// This is the starting point of our backend application. It:
// 1. Loads environment configurations.
// 2. Configures middleware (CORS, body parser).
// 3. Mounts the router modules onto prefix paths.
// 4. Handles undefined route lookups (404) and global errors (500).
// 5. Starts listening for HTTP client connections.
//
// Key Concepts:
// - Middleware: Functions that run in sequence before request reaches controllers.
// - CORS (Cross-Origin Resource Sharing): Allows frontend requests running on a 
//   different origin (e.g. localhost:5173) to securely read APIs from our backend
//   server (localhost:5000).
// ============================================================================

// Import express framework to create the application
const express = require('express');

// Import CORS middleware to allow cross-origin requests
const cors = require('cors');

// Import dotenv library to load environment variables from the .env file
require('dotenv').config();

// Create an instance of Express application
const app = express();

// Set the port from environment variables, defaulting to 5000 if not specified
const PORT = process.env.PORT || 5000;

// --- Global Middleware Setup ---

// 1. Enable CORS middleware. By default, it allows all cross-origin requests.
// In production, we should limit this to our frontend domain for safety.
app.use(cors());

// 2. Enable body parser middleware to parse incoming requests with JSON payloads.
// This populates the 'req.body' object with variables sent by the frontend client.
app.use(express.json());

// --- Register Routes ---

// Import route files
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Mount routes on specific prefix paths
// Example: All authentication requests will start with /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Simple health check route (Public)
// Used to verify if the server is up and responsive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Backend server is running smoothly.' });
});

// --- Fallback & Error Handlers ---

// 1. Catch 404 - Handle requests sent to unregistered route paths
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: [${req.method}] ${req.originalUrl}`
  });
});

// 2. Global Exception Handler - Catch any unhandled errors in controller logic
// This prevents the application from crashing and returns a polite 500 response.
app.use((err, req, res, next) => {
  console.error('Unhandled Global Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal error occurred on the server.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  Expense Tracker backend running on port: ${PORT}`);
  console.log(`  Health Check URL: http://localhost:${PORT}/health`);
  console.log(`====================================================`);
});
