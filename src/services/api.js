import axios from 'axios';

// ✅ FORCE CORRECT URL
const API_BASE = 'https://portfolio-backend-2-ly21.onrender.com/api';

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

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.includes('cloudinary.com')) return imagePath;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads/')) return `https://portfolio-backend-2-ly21.onrender.com${imagePath}`;
  if (imagePath.startsWith('uploads/')) return `https://portfolio-backend-2-ly21.onrender.com/${imagePath}`;
  if (!imagePath.includes('/')) return `https://portfolio-backend-2-ly21.onrender.com/uploads/images/${imagePath}`;
  return `https://portfolio-backend-2-ly21.onrender.com/${imagePath}`;
};

export default api;