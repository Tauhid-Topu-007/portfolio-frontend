import axios from 'axios';

// Get API URL and ensure no trailing slash
const API_URL = (import.meta.env.VITE_API_URL || 'https://portfolio-backend-1-qj6w.onrender.com').replace(/\/$/, '');

console.log('🔗 API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ✅ FIX: Clean URL construction - prevents double slashes
    // Remove any leading slash from config.url
    let cleanUrl = config.url.replace(/^\/+/, '');
    
    // Only add /api/ prefix if URL doesn't already have it
    if (!cleanUrl.startsWith('api/') && !cleanUrl.startsWith('http')) {
      cleanUrl = 'api/' + cleanUrl;
    }
    
    // Ensure single slash between baseURL and path
    config.url = '/' + cleanUrl.replace(/^\/+/, '');
    
    console.log(`📤 ${config.method?.toUpperCase()} ${API_URL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;