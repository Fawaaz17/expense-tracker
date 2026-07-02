// ============================================================================
// PAGE: Login
// ============================================================================
// What this file does:
// Renders the User Login form. It captures form credentials, handles client-side 
// state, calls the login service API, stores the session token and user 
// profile in localStorage upon success, and handles API error responses.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  
  // --- Form State Variables ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Redirect Authenticated Users ---
  // If the user is already logged in (token exists), skip this page 
  // and redirect them directly to the dashboard.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // --- Submit handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic Validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      // 1. Submit login payload to backend API
      const data = await authService.login({ email, password });

      // 2. Save JWT token and public user object to localStorage
      // localStorage only stores strings, so we serialize objects into JSON strings.
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 3. Navigate user to the private Dashboard page
      // 'window.location.reload()' ensures the navbar/sidebar re-evaluates auth states
      navigate('/dashboard');
      window.location.reload();
      
    } catch (err) {
      console.error('Login submit error:', err);
      // Retrieve the error message sent back by the Express server
      const errMsg = err.response?.data?.message || 'Login failed. Please check your network connection.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Welcome Back</h2>
      
      <div className="card">
        {/* Error Alert Display */}
        {error && <div className="alert-bar alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          {/* Action button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {/* Switch Link */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
