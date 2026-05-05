// src/pages/AdminLoginPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../context/AuthContext';
import NeuralBackground from '../components/NeuralBackground';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaArrowRight, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(email, password);
    setLoading(false);
    
    if (success) {
      toast.success('Welcome back!');
      navigate('/admin');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Portfolio</title>
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
              <FaShieldAlt className="text-3xl text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="admin@portfolio.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
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
                  Login <FaArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link 
              to="/forgot-password" 
              className="text-sm text-purple-500 hover:text-pink-500 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm">
            <p className="text-gray-500 dark:text-gray-400 mb-2">Demo Credentials:</p>
            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-3">
              <p className="text-gray-700 dark:text-gray-300">📧 Email: <span className="font-mono">email@gmail.com</span></p>
              <p className="text-gray-700 dark:text-gray-300">🔑 Password: <span className="font-mono">admin</span></p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLoginPage;