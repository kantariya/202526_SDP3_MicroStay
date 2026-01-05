import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api/auth', // Base URL for your Spring Boot auth endpoints
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// --- REQUEST INTERCEPTOR ---
// Automatically add the JWT token to the "Authorization" header of every request
api.interceptors.request.use(
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

// --- RESPONSE INTERCEPTOR ---
// Handle global errors, like expired tokens (401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    // Return the response directly if successful
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true
      });
    }

    const status = error.response.status;
    const data = error.response.data;

    // Handle 401 Unauthorized - token expired or invalid
    if (status === 401) {
      console.warn("Session expired or unauthorized. Logging out...");
      
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      
      // Force redirect to login page
      window.location.href = '/login';
      return Promise.reject({
        message: 'Your session has expired. Please login again.',
        status: 401
      });
    }

    // Handle validation errors (400 with errors object)
    if (status === 400 && data.errors) {
      const validationErrors = Object.entries(data.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join('\n');
      return Promise.reject({
        message: validationErrors || data.message || 'Validation failed',
        errors: data.errors,
        status: 400
      });
    }

    // Handle other errors
    const errorMessage = data?.message || data?.error || 'An unexpected error occurred';
    return Promise.reject({
      message: errorMessage,
      status: status,
      data: data
    });
  }
);

export default api;