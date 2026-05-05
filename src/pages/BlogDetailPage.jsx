// src/pages/BlogDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import NeuralBackground from '../components/NeuralBackground';
import { FaArrowLeft, FaCalendar, FaUser, FaTag, FaHeart, FaShare, FaTwitter, FaFacebook, FaLinkedin, FaCopy, FaCheck } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import toast from 'react-hot-toast';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`/api/blogs/slug/${slug}`);
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      if (error.response?.status === 404) {
        navigate('/blog');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (liked) return;
    try {
      await axios.post(`/api/blogs/${blog._id}/like`);
      setBlog({ ...blog, likes: (blog.likes || 0) + 1 });
      setLiked(true);
      toast.success('Thanks for liking!');
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = encodeURIComponent(blog.title);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    toast.success(`Shared on ${platform}!`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const featuredImage = blog.featuredImage || blog.image;

  return (
    <>
      <Helmet>
        <title>{blog.title} | Portfolio</title>
        <meta name="description" content={blog.excerpt} />
      </Helmet>

      <NeuralBackground 
        density="low"
        primaryColor="#8B5CF6"
        secondaryColor="#3B82F6"
        accentColor="#EC4899"
        connectionOpacity={0.3}
        nodeSize={2.2}
        pulseSpeed={0.8}
      />

      <div className="relative z-10 pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] bg-cover bg-center" style={{ backgroundImage: `url(${featuredImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                {blog.title}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-6 text-sm"
              >
                <span className="flex items-center gap-2">
                  <FaCalendar /> {moment(blog.publishedAt).format('MMMM DD, YYYY')}
                </span>
                <span className="flex items-center gap-2">
                  <FaUser /> {blog.author?.name || 'Admin'}
                </span>
                <span className="flex items-center gap-2">
                  <FaHeart className="text-red-400" /> {blog.likes || 0} likes
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link to="/blog" className="inline-flex items-center gap-2 text-purple-500 hover:text-pink-500 mb-8 group">
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
              </Link>

              <article className="prose prose-lg dark:prose-invert max-w-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </article>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <FaTag className="text-purple-500" />
                    <h3 className="text-lg font-semibold">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm text-purple-600 dark:text-purple-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex flex-wrap gap-4 justify-center"
              >
                <button
                  onClick={handleLike}
                  disabled={liked}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    liked 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                      : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white'
                  }`}
                >
                  <FaHeart className={liked ? 'animate-pulse' : ''} /> 
                  {liked ? 'Liked!' : `Like (${blog.likes || 0})`}
                </button>
                
                <div className="flex gap-2">
                  <button onClick={() => handleShare('twitter')} className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-blue-400 hover:text-white transition-all">
                    <FaTwitter />
                  </button>
                  <button onClick={() => handleShare('facebook')} className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-blue-600 hover:text-white transition-all">
                    <FaFacebook />
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-blue-700 hover:text-white transition-all">
                    <FaLinkedin />
                  </button>
                  <button onClick={copyToClipboard} className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-purple-500 hover:text-white transition-all">
                    {copied ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogDetailPage;