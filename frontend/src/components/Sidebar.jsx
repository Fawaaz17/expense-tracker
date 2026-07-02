// ============================================================================
// COMPONENT: Sidebar (Navigation Panel)
// ============================================================================
// What this file does:
// Renders the side navigation menu containing links to the core pages:
// Dashboard, Transactions History, Add Transaction, and Profile Details.
//
// Key Concepts:
// - NavLink: A special React Router component that automatically detects if
//   its route is active and applies an 'active' class to the link.
// - Conditional Rendering: If a user is not logged in, this sidebar returns 
//   null (does not render) to keep public pages clean.
// ============================================================================

import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  // We check if the user is authenticated. If not, hide the sidebar!
  const token = localStorage.getItem('token');
  if (!token) return null;

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {/* Dashboard Link */}
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            📊 Dashboard
          </NavLink>
        </li>

        {/* Transactions History Link */}
        <li>
          <NavLink 
            to="/transactions" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            📋 Transactions
          </NavLink>
        </li>

        {/* Add Transaction Link */}
        <li>
          <NavLink 
            to="/add-transaction" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            ➕ Add Transaction
          </NavLink>
        </li>

        {/* Profile Details Link */}
        <li>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            👤 My Profile
          </NavLink>
        </li>
      </ul>

      {/* Helpful Hint Footer */}
      <div className="sidebar-footer" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        SmartTracker v1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;
