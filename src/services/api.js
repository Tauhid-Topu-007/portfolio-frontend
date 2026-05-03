import axios from 'axios';

// ✅ Make sure this is your BACKEND URL, not frontend
const BASE_URL = 'https://portfolio-backend-1-qj6w.onrender.com';
const API_BASE = `${BASE_URL}/api`;

console.log('🔗 API Base:', API_BASE);
console.log('📁 Base URL:', BASE_URL);

const api = axios.create({
  baseURL: API_BASE,  // This should be the RENDER backend URL
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('📤', config.method?.toUpperCase(), config.baseURL + config.url);
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

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `${BASE_URL}${imagePath}`;
  if (imagePath.startsWith('uploads/')) return `${BASE_URL}/${imagePath}`;
  if (!imagePath.includes('/')) return `${BASE_URL}/uploads/images/${imagePath}`;
  return `${BASE_URL}/${imagePath}`;
};

export default api;