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
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const { projects, blogs, research, skills, certificates, experiences, educations, loading } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0
  });

  // SAFETY: Ensure all data is array
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeBlogs = Array.isArray(blogs) ? blogs : [];
  const safeResearch = Array.isArray(research) ? research : [];
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeCertificates = Array.isArray(certificates) ? certificates : [];
  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  const safeEducations = Array.isArray(educations) ? educations : [];

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get('/api/messages');
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/blogs');
      const blogData = Array.isArray(data) ? data : [];
      
      // SAFETY: Use reduce only on array
      const totalViews = blogData.length > 0 
        ? blogData.reduce((sum, blog) => sum + (blog?.views || 0), 0)
        : 0;
      
      const totalLikes = blogData.length > 0 
        ? blogData.reduce((sum, blog) => sum + (blog?.likes || 0), 0)
        : 0;
      
      setStats({ totalViews, totalLikes });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ totalViews: 0, totalLikes: 0 });
    }
  };

  const statCards = [
    { title: 'Projects', value: safeProjects.length, icon: FaProjectDiagram, color: 'bg-blue-500', link: '/admin/projects' },
    { title: 'Blog Posts', value: safeBlogs.length, icon: FaBlog, color: 'bg-green-500', link: '/admin/blogs' },
    { title: 'Research Papers', value: safeResearch.length, icon: FaFlask, color: 'bg-purple-500', link: '/admin/research' },
    { title: 'Skills', value: safeSkills.length, icon: FaCode, color: 'bg-yellow-500', link: '/admin/skills' },
    { title: 'Certificates', value: safeCertificates.length, icon: FaCertificate, color: 'bg-pink-500', link: '/admin/certificates' },
    { title: 'Experiences', value: safeExperiences.length, icon: FaBriefcase, color: 'bg-indigo-500', link: '/admin/experiences' },
    { title: 'Education', value: safeEducations.length, icon: FaGraduationCap, color: 'bg-teal-500', link: '/admin/educations' },
    { title: 'Messages', value: messages.length, icon: FaEnvelope, color: 'bg-red-500', link: '/admin/messages' },
    { title: 'Total Views', value: stats.totalViews, icon: FaEye, color: 'bg-indigo-500', link: '/admin/blogs' },
    { title: 'Total Likes', value: stats.totalLikes, icon: FaHeart, color: 'bg-orange-500', link: '/admin/blogs' },
  ];

  // SAFETY: Filter only on arrays
  const unreadMessages = messages.filter(m => m?.isRead === false).length;
  const unpublishedBlogs = safeBlogs.filter(b => b?.isPublished === false).length;

  // Chart Data
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Blog Views',
        data: [65, 59, 80, 81, 56, 55, 40, 70, 85, 90, 95, 100],
        fill: true,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Blog Likes',
        data: [28, 48, 40, 19, 86, 27, 90, 45, 70, 65, 80, 85],
        fill: true,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blog Analytics Overview',
      },
    },
  };

  const categoryData = {
    labels: ['Web', 'Mobile', 'AI/ML', 'Other'],
    datasets: [
      {
        label: 'Projects by Category',
        data: [
          safeProjects.filter(p => p?.category === 'web').length,
          safeProjects.filter(p => p?.category === 'mobile').length,
          safeProjects.filter(p => p?.category === 'ai').length,
          safeProjects.filter(p => p?.category === 'other').length,
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Projects by Category',
      },
    },
  };

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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Blog Analytics</h2>
          <div className="h-80">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Projects Distribution</h2>
          <div className="h-80">
            <Bar data={categoryData} options={barOptions} />
          </div>
        </div>
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
          {messages.length > 0 ? (
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