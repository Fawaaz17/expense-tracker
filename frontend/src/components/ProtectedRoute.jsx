// ============================================================================
// COMPONENT: ProtectedRoute (Route Guard)
// ============================================================================
// What this file does:
// This component protects certain pages (like Dashboard, Profile) from being
// accessed by users who are not logged in.
//
// How it works:
// 1. Checks if the JWT 'token' exists in the client's localStorage.
// 2. If the token is found, it permits navigation by rendering the children 
//    components.
// 3. If NO token is found, it immediately redirects the user to the '/login' 
//    page using React Router's <Navigate> component.
//
// Input:
// children - The components/pages that should be rendered if authenticated.
//
// Output:
// Renders the requested page OR redirects to the login screen.
// ============================================================================

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if a token is stored in localStorage
  const token = localStorage.getItem('token');

  // If token is missing, redirect to login page
  // 'replace' ensures the user cannot hit the "back" button to return to the protected screen.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token is present, allow access to the protected child page
  return children;
};

export default ProtectedRoute;
