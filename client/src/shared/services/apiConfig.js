import axios from 'axios';

// API base configuration
export const API_BASE_URL = 'http://localhost:4005/api';

// API endpoints
export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/products`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  CART: `${API_BASE_URL}/cart`,
  CART_ADD: `${API_BASE_URL}/cart/add`,
  CART_ITEM: (id) => `${API_BASE_URL}/cart/item/${id}`,
  CART_CLEAR: `${API_BASE_URL}/cart/clear`,
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    LOGIN: `${API_BASE_URL}/users/login`,
    REGISTER: `${API_BASE_URL}/users/register`,
    LOGOUT: `${API_BASE_URL}/users/logout`
  }
};

// Helper function to get auth headers
export const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);