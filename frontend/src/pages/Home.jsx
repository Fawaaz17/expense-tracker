// ============================================================================
// PAGE: Home (Landing / Intro Page)
// ============================================================================
// What this file does:
// This is the public landing page. It provides a warm welcome, highlights the
// benefits of using the app (tracking income/expense, visual charts), and 
// offers clear Call-To-Action (CTA) buttons to Register or Login.
// ============================================================================

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');

  return (
    <div className="hero-section">
      {/* Title / Value Proposition */}
      <h1 className="hero-title">
        Take Control of Your <span>Financial Future</span>
      </h1>
      
      {/* Sub-headline */}
      <p className="hero-subtitle">
        A simple, clean, and modern expense tracker designed to help you log income, 
        monitor daily expenses, filter transactions, and visualize monthly budgeting 
        habits in one powerful dashboard.
      </p>

      {/* Action Buttons */}
      <div className="hero-cta">
        {token ? (
          // If already logged in, send them straight to the Dashboard
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard 📊
          </Link>
        ) : (
          // If guest, show login/register options
          <>
            <Link to="/register" className="btn btn-primary">
              Get Started for Free 🚀
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login to Account
            </Link>
          </>
        )}
      </div>

      {/* Benefit Boxes Grid */}
      <div className="features-intro">
        <div className="feature-box">
          <div className="feature-emoji">🛡️</div>
          <h3>Secure Authentication</h3>
          <p>Passwords are secured using salt hashes (Bcrypt) and API transactions are guarded with JSON Web Tokens.</p>
        </div>

        <div className="feature-box">
          <div className="feature-emoji">📈</div>
          <h3>Visual Analytics</h3>
          <p>Understand expense distributions with Pie charts and monitor monthly budgets with Bar charts using Chart.js.</p>
        </div>

        <div className="feature-box">
          <div className="feature-emoji">🔍</div>
          <h3>Filter & Search</h3>
          <p>Easily search descriptions, isolate categories, and filter by custom start or end date parameters.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
