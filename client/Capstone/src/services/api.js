import axios from 'axios';
import { getToken } from '../utils/auth';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust based on your server URL
});

// Add request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;