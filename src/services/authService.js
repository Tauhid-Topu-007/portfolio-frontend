import api from './api';

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
};

const getCurrentUser = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

const updateProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData);
  return response.data;
};

const authService = {
  login,
  logout,
  getCurrentUser,
  updateProfile,
};

export default authService;