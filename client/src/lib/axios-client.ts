import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

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
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/') {
        console.log('401 Unauthorized - Redirecting to login');
        localStorage.removeItem('token');
        // Use replace instead of direct href to prevent adding to history
        window.location.replace('/');
      }
      return Promise.reject('Session expired. Please log in again.');
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
