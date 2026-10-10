import axios from 'axios';

/**
 * Centralized Axios API client for Sweet Crumbs Bakery.
 *
 * VITE_API_URL is read from frontend/.env
 * Default fallback: http://localhost:5000
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sweet_crumbs_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: log network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('[API Network Error]: Backend unreachable at', API_URL);
    }
    return Promise.reject(error);
  }
);

// -------------------------------------------------------
// Service Methods (called from React pages/components)
// -------------------------------------------------------

/** Health check - verifies React <-> Express connection */
export const testApiConnection = async () => {
  const response = await api.get('/api/test');
  return response.data;
};

/** Get featured products (homepage) */
export const getFeaturedProducts = async () => {
  const response = await api.get('/api/products/featured');
  return response.data;
};

/**
 * Get all products with optional filters.
 * @param {Object} params - Optional: { search, category, minPrice, maxPrice, sort }
 */
export const getAllProducts = async (params = {}) => {
  const response = await api.get('/api/products', { params });
  return response.data;
};

/**
 * Get a single product by its ID or slug.
 * @param {string} id - Product ID or slug
 */
export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

/** Get all product categories with counts */
export const getCategories = async () => {
  const response = await api.get('/api/categories');
  return response.data;
};


/** Initiate a Khalti sandbox payment. */
export const initiateKhaltiPayment = async (payload) => {
  const response = await api.post('/api/payment/khalti/initiate', payload);
  return response.data;
};

/** Verify a Khalti payment on the backend using the pidx returned by Khalti. */
export const verifyKhaltiPayment = async (pidx) => {
  const response = await api.post('/api/payment/khalti/lookup', { pidx });
  return response.data;
};

/** Get one order from MongoDB by order number. */
export const getOrderById = async (orderNumber) => {
  const response = await api.get(`/api/orders/${orderNumber}`);
  return response.data;
};

/** Get all saved orders for a customer email. */
export const getOrdersByEmail = async (email) => {
  const response = await api.get('/api/orders', { params: { email } });
  return response.data;
};

export default api;
