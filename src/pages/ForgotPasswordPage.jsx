// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import toast from 'react-hot-toast';
import NeuralBackground from '../components/NeuralBackground';
import { FaEnvelope, FaArrowLeft, FaPaperPlane, FaCopy, FaCheckCircle, FaKey } from 'react-icons/fa';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      
      if (response.data.success) {
        setSubmitted(true);
        
        setTimeout(async () => {
          try {
            const linkResponse = await axios.get(`/api/auth/get-reset-link/${email}`);
            if (linkResponse.data.success && linkResponse.data.resetLink) {
              setResetLink(linkResponse.data.resetLink);
              toast.success('Reset link retrieved!');
            }
          } catch (err) {
            if (response.data.resetUrl) {
              setResetLink(response.data.resetUrl);
            }
          }
        }, 1000);
        
        toast.success(response.data.message || 'Reset link generated!');
      } else {
        toast.error(response.data.message || 'Failed to generate reset link');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate reset link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resetLink);
    toast.success('Reset link copied to clipboard!');
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | Portfolio</title>
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            >
              <FaKey className="text-3xl text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email to reset your password
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    Generate Reset Link <FaPaperPlane size={14} />
                  </>
                )}
              </button>

              <div className="text-center">
                <Link to="/admin/login" className="text-purple-500 hover:text-pink-500 text-sm inline-flex items-center gap-1">
                  <FaArrowLeft size={12} /> Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-xl"
              >
                <FaCheckCircle className="text-2xl mx-auto mb-2" />
                <p>Reset link generated for:</p>
                <p className="font-semibold mt-1 break-all">{email}</p>
              </motion.div>
              
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl">
                <p className="text-sm font-semibold mb-2 text-blue-700 dark:text-blue-400">📋 Reset Your Password</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Use the link below to reset your password:
                </p>
                
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-3">
                  {resetLink ? (
                    <>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Reset Link:</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-xs text-purple-500 break-all flex-1 font-mono">
                          {resetLink}
                        </code>
                        <button
                          onClick={copyToClipboard}
                          className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-colors"
                          title="Copy link"
                        >
                          <FaCopy size={14} />
                        </button>
                      </div>
                      <a
                        href={resetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-500 hover:text-pink-500 mt-2 inline-block"
                      >
                        Click here to reset password →
                      </a>
                    </>
                  ) : (
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                      <p className="text-sm font-semibold mb-1 text-yellow-700 dark:text-yellow-400">⚠️ Check Backend Console</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        The reset link is printed in your backend terminal. 
                        Look for "PASSWORD RESET LINK" in the console.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <Link to="/admin/login" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                Back to Login
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;