// ============================================================================
// CONTROLLER: Dashboard Aggregations
// ============================================================================
// What this file does:
// Calculates key summary statistics for the user's dashboard. It executes
// optimized MySQL aggregation queries to return:
// 1. Total Income, Total Expense, and Remaining Balance.
// 2. Category-wise Expense distribution (for Pie Chart display).
// 3. Monthly Income vs. Expense breakdowns over the last 6 months (for Bar Chart).
// 4. A short list of the 5 most recent transactions.
//
// Key Concepts:
// - Aggregation Functions (SUM): Computes totals over matching rows.
// - Conditional Aggregations (SUM(CASE WHEN)): Performs complex logic directly
//   inside SQL (very fast, database-level execution).
// - Grouping (GROUP BY): Segments totals by months or categories.
// ============================================================================

const db = require('../config/db');

const getDashboardStats = async (req, res) => {
  const userId = req.user.id;

  try {
    // --- Query 1: Total Income & Total Expense ---
    // Instead of querying all transactions and summing them in JavaScript (slow),
    // we let the MySQL database do the calculation using SUM and CASE WHEN.
    const [totals] = await db.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS totalIncome,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS totalExpense
       FROM transactions 
       WHERE user_id = ?`,
      [userId]
    );

    const totalIncome = parseFloat(totals[0].totalIncome);
    const totalExpense = parseFloat(totals[0].totalExpense);
    const balance = totalIncome - totalExpense;

    // --- Query 2: Recent Transactions ---
    // Retrieve the 5 most recent transactions to show on the dashboard dashboard feed.
    const [recentTransactions] = await db.query(
      `SELECT id, type, amount, category, description, date 
       FROM transactions 
       WHERE user_id = ? 
       ORDER BY date DESC, id DESC 
       LIMIT 5`,
      [userId]
    );

    // --- Query 3: Expense by Category (Pie Chart) ---
    // Group all expenses by category and sum their amounts.
    const [categoryExpenses] = await db.query(
      `SELECT category, SUM(amount) AS totalAmount 
       FROM transactions 
       WHERE user_id = ? AND type = 'expense' 
       GROUP BY category 
       ORDER BY totalAmount DESC`,
      [userId]
    );

    // Format query results as standard decimals for easier frontend chart consumption
    const formattedCategoryExpenses = categoryExpenses.map(item => ({
      category: item.category,
      amount: parseFloat(item.totalAmount)
    }));

    // --- Query 4: Monthly Income and Expense (Bar Chart) ---
    // Fetch month-by-month totals for the last 6 months.
    // DATE_FORMAT(date, '%Y-%m') groups dates into strings like '2026-06'.
    const [monthlyStats] = await db.query(
      `SELECT 
        DATE_FORMAT(date, '%Y-%m') AS month,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS monthlyIncome,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS monthlyExpense
       FROM transactions 
       WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(date, '%Y-%m')
       ORDER BY month ASC`,
      [userId]
    );

    const formattedMonthlyStats = monthlyStats.map(item => ({
      month: item.month,
      income: parseFloat(item.monthlyIncome),
      expense: parseFloat(item.monthlyExpense)
    }));

    // --- Assemble and Return Final Dashboard Payload ---
    return res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        balance
      },
      recentTransactions,
      categoryExpenses: formattedCategoryExpenses,
      monthlyStats: formattedMonthlyStats
    });

  } catch (error) {
    console.error('Dashboard statistics query error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error loading dashboard.' });
  }
};

module.exports = {
  getDashboardStats
};
