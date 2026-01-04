import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api/auth', // Base URL for your Spring Boot auth endpoints
  headers: {
    'Content-Type': 'application/json',
  },
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
    // If the server returns 401 (Unauthorized), the token is likely expired or invalid
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Logging out...");
      
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      
      // Force redirect to login page
      window.location.href = '/login';
    }
    
    // Return the error so it can still be caught in the component's try/catch
    return Promise.reject(error);
  }
);

export default api;