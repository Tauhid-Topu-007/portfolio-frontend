import api from './api';

const getBlogs = async (params = {}) => {
  const response = await api.get('/blogs', { params });
  return response.data;
};

const getBlogBySlug = async (slug) => {
  const response = await api.get(`/blogs/slug/${slug}`);
  return response.data;
};

const createBlog = async (blogData) => {
  const response = await api.post('/blogs', blogData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const updateBlog = async (id, blogData) => {
  const response = await api.put(`/blogs/${id}`, blogData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
};

const likeBlog = async (id) => {
  const response = await api.post(`/blogs/${id}/like`);
  return response.data;
};

const blogService = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
};

export default blogService;