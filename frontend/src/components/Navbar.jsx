// ============================================================================
// COMPONENT: Navbar (Header Bar)
// ============================================================================
// What this file does:
// Renders the global top navigation bar of the application. It dynamically 
// changes its display based on whether a user is logged in or not.
//
// Key Features:
// - Shows application branding and logo.
// - If logged in: Displays user's name (linking to profile) and a Logout button.
// - If logged out: Displays register and login action links.
// - Handles session logout by purging token/user items from localStorage.
// ============================================================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Retrieve token and user details from localStorage
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  
  // Safely parse user details if they exist
  let user = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error('Error parsing user details:', e);
    }
  }

  // --- Logout Action ---
  const handleLogout = () => {
    // 1. Remove auth tokens and user records from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Redirect the user back to the login screen
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      {/* Brand Logo & Name */}
      <Link to="/" className="navbar-brand">
        <span>💰</span> SmartTracker
      </Link>

      {/* User Actions Panel */}
      <div className="navbar-user-actions">
        {token ? (
          // If logged in, show profile link and logout button
          <>
            <Link to="/profile" className="user-profile-badge">
              👤 {user ? user.name : 'Profile'}
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </>
        ) : (
          // If logged out, show Login & Register options
          <>
            <Link to="/login" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
