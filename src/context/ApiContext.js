import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

// Auto-detect API URL based on environment
const getApiBaseUrl = () => {
  // Check for environment variable first (for production deployment)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Check if we're in development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }
  
  // For production, use your actual Replit backend URL
  return 'https://alfa-crm.replit.app/api';
};

const API_BASE_URL = getApiBaseUrl();

export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const handleRequest = async (request) => {
    setLoading(true);
    setError(null);
    try {
      const response = await request();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Customer API calls
  const getCustomers = () => handleRequest(() => api.get('/customers'));
  const getCustomer = (id) => handleRequest(() => api.get(`/customers/${id}`));
  const createCustomer = (data) => handleRequest(() => api.post('/customers', data));
  const updateCustomer = (id, data) => handleRequest(() => api.put(`/customers/${id}`, data));
  const deleteCustomer = (id) => handleRequest(() => api.delete(`/customers/${id}`));

  // Loan API calls
  const getLoans = () => handleRequest(() => api.get('/loans'));
  const getLoan = (id) => handleRequest(() => api.get(`/loans/${id}`));
  const createLoan = (data) => handleRequest(() => api.post('/loans', data));
  const updateLoan = (id, data) => handleRequest(() => api.put(`/loans/${id}`, data));
  const deleteLoan = (id) => handleRequest(() => api.delete(`/loans/${id}`));

  // Dashboard API calls
  const getDashboardStats = () => handleRequest(() => api.get('/dashboard-stats'));

  // New CRM API calls
  const fetchUserProfilePreCall = (callerNumber) => 
    handleRequest(() => api.get(`/fetch_user_profile_pre_call/?caller_number=${callerNumber}`));
  
  const postCallOutcomes = (data) => 
    handleRequest(() => api.post('/post_call_outcomes/', data));
  
  const getCustomerInteractions = (customerId) => 
    handleRequest(() => api.get(`/customers/${customerId}/interactions`));
  
  const createCustomerInteraction = (customerId, data) => 
    handleRequest(() => api.post(`/customers/${customerId}/interactions`, data));

  const value = {
    loading,
    error,
    setError,
    // Customer methods
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    // Loan methods
    getLoans,
    getLoan,
    createLoan,
    updateLoan,
    deleteLoan,
    // Dashboard methods
    getDashboardStats,
    // New CRM methods
    fetchUserProfilePreCall,
    postCallOutcomes,
    getCustomerInteractions,
    createCustomerInteraction,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}; 