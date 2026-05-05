// src/pages/BlogPage.jsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { getImageUrl } from '../services/api';
import NeuralBackground from '../components/NeuralBackground';
import { FaSearch, FaCalendar, FaUser, FaTag, FaClock, FaEye } from 'react-icons/fa';
import moment from 'moment';

const BlogPage = () => {
  const { blogs, loading } = useContext(DataContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const safeBlogs = Array.isArray(blogs) ? blogs : [];
  const categories = ['all', ...new Set(safeBlogs.map(blog => blog.category).filter(Boolean))];

  const filteredBlogs = safeBlogs.filter(blog => {
    const matchesSearch = (blog.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (blog.excerpt || '').toLowerCase().includes(search.toLowerCase()) ||
                          (blog.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === 'all' || blog.category === category;
    return matchesSearch && matchesCategory && blog.isPublished;
  });

  const getBlogImage = (blog) => {
    return blog.featuredImage || blog.image || blog.coverImage || blog.thumbnail || blog.imageUrl || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog | Portfolio</title>
        <meta name="description" content="Read my latest blog posts and articles about development, technology, and more" />
      </Helmet>

      <NeuralBackground 
        density="medium"
        primaryColor="#8B5CF6"
        secondaryColor="#3B82F6"
        accentColor="#EC4899"
        connectionOpacity={0.35}
        nodeSize={2.5}
        pulseSpeed={1.1}
      />

      <div className="relative z-10 pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg"
              >
                <FaTag className="text-4xl text-white" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                My Blog
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto backdrop-blur-sm bg-white/40 dark:bg-gray-900/40 rounded-2xl p-5">
                Thoughts, tutorials, and insights on web development, design, and technology
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-8 pb-20">
          <div className="container mx-auto px-4">
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12"
            >
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-5 py-2.5 rounded-full transition-all duration-300 font-medium ${
                      category === cat
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:shadow-md hover:scale-105 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-5 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition w-64 md:w-80"
                />
              </div>
            </motion.div>

            {/* Blog Grid */}
            {filteredBlogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
                  <FaSearch className="text-5xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No blog posts found.</p>
                  <button 
                    onClick={() => { setSearch(''); setCategory('all'); }}
                    className="mt-4 text-purple-500 hover:text-pink-500"
                  >
                    Clear filters →
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog, index) => {
                  const blogImage = getBlogImage(blog);
                  const imageUrl = getImageUrl(blogImage);
                  
                  return (
                    <motion.article
                      key={blog._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
                    >
                      <div className="relative h-52 overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              const parent = e.target.parentElement;
                              const placeholder = document.createElement('div');
                              placeholder.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30';
                              placeholder.innerHTML = '<div class="text-center"><svg class="w-12 h-12 mx-auto mb-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-xs text-gray-500">No Image</p></div>';
                              parent.appendChild(placeholder);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                            <div className="text-center">
                              <svg className="w-12 h-12 mx-auto mb-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs text-gray-500">No Image</p>
                            </div>
                          </div>
                        )}
                        {blog.featured && (
                          <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full font-semibold shadow-md">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <FaCalendar size={12} />
                            {blog.publishedAt ? moment(blog.publishedAt).format('MMM DD, YYYY') : 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaUser size={12} />
                            {blog.author?.name || 'Admin'}
                          </span>
                          {blog.views > 0 && (
                            <span className="flex items-center gap-1">
                              <FaEye size={12} />
                              {blog.views}
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">
                          <Link to={`/blog/${blog.slug}`}>
                            {blog.title}
                          </Link>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags?.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs text-purple-500 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="inline-flex items-center gap-1 text-purple-500 hover:text-pink-500 font-semibold group-hover:gap-2 transition-all"
                        >
                          Read More <span className="text-lg">→</span>
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage;