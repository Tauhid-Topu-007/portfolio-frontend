import api from './api';

// Dashboard stats
const getDashboardStats = async () => {
  const [messages, blogs] = await Promise.all([
    api.get('/messages'),
    api.get('/blogs')
  ]);
  
  return {
    totalMessages: messages.data.length,
    unreadMessages: messages.data.filter(m => !m.isRead).length,
    totalBlogs: blogs.data.length,
    publishedBlogs: blogs.data.filter(b => b.isPublished).length,
    totalViews: blogs.data.reduce((sum, b) => sum + (b.views || 0), 0),
    totalLikes: blogs.data.reduce((sum, b) => sum + (b.likes || 0), 0),
  };
};

// Messages
const getMessages = async () => {
  const response = await api.get('/messages');
  return response.data;
};

const replyToMessage = async (id, replyMessage) => {
  const response = await api.post(`/messages/${id}/reply`, { replyMessage });
  return response.data;
};

const deleteMessage = async (id) => {
  const response = await api.delete(`/messages/${id}`);
  return response.data;
};

// Settings
const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

const updateSettings = async (settingsData) => {
  const response = await api.put('/settings', settingsData);
  return response.data;
};

const adminService = {
  getDashboardStats,
  getMessages,
  replyToMessage,
  deleteMessage,
  getSettings,
  updateSettings,
};

export default adminService;