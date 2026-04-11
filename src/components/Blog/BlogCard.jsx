import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendar, FaUser, FaHeart, FaEye } from 'react-icons/fa';
import moment from 'moment';

const BlogCard = ({ blog, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg card-hover"
    >
      {blog.featuredImage && (
        <Link to={`/blog/${blog.slug}`} className="block h-48 overflow-hidden">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </Link>
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
          <span className="flex items-center gap-1">
            <FaEye size={12} />
            {blog.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaHeart size={12} />
            {blog.likes || 0}
          </span>
        </div>
        
        <h2 className="text-xl font-bold mb-2">
          <Link to={`/blog/${blog.slug}`} className="hover:text-primary-500 transition-colors">
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
          className="text-primary-500 hover:text-primary-600 font-semibold inline-flex items-center gap-1"
        >
          Read More →
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;