import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { getImageUrl } from '../services/api';
import { FaSearch, FaCalendar, FaUser } from 'react-icons/fa';
import moment from 'moment';

const BlogPage = () => {
  const { blogs, loading } = useContext(DataContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const safeBlogs = Array.isArray(blogs) ? blogs : [];
  const categories = ['all', ...new Set(safeBlogs.map(blog => blog.category).filter(Boolean))];

  const filteredBlogs = safeBlogs.filter(blog => {
    const matchesSearch = (blog.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (blog.excerpt || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || blog.category === category;
    return matchesSearch && matchesCategory && blog.isPublished;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog | Portfolio</title>
        <meta name="description" content="Read my latest blog posts and articles" />
      </Helmet>

      <div className="pt-20 min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                My <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Blog</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Thoughts, tutorials, and insights on development
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      category === cat
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>

            {/* Blog Grid */}
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No blog posts found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog, index) => {
                  const imageUrl = getImageUrl(blog.featuredImage);
                  
                  return (
                    <motion.article
                      key={blog._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg card-hover"
                    >
                      {/* ✅ Blog Image with cache-busting */}
                      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                                  <div class="text-center text-gray-400">
                                    <svg class="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <p class="text-xs">No Image</p>
                                  </div>
                                </div>
                              `;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                            <div className="text-center text-gray-400">
                              <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs">No Image</p>
                            </div>
                          </div>
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
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                          <Link to={`/blog/${blog.slug}`} className="hover:text-blue-500 transition-colors">
                            {blog.title}
                          </Link>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags?.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="text-blue-500 hover:text-blue-600 font-semibold"
                        >
                          Read More →
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