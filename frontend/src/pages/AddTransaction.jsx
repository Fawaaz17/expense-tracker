// ============================================================================
// PAGE: Add Transaction (Income or Expense)
// ============================================================================
// What this file does:
// This page acts as a container for adding new financial logs. It mounts the
// reusable TransactionForm component, captures the validated form data, calls
// the creation service to store the item in MySQL, and handles redirect logs.
// ============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../services/api';
import TransactionForm from '../components/TransactionForm';

const AddTransaction = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Submit handler ---
  // Receives the validated transaction object from the TransactionForm child component
  const handleFormSubmit = async (formData) => {
    setError('');
    setLoading(true);

    try {
      // 1. Submit payload to the transaction creation API
      await transactionService.createTransaction(formData);
      
      // 2. Redirect back to the dashboard upon successful insertion
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create transaction:', err);
      // Retrieve backend validation error if it exists
      const errMsg = err.response?.data?.message || 'Failed to save transaction. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      {/* Title */}
      <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Add New Transaction</h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
        Record a new income stream or daily expense card.
      </p>

      {/* Show API error if it occurs */}
      {error && <div className="alert-bar alert-danger">{error}</div>}

      {/* Reusable form component */}
      <TransactionForm 
        onSubmit={handleFormSubmit} 
        buttonText={loading ? 'Saving Transaction...' : 'Add Transaction'} 
      />
    </div>
  );
};

export default AddTransaction;
