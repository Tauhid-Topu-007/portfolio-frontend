import axios from 'axios';

// ✅ NEW BACKEND URL
const BASE_URL = 'https://portfolio-backend-2-ly21.onrender.com';
const API_BASE = `${BASE_URL}/api`;

console.log('🔗 API Base:', API_BASE);
console.log('📁 Base URL:', BASE_URL);

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
  console.log('📤', config.method?.toUpperCase(), API_BASE + config.url);
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

// ✅ Image URL helper
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Cloudinary URL - return as is
  if (imagePath.includes('cloudinary.com')) {
    return imagePath;
  }
  
  // Full URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // /uploads/ path
  if (imagePath.startsWith('/uploads/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // uploads/ without leading slash
  if (imagePath.startsWith('uploads/')) {
    return `${BASE_URL}/${imagePath}`;
  }
  
  // Just filename
  if (!imagePath.includes('/')) {
    return `${BASE_URL}/uploads/images/${imagePath}`;
  }
  
  return `${BASE_URL}/${imagePath}`;
};

export default api;