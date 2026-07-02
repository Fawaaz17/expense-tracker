// ============================================================================
// ROUTES: Transactions (Protected)
// ============================================================================
// What this file does:
// Configures route paths for executing CRUD operations on transactions.
// Every route in this file requires authentication.
//
// Endpoints:
// - GET /api/transactions     : Retrieve transactions with filters/sorting
// - POST /api/transactions    : Add a new transaction (Income or Expense)
// - PUT /api/transactions/:id : Update a specific transaction
// - DELETE /api/transactions/:id : Delete a specific transaction
// ============================================================================

const express = require('express');
const router = express.Router();

// Import controllers
const { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
} = require('../controllers/transactionController');

// Import authentication protector middleware
const protect = require('../middleware/authMiddleware');

// Apply the 'protect' middleware globally to all routes in this file.
// This is a cleaner alternative to writing 'protect' on every single route definition.
router.use(protect);

// Define CRUD routes
router.get('/', getTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
