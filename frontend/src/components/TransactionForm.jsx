// ============================================================================
// COMPONENT: Reusable Transaction Form (Income & Expense)
// ============================================================================
// What this file does:
// Renders a styled input form for adding or editing transaction records.
// It implements client-side validation to ensure that invalid payloads are
// blocked before being sent to the backend API.
//
// Props:
// - initialData: Optional object containing values for editing (edit mode).
// - onSubmit: Handler callback triggered upon successful validation.
// - buttonText: Text displayed on the primary submit button.
// ============================================================================

import React, { useState, useEffect } from 'react';

// Default category selections requested by the requirements
const CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Bills', 
  'Education', 'Health', 'Entertainment', 'Other'
];

const TransactionForm = ({ initialData, onSubmit, buttonText }) => {
  // --- Component State ---
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [error, setError] = useState('');

  // --- Pre-populate Form in Edit Mode ---
  // If initialData prop is passed (e.g. when editing a transaction),
  // we update the state variables with those existing values.
  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setAmount(initialData.amount || '');
      setCategory(initialData.category || 'Food');
      setDescription(initialData.description || '');
      // Format date to YYYY-MM-DD for standard date input fields
      if (initialData.date) {
        setDate(initialData.date.split('T')[0]);
      }
    }
  }, [initialData]);

  // --- Form Submission Handler ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // --- Client-Side Input Validations ---
    if (!amount || !description || !date || !category || !type) {
      setError('All fields are required.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Amount must be a numeric value greater than zero.');
      return;
    }

    if (description.trim() === '') {
      setError('Description cannot be empty.');
      return;
    }

    // Pass validated data up to the parent component's submit handler
    onSubmit({
      type,
      amount: numericAmount,
      category,
      description: description.trim(),
      date
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      {/* Show validation errors if they exist */}
      {error && <div className="alert-bar alert-danger">{error}</div>}

      {/* Transaction Type Selection */}
      <div className="form-group">
        <label htmlFor="type">Transaction Type</label>
        <select 
          id="type"
          value={type} 
          onChange={(e) => setType(e.target.value)} 
          className="form-control"
        >
          <option value="expense">Expense (-)</option>
          <option value="income">Income (+)</option>
        </select>
      </div>

      {/* Amount Input */}
      <div className="form-group">
        <label htmlFor="amount">Amount (₹)</label>
        <input 
          id="amount"
          type="number" 
          step="0.01"
          placeholder="0.00"
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          className="form-control"
          required
        />
      </div>

      {/* Category Selection */}
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select 
          id="category"
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="form-control"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Description Input */}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input 
          id="description"
          type="text" 
          placeholder="e.g. Weekly Groceries"
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="form-control"
          maxLength="255"
          required
        />
      </div>

      {/* Date Picker Input */}
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input 
          id="date"
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          className="form-control"
          required
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
        {buttonText}
      </button>
    </form>
  );
};

export default TransactionForm;
