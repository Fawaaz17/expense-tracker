// ============================================================================
// CONFIGURATION: MySQL Connection Pool
// ============================================================================
// What this file does:
// This file initializes a connection pool to the MySQL database using the 
// 'mysql2' package. It uses the Promise wrapper (mysql2/promise) to support 
// modern async/await syntax, which makes our asynchronous queries cleaner.
//
// Why use a Connection Pool instead of a Single Connection?
// 1. Efficiency: Creating and closing a TCP connection for every single query 
//    is resource-heavy and slow. A pool keeps multiple connections open.
// 2. Reusability: Active requests borrow a connection, run a query, and return
//    the connection back to the pool to be reused by the next request.
// 3. Concurrency: Multiple database requests can run simultaneously.
//
// Inputs:
// Environment variables from the backend/.env file (DB_HOST, DB_USER, etc.).
//
// Output:
// A promise-based connection pool object that is exported and used globally.
// ============================================================================

// Import the mysql2 library with promise support
const mysql = require('mysql2/promise');

// Load environment variables (done in server.js, but imported here for safety)
require('dotenv').config();

// Create the connection pool using credentials from env variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'expense_tracker',
  // Maximum number of connections that can be kept in the pool at one time
  connectionLimit: 10,
  // If no connections are available in the pool, wait until one becomes free
  waitForConnections: true,
  // Time in milliseconds to wait for a free connection before throwing an error
  queueLimit: 0 // 0 means no limit on queue length
});

// Test the connection to ensure database details are correct
pool.getConnection()
  .then((connection) => {
    console.log('Database connected successfully to MySQL.');
    // Release the connection back to the pool! 
    // If we don't release it, we waste a connection slot.
    connection.release();
  })
  .catch((err) => {
    console.error('Database connection failed. Error details:', err.message);
    console.error('Please ensure MySQL is running and database configuration in .env is correct.');
  });

// Export the pool for use in controller files to perform SQL operations
module.exports = pool;
