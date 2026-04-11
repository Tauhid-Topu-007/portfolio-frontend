import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
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
  FaChartLine
} from 'react-icons/fa';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { projects, blogs, skills, loading } = useContext(DataContext);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    unreadMessages: 0,
    totalMessages: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
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
        totalMessages: messagesRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { title: 'Projects', value: projects?.length || 0, icon: FaProjectDiagram, color: 'bg-blue-500', link: '/admin/projects' },
    { title: 'Blog Posts', value: blogs?.length || 0, icon: FaBlog, color: 'bg-green-500', link: '/admin/blogs' },
    { title: 'Skills', value: skills?.length || 0, icon: FaCode, color: 'bg-purple-500', link: '/admin/skills' },
    { title: 'Messages', value: stats.totalMessages, icon: FaEnvelope, color: 'bg-yellow-500', link: '/admin/messages' },
    { title: 'Unread Messages', value: stats.unreadMessages, icon: FaEnvelope, color: 'bg-red-500', link: '/admin/messages' },
    { title: 'Total Views', value: stats.totalViews, icon: FaEye, color: 'bg-indigo-500', link: '/admin/blogs' },
    { title: 'Total Likes', value: stats.totalLikes, icon: FaHeart, color: 'bg-pink-500', link: '/admin/blogs' },
  ];

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
        <title>Dashboard | Portfolio</title>
      </Helmet>

      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome back, <span className="gradient-text">{user?.name || 'User'}!</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Here's what's happening with your portfolio today.
            </p>
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
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <Link to={stat.link} className="block">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-full`}>
                        <Icon className="text-white text-xl" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/admin/projects" className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <FaProjectDiagram className="text-2xl mx-auto mb-2 text-blue-500" />
                <span>Add Project</span>
              </Link>
              <Link to="/admin/blogs" className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <FaBlog className="text-2xl mx-auto mb-2 text-green-500" />
                <span>Write Blog</span>
              </Link>
              <Link to="/admin/skills" className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <FaCode className="text-2xl mx-auto mb-2 text-purple-500" />
                <span>Add Skill</span>
              </Link>
              <Link to="/admin/messages" className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <FaEnvelope className="text-2xl mx-auto mb-2 text-yellow-500" />
                <span>View Messages</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;