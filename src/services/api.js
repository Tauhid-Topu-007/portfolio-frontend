import axios from 'axios';

const BASE_URL = 'https://portfolio-backend-1-qj6w.onrender.com';
const API_BASE = `${BASE_URL}/api`;

console.log('🔗 API Base:', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('❌', err.response?.status, err.message);
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// ✅ FIXED: Handles ALL possible image path formats
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Already a full URL (http/https)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Starts with /uploads/
  if (imagePath.startsWith('/uploads/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // Starts with uploads/ (no leading slash)
  if (imagePath.startsWith('uploads/')) {
    return `${BASE_URL}/${imagePath}`;
  }
  
  // Just a filename like "image-12345.png"
  if (!imagePath.includes('/')) {
    return `${BASE_URL}/uploads/images/${imagePath}`;
  }
  
  // Any other relative path
  return `${BASE_URL}/${imagePath}`;
};

export default api;