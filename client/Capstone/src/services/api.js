import axios from 'axios';
import { getToken } from '../utils/auth';
import API_BASE_URL from '../config/apiConfig';

// Create axios instance with environment-aware base URL
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
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