import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Stats = ({ stats, loading }) => {
  const statCards = [
    { title: 'Total Projects', value: stats.totalProjects || 0, icon: '📁', color: 'bg-blue-500', link: '/admin/projects' },
    { title: 'Blog Posts', value: stats.totalBlogs || 0, icon: '📝', color: 'bg-green-500', link: '/admin/blogs' },
    { title: 'Research Papers', value: stats.totalResearch || 0, icon: '🔬', color: 'bg-purple-500', link: '/admin/research' },
    { title: 'Skills', value: stats.totalSkills || 0, icon: '💻', color: 'bg-yellow-500', link: '/admin/skills' },
    { title: 'Messages', value: stats.totalMessages || 0, icon: '✉️', color: 'bg-red-500', link: '/admin/messages' },
    { title: 'Unread Messages', value: stats.unreadMessages || 0, icon: '📬', color: 'bg-orange-500', link: '/admin/messages' },
    { title: 'Total Views', value: stats.totalViews || 0, icon: '👁️', color: 'bg-indigo-500', link: '/admin/blogs' },
    { title: 'Total Likes', value: stats.totalLikes || 0, icon: '❤️', color: 'bg-pink-500', link: '/admin/blogs' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <Link to={stat.link} className="block p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default Stats;