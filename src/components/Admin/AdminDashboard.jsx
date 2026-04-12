import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { 
  FaProjectDiagram, 
  FaBlog, 
  FaFlask, 
  FaCode, 
  FaEnvelope,
  FaEye,
  FaHeart,
  FaCertificate,
  FaBriefcase,
  FaGraduationCap
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { projects, blogs, research, skills, certificates, experiences, educations, loading } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ totalViews: 0, totalLikes: 0 });

  // Helper function to safely get data as array
  const asArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') return Object.values(data);
    return [];
  };

  // Get safe arrays
  const safeProjects = asArray(projects);
  const safeBlogs = asArray(blogs);
  const safeResearch = asArray(research);
  const safeSkills = asArray(skills);
  const safeCertificates = asArray(certificates);
  const safeExperiences = asArray(experiences);
  const safeEducations = asArray(educations);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get('/api/messages');
      setMessages(asArray(data));
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/blogs');
      const blogData = asArray(data);
      
      let totalViews = 0;
      let totalLikes = 0;
      
      for (let i = 0; i < blogData.length; i++) {
        totalViews += blogData[i]?.views || 0;
        totalLikes += blogData[i]?.likes || 0;
      }
      
      setStats({ totalViews, totalLikes });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ totalViews: 0, totalLikes: 0 });
    }
  };

  // Calculate counts safely
  const projectsCount = safeProjects.length;
  const blogsCount = safeBlogs.length;
  const researchCount = safeResearch.length;
  const skillsCount = safeSkills.length;
  const certificatesCount = safeCertificates.length;
  const experiencesCount = safeExperiences.length;
  const educationsCount = safeEducations.length;
  const messagesCount = messages.length;
  
  // Calculate filtered counts safely
  let unreadMessages = 0;
  for (let i = 0; i < messages.length; i++) {
    if (messages[i]?.isRead === false) unreadMessages++;
  }
  
  let unpublishedBlogs = 0;
  for (let i = 0; i < safeBlogs.length; i++) {
    if (safeBlogs[i]?.isPublished === false) unpublishedBlogs++;
  }

  const statCards = [
    { title: 'Projects', value: projectsCount, icon: FaProjectDiagram, color: 'bg-blue-500', link: '/admin/projects' },
    { title: 'Blog Posts', value: blogsCount, icon: FaBlog, color: 'bg-green-500', link: '/admin/blogs' },
    { title: 'Research Papers', value: researchCount, icon: FaFlask, color: 'bg-purple-500', link: '/admin/research' },
    { title: 'Skills', value: skillsCount, icon: FaCode, color: 'bg-yellow-500', link: '/admin/skills' },
    { title: 'Certificates', value: certificatesCount, icon: FaCertificate, color: 'bg-pink-500', link: '/admin/certificates' },
    { title: 'Experiences', value: experiencesCount, icon: FaBriefcase, color: 'bg-indigo-500', link: '/admin/experiences' },
    { title: 'Education', value: educationsCount, icon: FaGraduationCap, color: 'bg-teal-500', link: '/admin/educations' },
    { title: 'Messages', value: messagesCount, icon: FaEnvelope, color: 'bg-red-500', link: '/admin/messages' },
    { title: 'Total Views', value: stats.totalViews, icon: FaEye, color: 'bg-indigo-500', link: '/admin/blogs' },
    { title: 'Total Likes', value: stats.totalLikes, icon: FaHeart, color: 'bg-orange-500', link: '/admin/blogs' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.name || 'Admin'}!
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {unreadMessages > 0 && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm">
              {unreadMessages} Unread Messages
            </div>
          )}
          {unpublishedBlogs > 0 && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-sm">
              {unpublishedBlogs} Draft Blogs
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <a href={stat.link} className="block p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                    <Icon className="text-white text-xl" />
                  </div>
                </div>
              </a>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Messages */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Messages</h2>
          <a href="/admin/messages" className="text-primary-500 hover:text-primary-600 text-sm">
            View All →
          </a>
        </div>
        <div className="space-y-4">
          {messagesCount > 0 ? (
            messages.slice(0, 5).map((message) => (
              <div key={message._id} className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{message.name}</h3>
                    {!message.isRead && (
                      <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">
                        New
                      </span>
                    )}
                    {message.isReplied && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                        Replied
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{message.subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={`/admin/messages`}
                  className="text-primary-500 hover:text-primary-600 text-sm ml-4"
                >
                  View →
                </a>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No messages yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;