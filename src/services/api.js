import axios from 'axios';

// ✅ Backend URLs
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

// ✅ FIXED: Image URL helper - handles ALL possible cases
export const getImageUrl = (imagePath) => {
  // No image
  if (!imagePath || imagePath === '' || imagePath === null || imagePath === undefined) {
    console.warn('⚠️ getImageUrl: Empty image path');
    return null;
  }

  // ✅ 1. Cloudinary URL - return as is
  if (imagePath.includes('cloudinary.com') || imagePath.includes('res.cloudinary.com')) {
    console.log('✅ Cloudinary URL:', imagePath);
    return imagePath;
  }

  // ✅ 2. Any other full URL (http/https)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // ✅ 3. Data URI (base64)
  if (imagePath.startsWith('data:image')) {
    return imagePath;
  }

  // ✅ 4. /uploads/ path - prepend backend URL
  if (imagePath.startsWith('/uploads/')) {
    const fullUrl = `${BASE_URL}${imagePath}`;
    console.log('🔄 Local path → Full URL:', fullUrl);
    return fullUrl;
  }

  // ✅ 5. uploads/ without leading slash
  if (imagePath.startsWith('uploads/')) {
    return `${BASE_URL}/${imagePath}`;
  }

  // ✅ 6. Just filename (no slash)
  if (!imagePath.includes('/')) {
    return `${BASE_URL}/uploads/images/${imagePath}`;
  }

  // ✅ 7. Other relative path
  return `${BASE_URL}/${imagePath}`;
};

// ✅ Helper to get placeholder image
export const getPlaceholderImage = (text = 'No Image') => {
  return `https://placehold.co/400x300/6366f1/ffffff?text=${encodeURIComponent(text)}`;
};

// ✅ Export BASE_URL for use in other components
export const getBaseUrl = () => BASE_URL;

export default api;