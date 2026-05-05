// src/pages/DashboardPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import NeuralBackground from '../components/NeuralBackground';
import axios from 'axios';
import { 
  FaProjectDiagram, 
  FaBlog, 
  FaFlask, 
  FaCode, 
  FaEnvelope,
  FaEye,
  FaHeart,
  FaUser,
  FaChartLine,
  FaArrowRight,
  FaUsers,
  FaCalendarAlt,
  FaThumbsUp,
  FaComment,
  FaSpinner
} from 'react-icons/fa';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { projects, blogs, skills, loading } = useContext(DataContext);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    unreadMessages: 0,
    totalMessages: 0,
    recentMessages: []
  });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setFetching(true);
    try {
      const [messagesRes, blogsRes] = await Promise.all([
        axios.get('/api/messages'),
        axios.get('/api/blogs')
      ]);
      
      const totalViews = blogsRes.data.reduce((sum, blog) => sum + (blog.views || 0), 0);
      const totalLikes = blogsRes.data.reduce((sum, blog) => sum + (blog.likes || 0), 0);
      const unreadMessages = messagesRes.data.filter(m => !m.isRead).length;
      
      setStats({
        totalViews,
        totalLikes,
        unreadMessages,
        totalMessages: messagesRes.data.length,
        recentMessages: messagesRes.data.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setFetching(false);
    }
  };

  const statCards = [
    { title: 'Total Projects', value: projects?.length || 0, icon: FaProjectDiagram, gradient: 'from-blue-500 to-blue-600', link: '/admin/projects', delay: 0 },
    { title: 'Blog Posts', value: blogs?.length || 0, icon: FaBlog, gradient: 'from-green-500 to-green-600', link: '/admin/blogs', delay: 0.05 },
    { title: 'Skills', value: skills?.length || 0, icon: FaCode, gradient: 'from-purple-500 to-purple-600', link: '/admin/skills', delay: 0.1 },
    { title: 'Total Messages', value: stats.totalMessages, icon: FaEnvelope, gradient: 'from-yellow-500 to-yellow-600', link: '/admin/messages', delay: 0.15 },
    { title: 'Unread', value: stats.unreadMessages, icon: FaComment, gradient: 'from-red-500 to-red-600', link: '/admin/messages', delay: 0.2 },
    { title: 'Total Views', value: stats.totalViews, icon: FaEye, gradient: 'from-indigo-500 to-indigo-600', link: '/admin/blogs', delay: 0.25 },
    { title: 'Total Likes', value: stats.totalLikes, icon: FaHeart, gradient: 'from-pink-500 to-pink-600', link: '/admin/blogs', delay: 0.3 },
  ];

  const quickActions = [
    { title: 'Add Project', icon: FaProjectDiagram, gradient: 'from-blue-500 to-blue-600', link: '/admin/projects', description: 'Showcase your work' },
    { title: 'Write Blog', icon: FaBlog, gradient: 'from-green-500 to-green-600', link: '/admin/blogs', description: 'Share your thoughts' },
    { title: 'Add Skill', icon: FaCode, gradient: 'from-purple-500 to-purple-600', link: '/admin/skills', description: 'Highlight expertise' },
    { title: 'Add Research', icon: FaFlask, gradient: 'from-orange-500 to-orange-600', link: '/admin/research', description: 'Academic work' },
    { title: 'View Messages', icon: FaEnvelope, gradient: 'from-yellow-500 to-yellow-600', link: '/admin/messages', description: `${stats.unreadMessages} unread` },
    { title: 'Settings', icon: FaUser, gradient: 'from-gray-500 to-gray-600', link: '/admin/settings', description: 'Customize site' },
  ];

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-purple-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Portfolio Admin</title>
      </Helmet>

      <NeuralBackground 
        density="low"
        primaryColor="#8B5CF6"
        secondaryColor="#3B82F6"
        accentColor="#EC4899"
        connectionOpacity={0.25}
        nodeSize={2}
        pulseSpeed={0.8}
      />

      <div className="relative z-10 pt-20 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaUser className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Welcome back, <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{user?.name || 'Admin'}!</span>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Here's what's happening with your portfolio today.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.delay }}
                  className="group"
                >
                  <Link to={stat.link} className="block">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
                          <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                        <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                          <Icon className="text-white text-xl" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
                <FaChartLine className="text-purple-500" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.title}
                      to={action.link}
                      className="group text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-lg transition-all hover:scale-[1.02]"
                    >
                      <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="text-white text-xl" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">{action.title}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{action.description}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            {/* Recent Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Messages</h2>
                <Link to="/admin/messages" className="text-purple-500 hover:text-pink-500 text-sm flex items-center gap-1">
                  View All <FaArrowRight size={12} />
                </Link>
              </div>
              {stats.recentMessages.length === 0 ? (
                <div className="text-center py-8">
                  <FaEnvelope className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {stats.recentMessages.map((msg, index) => (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{msg.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{msg.subject}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{msg.email}</p>
                      </div>
                      {!msg.isRead && (
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Recent Activity Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <FaProjectDiagram className="text-blue-500 text-xl" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Projects</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{projects?.length || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total projects in portfolio</p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <FaBlog className="text-green-500 text-xl" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Blog Posts</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{blogs?.length || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total articles published</p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <FaCode className="text-purple-500 text-xl" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Skills</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{skills?.length || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Technical competencies</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;