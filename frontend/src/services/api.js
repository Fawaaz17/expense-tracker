// ============================================================================
// SERVICE: Centralized Axios API Client
// ============================================================================
// What this file does:
// This file initializes an Axios client instance with a base URL matching our
// Node.js backend. It sets up automatic JWT header injection and exports helper
// methods for contacting backend endpoints.
//
// Key Concepts:
// - Axios Instance: A customizable wrapper for performing HTTP requests.
// - Request Interceptor: A function that runs automatically *before* every HTTP
//   request is sent. We use it to read the JWT token from localStorage and 
//   inject it into the 'Authorization' header so that our protected backend 
//   middleware can verify who is requesting.
// - API DRY Principle (Don't Repeat Yourself): Instead of writing Axios calls
//   with header tokens in every component, we do it once here.
// ============================================================================

import axios from 'axios';

// Create an instance of Axios
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API server address
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- Request Interceptor ---
// Intercepts every request before it goes to the network
API.interceptors.request.use(
  (config) => {
    // 1. Retrieve the token stored in localStorage (if any)
    const token = localStorage.getItem('token');

    // 2. If token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- API Helper Methods ---
// We export standard functions that call specific API paths.
// This abstract representation is easy to explain during code walkthroughs!

export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },
  
  // Authenticate an existing user
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },
  
  // Get logged-in user details
  getProfile: async () => {
    const response = await API.get('/auth/profile');
    return response.data;
  }
};

export const transactionService = {
  // Fetch transactions with optional query filters (search, category, sorting, etc.)
  getTransactions: async (params = {}) => {
    const response = await API.get('/transactions', { params });
    return response.data;
  },
  
  // Save a new transaction
  createTransaction: async (transactionData) => {
    const response = await API.post('/transactions', transactionData);
    return response.data;
  },
  
  // Edit an existing transaction by ID
  updateTransaction: async (id, transactionData) => {
    const response = await API.put(`/transactions/${id}`, transactionData);
    return response.data;
  },
  
  // Delete a transaction by ID
  deleteTransaction: async (id) => {
    const response = await API.delete(`/transactions/${id}`);
    return response.data;
  }
};

export const dashboardService = {
  // Retrieve summary statistics and chart aggregates
  getStats: async () => {
    const response = await API.get('/dashboard');
    return response.data;
  }
};

export default API;
