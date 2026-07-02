// ============================================================================
// ENTRY POINT: main.jsx
// ============================================================================
// What this file does:
// This is the bootstrap code that renders the React tree inside the HTML 
// element with the ID of 'root'.
// ============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Load global CSS variables and responsive rules

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
