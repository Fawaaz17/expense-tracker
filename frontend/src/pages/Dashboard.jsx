// ============================================================================
// PAGE: Dashboard (Analytics Panel)
// ============================================================================
// What this file does:
// This is the core page of our application. It:
// 1. Fetches statistical totals (income, expense, balance) from the backend.
// 2. Renders dynamic charts (Pie and Bar charts) using react-chartjs-2.
// 3. Displays a feed of the 5 most recent transactions.
//
// Key Concepts:
// - Hook Lifecycle (useEffect): Calls the statistics API once on page mount.
// - Chart.js Registration: Prepares the library to draw canvas charts.
// - Conditional Rendering: Displays loading states, empty placeholders, 
//   or charts depending on whether transaction records exist.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService, transactionService } from '../services/api';

// --- Import and Register Chart.js Elements ---
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// We must register components with ChartJS so they can render in the browser
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  // --- Component State ---
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Fetch Stats Method ---
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Call api service to fetch all dashboard statistical metrics
      const data = await dashboardService.getStats();
      
      setSummary(data.summary);
      setRecentTransactions(data.recentTransactions);
      setCategoryExpenses(data.categoryExpenses);
      setMonthlyStats(data.monthlyStats);
      
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Run the fetch operation once when the component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- Delete Transaction Handler ---
  // Users can delete directly from the recent transactions list on the dashboard
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await transactionService.deleteTransaction(id);
      // Re-fetch dashboard data to update charts and balances!
      fetchDashboardData();
    } catch (err) {
      console.error('Delete transaction error:', err);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  // --- Helper: Format Currency ---
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  // ============================================================================
  // CHART CONFIGURATIONS (Pie & Bar Data structures)
  // ============================================================================

  // 1. PIE CHART: Expense by Category
  const pieChartData = {
    labels: categoryExpenses.map(item => item.category),
    datasets: [
      {
        data: categoryExpenses.map(item => item.amount),
        // Beautiful, modern HSL-tailored colors (no generic hard colors)
        backgroundColor: [
          '#6366f1', // Indigo (Food)
          '#8b5cf6', // Purple (Travel)
          '#ec4899', // Pink (Shopping)
          '#3b82f6', // Blue (Bills)
          '#14b8a6', // Teal (Education)
          '#f59e0b', // Amber (Health)
          '#10b981', // Emerald (Entertainment)
          '#6b7280'  // Gray (Other)
        ],
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e5e7eb',
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${formatCurrency(context.raw)}`
        }
      }
    }
  };

  // 2. BAR CHART: Monthly Income vs Expense
  const barChartData = {
    labels: monthlyStats.map(item => {
      // Convert '2026-06' to simple month names like 'June' for readability
      const [year, month] = item.month.split('-');
      const dateObj = new Date(year, parseInt(month) - 1, 1);
      return dateObj.toLocaleString('default', { month: 'short' }) + ' ' + year.substring(2);
    }),
    datasets: [
      {
        label: 'Income',
        data: monthlyStats.map(item => item.income),
        backgroundColor: '#10b981', // Emerald Green
        borderRadius: 6
      },
      {
        label: 'Expense',
        data: monthlyStats.map(item => item.expense),
        backgroundColor: '#f43f5e', // Rose Red
        borderRadius: 6
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#e5e7eb', font: { family: 'Inter' } }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { 
          color: '#9ca3af',
          callback: (value) => formatCurrency(value).split('.')[0] // Hide cents on scale
        }
      }
    }
  };

  // --- Loader Screen ---
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--text-secondary)' }}>
        <h3>Loading your financial data...</h3>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Financial Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage your incomes, expenses, and savings.</p>
        </div>
        <Link to="/add-transaction" className="btn btn-primary">
          ➕ Add Transaction
        </Link>
      </div>

      {/* Global Error Message */}
      {error && <div className="alert-bar alert-danger">{error}</div>}

      {/* 1. Statistics Cards Row */}
      <div className="stats-grid">
        {/* Total Income Card */}
        <div className="card stat-card income">
          <div className="stat-info">
            <span className="stat-label">Total Income</span>
            <span className="stat-val">{formatCurrency(summary.totalIncome)}</span>
          </div>
          <div className="stat-icon">💰</div>
        </div>

        {/* Total Expense Card */}
        <div className="card stat-card expense">
          <div className="stat-info">
            <span className="stat-label">Total Expenses</span>
            <span className="stat-val">{formatCurrency(summary.totalExpense)}</span>
          </div>
          <div className="stat-icon">💸</div>
        </div>

        {/* Remaining Balance Card */}
        <div className="card stat-card balance">
          <div className="stat-info">
            <span className="stat-label">Net Balance</span>
            <span className="stat-val">{formatCurrency(summary.balance)}</span>
          </div>
          <div className="stat-icon">💳</div>
        </div>
      </div>

      {/* 2. Middle Row: Recent Transactions Feed & Expense Breakdown Pie Chart */}
      <div className="dashboard-grid">
        {/* Recent Transactions List */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3>Recent Transactions</h3>
            <Link to="/transactions" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
              View All History →
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-emoji">🔍</div>
              <p>No recent activity. Start by adding a transaction!</p>
            </div>
          ) : (
            <div className="feed-list">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="feed-item">
                  <div className="feed-left">
                    <div className={`feed-avatar ${tx.type === 'income' ? 'income' : 'expense'}`}>
                      {tx.type === 'income' ? 'IN' : 'OUT'}
                    </div>
                    <div className="feed-desc">
                      <span className="feed-title">{tx.description}</span>
                      <span className="feed-meta">
                        <span className="badge badge-secondary" style={{ marginRight: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                          {tx.category}
                        </span>
                        {new Date(tx.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`feed-amount ${tx.type === 'income' ? 'income' : 'expense'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    
                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <Link to={`/edit-transaction/${tx.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.5rem' }}>
                        ✏️
                      </Link>
                      <button onClick={() => handleDelete(tx.id)} className="btn btn-danger btn-sm" style={{ padding: '0.3rem 0.5rem' }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expense Category Pie Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem' }}>Expenses by Category</h3>
          {categoryExpenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-emoji">📊</div>
              <p>No expenses found to chart.</p>
            </div>
          ) : (
            <div className="chart-container">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Row: Monthly Income vs Expense Bar Chart */}
      <div className="dashboard-bottom">
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem' }}>Monthly Financial Overview</h3>
          {monthlyStats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-emoji">📈</div>
              <p>Not enough transaction history to load monthly averages.</p>
            </div>
          ) : (
            <div className="chart-container" style={{ minHeight: '350px' }}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
