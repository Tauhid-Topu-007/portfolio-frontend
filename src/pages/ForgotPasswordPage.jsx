import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEnvelope, FaArrowLeft, FaPaperPlane, FaCopy } from 'react-icons/fa';

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
      console.log('Response:', response.data);
      
      if (response.data.success) {
        setSubmitted(true);
        
        // Try to fetch the reset link from the separate endpoint
        setTimeout(async () => {
          try {
            const linkResponse = await axios.get(`/api/auth/get-reset-link/${email}`);
            if (linkResponse.data.success && linkResponse.data.resetLink) {
              setResetLink(linkResponse.data.resetLink);
              toast.success('Reset link retrieved!');
            }
          } catch (err) {
            console.log('Could not fetch reset link automatically');
            // Check if response contains resetUrl
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
      console.error('Error:', error.response?.data || error.message);
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

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-primary-700/20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Forgot Password</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email to reset your password
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Generating...' : 'Generate Reset Link'}
                {!loading && <FaPaperPlane size={14} />}
              </button>

              <div className="text-center">
                <Link to="/admin/login" className="text-primary-500 hover:text-primary-600 text-sm inline-flex items-center gap-1">
                  <FaArrowLeft size={12} /> Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-lg">
                <p>Reset link generated for:</p>
                <p className="font-semibold mt-1 break-all">{email}</p>
              </div>
              
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">📋 Reset Your Password</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Use the link below to reset your password:
                </p>
                
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-3">
                  {resetLink ? (
                    <>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Reset Link:</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-xs text-primary-500 break-all flex-1">
                          {resetLink}
                        </code>
                        <button
                          onClick={copyToClipboard}
                          className="p-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                          title="Copy link"
                        >
                          <FaCopy size={14} />
                        </button>
                      </div>
                      <a
                        href={resetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-500 hover:text-primary-600 mt-2 inline-block"
                      >
                        Click here to reset password →
                      </a>
                    </>
                  ) : (
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded">
                      <p className="text-sm font-semibold mb-1">⚠️ Check Backend Console</p>
                      <p className="text-xs">
                        The reset link is printed in your backend terminal. 
                        Look for "🔐 PASSWORD RESET LINK" in the console.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <Link to="/admin/login" className="btn-primary inline-block">
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