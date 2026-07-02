// ============================================================================
// CONTROLLER: Transactions (CRUD Operations)
// ============================================================================
// What this file does:
// Handles creation, retrieval, updates, and deletion (CRUD) of transactions.
// It also handles dynamic filtering, searching, and sorting of transaction records.
//
// Key Concepts:
// 1. Ownership Verification: When updating or deleting, we verify that the
//    transaction belongs to the logged-in user (user_id === req.user.id) to 
//    prevent Unauthorized Data Modification (BOLA/IDOR vulnerability).
// 2. SQL Injection Prevention: We build queries using parameterized inputs (using 
//    '?' place holders) rather than string concatenation.
// ============================================================================

const db = require('../config/db');

// List of allowed categories for server-side verification
const ALLOWED_CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Bills', 
  'Education', 'Health', 'Entertainment', 'Other'
];

// ============================================================================
// 1. GET ALL TRANSACTIONS WITH FILTERING, SEARCHING, AND SORTING
// Route: GET /api/transactions
// Query Params: search, category, startDate, endDate, sortBy, sortOrder
// ============================================================================
const getTransactions = async (req, res) => {
  const userId = req.user.id;
  const { search, category, startDate, endDate, sortBy, sortOrder } = req.query;

  // We start building the SQL query. Always filter by user_id for security!
  let sql = 'SELECT * FROM transactions WHERE user_id = ?';
  const queryParams = [userId];

  // --- Dynamic Filtering & Searching ---

  // Search by Description (SQL: LIKE %search%)
  if (search && search.trim() !== '') {
    sql += ' AND description LIKE ?';
    queryParams.push(`%${search.trim()}%`);
  }

  // Filter by Category
  if (category && category.trim() !== '') {
    sql += ' AND category = ?';
    queryParams.push(category.trim());
  }

  // Filter by Date Range (startDate to endDate)
  if (startDate) {
    sql += ' AND date >= ?';
    queryParams.push(startDate);
  }
  if (endDate) {
    sql += ' AND date <= ?';
    queryParams.push(endDate);
  }

  // --- Dynamic Sorting ---
  // White-list sorting inputs to prevent SQL Injection in ORDER BY clause
  // Note: Parameterized statements ('?') cannot be used for column names or keywords 
  // like ASC/DESC in SQL, so we must manually sanitize/validate these values.
  const allowedSortFields = ['amount', 'date', 'created_at'];
  const allowedSortOrders = ['ASC', 'DESC'];

  const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'date';
  const finalSortOrder = allowedSortOrders.includes(sortOrder?.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

  sql += ` ORDER BY ${finalSortBy} ${finalSortOrder}`;

  try {
    // Execute query with compiled query params
    const [transactions] = await db.query(sql, queryParams);

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error('Fetch transactions error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error fetching transactions.' });
  }
};

// ============================================================================
// 2. CREATE A NEW TRANSACTION (Income or Expense)
// Route: POST /api/transactions
// Body: type, amount, category, description, date
// ============================================================================
const createTransaction = async (req, res) => {
  const userId = req.user.id;
  const { type, amount, category, description, date } = req.body;

  // --- Input Validation ---
  if (!type || !amount || !category || !description || !date) {
    return res.status(400).json({ success: false, message: 'All fields (type, amount, category, description, date) are required.' });
  }

  // Type check
  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ success: false, message: "Type must be either 'income' or 'expense'." });
  }

  // Amount check (Must be greater than zero)
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ success: false, message: 'Amount must be a numeric value greater than zero.' });
  }

  // Category check
  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({ success: false, message: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}` });
  }

  // Description check
  if (description.trim() === '') {
    return res.status(400).json({ success: false, message: 'Description cannot be empty.' });
  }

  try {
    // Insert new transaction
    const [result] = await db.query(
      'INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, type, numericAmount, category, description.trim(), date]
    );

    // Return the inserted transaction
    return res.status(201).json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`,
      transaction: {
        id: result.insertId,
        user_id: userId,
        type,
        amount: numericAmount,
        category,
        description,
        date
      }
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error saving transaction.' });
  }
};

// ============================================================================
// 3. UPDATE AN EXISTING TRANSACTION
// Route: PUT /api/transactions/:id
// ============================================================================
const updateTransaction = async (req, res) => {
  const userId = req.user.id;
  const transactionId = req.params.id;
  const { type, amount, category, description, date } = req.body;

  // --- Input Validation ---
  if (!type || !amount || !category || !description || !date) {
    return res.status(400).json({ success: false, message: 'All fields are required for update.' });
  }

  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ success: false, message: "Type must be either 'income' or 'expense'." });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ success: false, message: 'Amount must be greater than zero.' });
  }

  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({ success: false, message: 'Invalid category choice.' });
  }

  try {
    // 1. Fetch transaction first to verify ownership (Security practice)
    const [rows] = await db.query('SELECT user_id FROM transactions WHERE id = ?', [transactionId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    // Check if the transaction belongs to the logged-in user
    if (rows[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access Denied. You do not own this transaction.' });
    }

    // 2. Perform the update query
    await db.query(
      'UPDATE transactions SET type = ?, amount = ?, category = ?, description = ?, date = ? WHERE id = ?',
      [type, numericAmount, category, description.trim(), date, transactionId]
    );

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully!',
      transaction: {
        id: parseInt(transactionId),
        user_id: userId,
        type,
        amount: numericAmount,
        category,
        description,
        date
      }
    });

  } catch (error) {
    console.error('Update transaction error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error updating transaction.' });
  }
};

// ============================================================================
// 4. DELETE A TRANSACTION
// Route: DELETE /api/transactions/:id
// ============================================================================
const deleteTransaction = async (req, res) => {
  const userId = req.user.id;
  const transactionId = req.params.id;

  try {
    // 1. Check ownership first
    const [rows] = await db.query('SELECT user_id FROM transactions WHERE id = ?', [transactionId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    if (rows[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access Denied. You do not own this transaction.' });
    }

    // 2. Perform delete statement
    await db.query('DELETE FROM transactions WHERE id = ?', [transactionId]);

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.'
    });

  } catch (error) {
    console.error('Delete transaction error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error deleting transaction.' });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
