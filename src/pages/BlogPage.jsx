import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { FaSearch, FaCalendar, FaUser } from 'react-icons/fa';
import moment from 'moment';

const BlogPage = () => {
  const { blogs, loading } = useContext(DataContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...new Set(blogs?.map(blog => blog.category).filter(Boolean))];

  const filteredBlogs = blogs?.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
                          blog.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || blog.category === category;
    return matchesSearch && matchesCategory && blog.isPublished;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog | Portfolio</title>
        <meta name="description" content="Read my latest blog posts and articles" />
      </Helmet>

      <div className="pt-20 min-h-screen">
        <section className="py-12 bg-gradient-to-br from-primary-500/10 to-primary-700/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                My <span className="gradient-text">Blog</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Thoughts, tutorials, and insights on development
              </p>
            </motion.div>
          </div>
        </section>

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
                        ? 'bg-primary-500 text-white'
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
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Blog Grid */}
            {filteredBlogs?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No blog posts found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog, index) => (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg card-hover"
                  >
                    {blog.featuredImage && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <FaCalendar size={12} />
                          {moment(blog.publishedAt).format('MMM DD, YYYY')}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUser size={12} />
                          {blog.author?.name || 'Admin'}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold mb-2">
                        <Link to={`/blog/${blog.slug}`} className="hover:text-primary-500">
                          {blog.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags?.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs text-primary-500">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="text-primary-500 hover:text-primary-600 font-semibold"
                      >
                        Read More →
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage;