import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { 
  FaProjectDiagram, FaBlog, FaFlask, FaCode, FaEnvelope,
  FaEye, FaHeart, FaCertificate, FaBriefcase, FaGraduationCap
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { projects, blogs, research, skills, certificates, experiences, educations, loading } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ totalViews: 0, totalLikes: 0 });

  // SAFETY: Ensure all data is array with fallbacks
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
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/blogs');
      const blogData = Array.isArray(data) ? data : [];
      let totalViews = 0, totalLikes = 0;
      for (let i = 0; i < blogData.length; i++) {
        totalViews += blogData[i]?.views || 0;
        totalLikes += blogData[i]?.likes || 0;
      }
      setStats({ totalViews, totalLikes });
    } catch (err) {
      console.error('Error fetching stats:', err);
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

  // Calculate unread messages safely
  let unreadMessages = 0;
  for (let i = 0; i < messages.length; i++) {
    if (messages[i]?.isRead === false) unreadMessages++;
  }

  // Calculate unpublished blogs safely
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
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.name || 'Admin'}!</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <a key={stat.title} href={stat.link} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow block">
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
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Messages</h2>
          <a href="/admin/messages" className="text-primary-500 hover:text-primary-600 text-sm">View All →</a>
        </div>
        {messages.length > 0 ? (
          messages.slice(0, 5).map((message) => (
            <div key={message._id} className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{message.name}</h3>
                  {!message.isRead && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">New</span>}
                  {message.isReplied && <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">Replied</span>}
                </div>
                <p className="text-sm text-gray-600">{message.subject}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(message.createdAt).toLocaleDateString()}</p>
              </div>
              <a href="/admin/messages" className="text-primary-500 text-sm ml-4">View →</a>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No messages yet</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;