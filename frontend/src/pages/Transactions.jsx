// ============================================================================
// PAGE: Transactions History
// ============================================================================
// What this file does:
// This page displays a comprehensive list of the user's transactions. It:
// 1. Provides filter components (search description, category, date limits).
// 2. Provides sorting controls (by amount, date).
// 3. Fetches filtered outputs from the backend.
// 4. Renders a tabular transaction history with edit and delete operations.
//
// Key Concepts:
// - Dynamic Query Params: Compiling local states into HTTP query arguments.
// - State-driven filtering: Rerunning data fetch triggers automatically when 
//   filtering dependencies (like category, dates, sorting) change.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionService } from '../services/api';

const CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Bills', 
  'Education', 'Health', 'Entertainment', 'Other'
];

const Transactions = () => {
  // --- Filtering States ---
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('DESC');
  
  // --- System States ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Fetch Transactions from API ---
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Compile our local state variables into a query params object
      const params = {};
      if (search.trim() !== '') params.search = search;
      if (category !== '') params.category = category;
      if (startDate !== '') params.startDate = startDate;
      if (endDate !== '') params.endDate = endDate;
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;

      const data = await transactionService.getTransactions(params);
      setTransactions(data.transactions || []);
      
    } catch (err) {
      console.error('Error loading transactions list:', err);
      setError('Could not retrieve transaction records.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch transactions automatically when filters change
  // Note: We don't trigger on 'search' input directly to avoid spamming the backend 
  // with every keypress. The user will click "Search" or we handle it gracefully.
  useEffect(() => {
    fetchTransactions();
  }, [category, startDate, endDate, sortBy, sortOrder]);

  // --- Delete Handler ---
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await transactionService.deleteTransaction(id);
      // Reload current listings
      fetchTransactions();
    } catch (err) {
      console.error('Delete transaction error:', err);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  // --- Reset Filters ---
  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setStartDate('');
    setEndDate('');
    setSortBy('date');
    setSortOrder('DESC');
  };

  // --- Format Currency ---
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  return (
    <div>
      {/* Header and Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Transaction History</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Review, search, and manage all your cash logs.</p>
        </div>
        <Link to="/add-transaction" className="btn btn-primary">
          ➕ Add Transaction
        </Link>
      </div>

      {/* Global Error Display */}
      {error && <div className="alert-bar alert-danger">{error}</div>}

      {/* 1. ADVANCED FILTER PANEL */}
      <div className="filters-panel">
        {/* Search by Description */}
        <div className="filter-item">
          <label htmlFor="search">Search Description</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="search"
              type="text"
              placeholder="e.g. Walmart, Salary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ padding: '0.5rem' }}
            />
            <button onClick={fetchTransactions} className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>
              🔍
            </button>
          </div>
        </div>

        {/* Filter by Category */}
        <div className="filter-item">
          <label htmlFor="filterCategory">Category</label>
          <select
            id="filterCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control"
            style={{ padding: '0.5rem' }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Filter Start Date */}
        <div className="filter-item">
          <label htmlFor="filterStartDate">From Date</label>
          <input
            id="filterStartDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control"
            style={{ padding: '0.5rem' }}
          />
        </div>

        {/* Filter End Date */}
        <div className="filter-item">
          <label htmlFor="filterEndDate">To Date</label>
          <input
            id="filterEndDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-control"
            style={{ padding: '0.5rem' }}
          />
        </div>

        {/* Sort By Column */}
        <div className="filter-item">
          <label htmlFor="filterSortBy">Sort By</label>
          <select
            id="filterSortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-control"
            style={{ padding: '0.5rem' }}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="created_at">Created At</option>
          </select>
        </div>

        {/* Sort Order Direction */}
        <div className="filter-item">
          <label htmlFor="filterSortOrder">Order</label>
          <select
            id="filterSortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="form-control"
            style={{ padding: '0.5rem' }}
          >
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <div>
          <button onClick={handleResetFilters} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', height: '40px' }}>
            Reset
          </button>
        </div>
      </div>

      {/* 2. TRANSACTIONS TABLE DISPLAY */}
      <div className="card" style={{ padding: '1rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <h3>Updating ledger...</h3>
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-emoji">📑</div>
            <p>No transaction history matches your criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    {/* Date */}
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    
                    {/* Description */}
                    <td style={{ fontWeight: '500' }}>{tx.description}</td>
                    
                    {/* Category */}
                    <td>
                      <span className="badge badge-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)' }}>
                        {tx.category}
                      </span>
                    </td>
                    
                    {/* Type */}
                    <td>
                      <span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {tx.type}
                      </span>
                    </td>
                    
                    {/* Amount */}
                    <td style={{ fontWeight: '600' }} className={tx.type === 'income' ? 'feed-amount income' : 'feed-amount expense'}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    
                    {/* Action buttons */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <Link to={`/edit-transaction/${tx.id}`} className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                          ✏️ Edit
                        </Link>
                        <button onClick={() => handleDelete(tx.id)} className="btn btn-danger btn-sm">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
