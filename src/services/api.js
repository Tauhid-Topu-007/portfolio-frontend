import axios from 'axios';

const BASE_URL = 'https://portfolio-backend-axtu.onrender.com';
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
  if (config.method === 'get') {
    config.params = { ...config.params, _t: Date.now() };
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

// ✅ Cache-busted image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  let url;
  
  if (imagePath.includes('cloudinary.com')) {
    url = imagePath;
  } else if (imagePath.startsWith('http')) {
    url = imagePath;
  } else if (imagePath.startsWith('/uploads/')) {
    url = `${BASE_URL}${imagePath}`;
  } else if (imagePath.startsWith('uploads/')) {
    url = `${BASE_URL}/${imagePath}`;
  } else if (!imagePath.includes('/')) {
    url = `${BASE_URL}/uploads/images/${imagePath}`;
  } else {
    url = `${BASE_URL}/${imagePath}`;
  }
  
  // Add cache buster
  if (url && !url.startsWith('data:')) {
    url += `${url.includes('?') ? '&' : '?'}v=${Date.now()}`;
  }
  
  return url;
};

export default api;