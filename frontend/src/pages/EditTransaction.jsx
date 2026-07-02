// ============================================================================
// PAGE: Edit Transaction
// ============================================================================
// What this file does:
// This page manages edits to existing transactions. It:
// 1. Reads the transaction ID parameter from the URL.
// 2. Fetches the transaction list and filters for the matching record.
// 3. Mounts the TransactionForm component pre-populated with this data.
// 4. Calls the PUT API to save updates.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { transactionService } from '../services/api';
import TransactionForm from '../components/TransactionForm';

const EditTransaction = () => {
  const { id } = useParams(); // Extract the transaction ID parameter from URL
  const navigate = useNavigate();
  
  // --- States ---
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // --- Fetch Transaction Detail ---
  // Since we don't have a single-item GET endpoint, we fetch the transactions list 
  // and locate our matching ID in the array. This keeps us aligned with the spec.
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        const data = await transactionService.getTransactions();
        
        // Find the transaction matching our parameter id
        const foundTx = data.transactions.find(tx => tx.id === parseInt(id));
        
        if (foundTx) {
          setTransaction(foundTx);
        } else {
          setError('Transaction record could not be found.');
        }
      } catch (err) {
        console.error('Fetch edit details error:', err);
        setError('Failed to fetch transaction details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  // --- Form Submission Handler ---
  const handleFormSubmit = async (formData) => {
    setError('');
    setSaveLoading(true);

    try {
      // Send PUT request to edit the record
      await transactionService.updateTransaction(id, formData);
      
      // Send user back to transactions history ledger
      navigate('/transactions');
    } catch (err) {
      console.error('Save transaction edits error:', err);
      const errMsg = err.response?.data?.message || 'Failed to save updates. Please try again.';
      setError(errMsg);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--text-secondary)' }}>
        <h3>Loading transaction details...</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Edit Transaction</h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
        Modify and save changes for this transaction.
      </p>

      {error && <div className="alert-bar alert-danger">{error}</div>}

      {/* Render the form only if transaction data is loaded successfully */}
      {transaction && (
        <TransactionForm
          initialData={transaction}
          onSubmit={handleFormSubmit}
          buttonText={saveLoading ? 'Saving Changes...' : 'Save Changes'}
        />
      )}
    </div>
  );
};

export default EditTransaction;
