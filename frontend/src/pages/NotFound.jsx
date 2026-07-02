// ============================================================================
// PAGE: NotFound (404 Page)
// ============================================================================
// What this file does:
// Renders a simple, elegant fallback screen when a user navigates to a URL
// path that is not defined in our routing configuration.
// ============================================================================

import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', margin: '6rem auto', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontSize: '5rem' }}>⚠️</div>
      <h1 style={{ fontSize: '3rem', fontFamily: 'Outfit' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div>
        <Link to="/" className="btn btn-primary">
          Back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
