import axios from 'axios';

const BASE_URL = 'https://portfolio-backend-axtu.onrender.com';
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

// ✅ FIXED: Image URL helper - handles ALL possible image sources
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // ✅ Cloudinary URL - return as is
  if (imagePath.includes('cloudinary.com') || imagePath.includes('res.cloudinary.com')) {
    return imagePath;
  }
  
  // ✅ Any other full URL (http/https)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // ✅ Local /uploads path
  if (imagePath.startsWith('/uploads/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // ✅ uploads/ without leading slash
  if (imagePath.startsWith('uploads/')) {
    return `${BASE_URL}/${imagePath}`;
  }
  
  // ✅ Just a filename
  if (!imagePath.includes('/')) {
    return `${BASE_URL}/uploads/images/${imagePath}`;
  }
  
  // ✅ Other relative path
  return `${BASE_URL}/${imagePath}`;
};

// ✅ Helper to get placeholder image
export const getPlaceholderImage = (text = 'No Image') => {
  return `https://via.placeholder.com/400x300/6366f1/ffffff?text=${encodeURIComponent(text)}`;
};

export default api;