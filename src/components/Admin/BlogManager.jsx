import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye } from 'react-icons/fa';
import moment from 'moment';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    category: 'General',
    isPublished: false,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs');
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('slug', formData.slug.toLowerCase().replace(/ /g, '-'));
    formDataToSend.append('excerpt', formData.excerpt);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim())));
    formDataToSend.append('category', formData.category);
    formDataToSend.append('isPublished', formData.isPublished);
    
    if (imageFile) {
      formDataToSend.append('featuredImage', imageFile);
    }

    try {
      if (editingBlog) {
        await api.put(`/blogs/${editingBlog._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Blog updated successfully');
      } else {
        await api.post('/blogs', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Blog created successfully');
      }
      fetchBlogs();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(error.response?.data?.message || 'Failed to save blog');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/blogs/${id}`);
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      tags: '',
      category: 'General',
      isPublished: false,
    });
    setImageFile(null);
    setEditingBlog(null);
  };

  const editBlog = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      tags: blog.tags?.join(', ') || '',
      category: blog.category || 'General',
      isPublished: blog.isPublished || false,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Blog Post
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-500">No blog posts yet. Click "Add Blog Post" to create one.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4">
                    <div className="font-medium">{blog.title}</div>
                    <div className="text-sm text-gray-500">Slug: {blog.slug}</div>
                  </td>
                  <td className="px-6 py-4">{blog.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{moment(blog.createdAt).format('MMM DD, YYYY')}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => editBlog(blog)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(blog._id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                      <a href={`/blog/${blog.slug}`} target="_blank" className="text-green-500 hover:text-green-700">
                        <FaEye />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">{editingBlog ? 'Edit Blog Post' : 'Add Blog Post'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                  className="w-full px-4 py-2 rounded-lg border"
                />
                <p className="text-xs text-gray-500 mt-1">URL-friendly name (e.g., my-first-blog-post)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Content * (Markdown supported)</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border font-mono"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="react, javascript, webdev"
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  />
                  <span>Publish immediately</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingBlog ? 'Update' : 'Create'} Blog Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;