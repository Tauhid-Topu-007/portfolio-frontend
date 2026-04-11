import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { FaCalendar, FaUser, FaHeart, FaEye, FaArrowLeft, FaTag } from 'react-icons/fa';
import moment from 'moment';

const BlogDetail = ({ blog, onLike, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
        <Link to="/blog" className="text-primary-500 hover:text-primary-600">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article>
      {/* Hero Section */}
      {blog.featuredImage && (
        <div className="relative h-[60vh] min-h-[400px] bg-cover bg-center mb-8 rounded-xl overflow-hidden" style={{ backgroundImage: `url(${blog.featuredImage})` }}>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 mb-6">
          <FaArrowLeft /> Back to Blog
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <span className="flex items-center gap-1">
            <FaCalendar /> {moment(blog.publishedAt).format('MMMM DD, YYYY')}
          </span>
          <span className="flex items-center gap-1">
            <FaUser /> {blog.author?.name || 'Admin'}
          </span>
          <span className="flex items-center gap-1">
            <FaEye /> {blog.views || 0} views
          </span>
          <button onClick={onLike} className="flex items-center gap-1 hover:text-primary-500 transition-colors">
            <FaHeart /> {blog.likes || 0} likes
          </button>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
        
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FaTag className="text-primary-500" />
              <h3 className="text-lg font-semibold">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogDetail;