import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { FaArrowLeft, FaCalendar, FaUser, FaTag, FaHeart } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`/api/blogs/slug/${slug}`);
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`/api/blogs/${blog._id}/like`);
      setBlog({ ...blog, likes: blog.likes + 1 });
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
          <Link to="/blog" className="text-primary-500 hover:text-primary-600">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | Portfolio</title>
        <meta name="description" content={blog.excerpt} />
      </Helmet>

      <div className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] bg-cover bg-center" style={{ backgroundImage: `url(${blog.featuredImage})` }}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <FaCalendar /> {moment(blog.publishedAt).format('MMMM DD, YYYY')}
                </span>
                <span className="flex items-center gap-1">
                  <FaUser /> {blog.author?.name || 'Admin'}
                </span>
                <span className="flex items-center gap-1">
                  <FaHeart /> {blog.likes} likes
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link to="/blog" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 mb-8">
                <FaArrowLeft /> Back to Blog
              </Link>

              <article className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </article>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
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

              {/* Like Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleLike}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <FaHeart /> Like this post ({blog.likes})
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogDetailPage;