// ============================================================================
// ROOT COMPONENT: App.jsx
// ============================================================================
// What this file does:
// This is the main orchestrator of the React frontend application. It:
// 1. Configures React Router to switch views depending on the URL path.
// 2. Defines the global application layout (header Navbar and Sidebar).
// 3. Implements Route Guarding by wrapping private pages in <ProtectedRoute>.
//
// Key Concepts:
// - Declarative Routing: Defining URL paths and mapping them to pages.
// - Route Protection: Preventing unauthenticated access at the router level.
// ============================================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Shared Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Import Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import EditTransaction from './pages/EditTransaction';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  // We check if a token is present to apply conditional CSS layout classes.
  // If logged in, we shift the main-content container to accommodate the sidebar.
  const token = localStorage.getItem('token');

  return (
    <Router>
      {/* 1. Global Navigation Bar */}
      <Navbar />

      <div className="app-container">
        {/* 2. Collapsible/Fixed Sidebar Panel (only visible if logged in) */}
        <Sidebar />

        {/* 3. Main Page Container */}
        {/* If token exists, we apply standard margins (defined in index.css) */}
        <main className={token ? 'main-content' : 'main-content-public'} style={{
          marginLeft: token ? 'var(--sidebar-width)' : '0px',
          marginTop: 'var(--header-height)',
          padding: '2rem',
          width: token ? 'calc(100% - var(--sidebar-width))' : '100%',
          flexGrow: 1
        }}>
          
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* --- Protected Routes (Enforced by ProtectedRoute guard) --- */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-transaction" 
              element={
                <ProtectedRoute>
                  <AddTransaction />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-transaction/:id" 
              element={
                <ProtectedRoute>
                  <EditTransaction />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* --- Fallback 404 Route --- */}
            <Route path="*" element={<NotFound />} />
          </Routes>

        </main>
      </div>
    </Router>
  );
}

export default App;
