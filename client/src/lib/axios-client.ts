import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

// Ensure baseURL ends with exactly one slash
let baseURL = import.meta.env.VITE_API_BASE_URL || '';
// Remove trailing slash if exists
baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
// Add /api prefix if not already present
if (!baseURL.endsWith('/api')) {
  baseURL = baseURL + '/api';
}

// Function to get token from localStorage
const getAuthToken = () => {
  // Check for token in localStorage
  const token = localStorage.getItem('token') || '';
  return token;
};

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const API = axios.create(options);

// Request interceptor to add auth token to requests
API.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set with token');
    } else {
      console.warn('No auth token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response || {};

    // Handle 401 Unauthorized
    if (status === 401) {
      console.log('401 Unauthorized - Invalid or expired token');
      
      // Clear the token from localStorage
      localStorage.removeItem('token');
      
      // Only redirect if we're not already on the login page
      if (!['/', '/sign-in'].includes(window.location.pathname)) {
        console.log('Redirecting to login page');
        // Use replace instead of direct href to prevent adding to history
        window.location.replace('/sign-in');
      }
      
      return Promise.reject(error.response?.data?.message || 'Session expired. Please log in again.');
    }

    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
      message: data?.message || error.message,
    };

    return Promise.reject(customError);
  }
);

export default API;
