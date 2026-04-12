import React, { useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/messages');
      const data = response.data;
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data.data && Array.isArray(data.data)) {
          setMessages(data.data);
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/blogs');
      const data = response.data;
      let blogArray = [];
      
      if (Array.isArray(data)) {
        blogArray = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        blogArray = data.data;
      }
      
      let views = 0;
      let likes = 0;
      for (let i = 0; i < blogArray.length; i++) {
        const item = blogArray[i];
        if (item) {
          views += item.views || 0;
          likes += item.likes || 0;
        }
      }
      setStats({ totalViews: views, totalLikes: likes });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ totalViews: 0, totalLikes: 0 });
    }
  };

  // Safe count functions
  const getCount = (data) => {
    if (!data) return 0;
    if (Array.isArray(data)) return data.length;
    if (data.data && Array.isArray(data.data)) return data.data.length;
    return 0;
  };

  const projectsCount = getCount(projects);
  const blogsCount = getCount(blogs);
  const researchCount = getCount(research);
  const skillsCount = getCount(skills);
  const certificatesCount = getCount(certificates);
  const experiencesCount = getCount(experiences);
  const educationsCount = getCount(educations);
  const messagesCount = getCount(messages);

  // Safe unread messages count
  let unreadMessages = 0;
  if (messages && Array.isArray(messages)) {
    for (let i = 0; i < messages.length; i++) {
      if (messages[i] && messages[i].isRead === false) {
        unreadMessages++;
      }
    }
  }

  // Safe unpublished blogs count
  let unpublishedBlogs = 0;
  const blogsArray = Array.isArray(blogs) ? blogs : (blogs?.data || []);
  for (let i = 0; i < blogsArray.length; i++) {
    if (blogsArray[i] && blogsArray[i].isPublished === false) {
      unpublishedBlogs++;
    }
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '4px solid #e2e8f0', 
          borderTop: '4px solid #6366f1', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#666', marginTop: '4px' }}>Welcome back, {user?.name || 'Admin'}!</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {unreadMessages > 0 && (
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '9999px', fontSize: '14px' }}>
              {unreadMessages} Unread Messages
            </div>
          )}
          {unpublishedBlogs > 0 && (
            <div style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '9999px', fontSize: '14px' }}>
              {unpublishedBlogs} Draft Blogs
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <a 
              key={stat.title}
              href={stat.link}
              style={{ 
                backgroundColor: '#fff', 
                borderRadius: '12px', 
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textDecoration: 'none',
                display: 'block',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{stat.title}</p>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0 0 0' }}>{stat.value}</p>
                </div>
                <div style={{ backgroundColor: stat.color, width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ color: '#fff', fontSize: '24px' }} />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Recent Messages</h2>
          <a href="/admin/messages" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '14px' }}>View All →</a>
        </div>
        {messagesCount > 0 ? (
          messages.slice(0, 5).map((message) => (
            <div key={message._id} style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <strong>{message.name}</strong>
                  {!message.isRead && (
                    <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px' }}>New</span>
                  )}
                  {message.isReplied && (
                    <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px' }}>Replied</span>
                  )}
                </div>
                <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>{message.subject}</p>
                <p style={{ margin: '4px 0', color: '#999', fontSize: '12px' }}>{new Date(message.createdAt).toLocaleDateString()}</p>
              </div>
              <a href="/admin/messages" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '14px' }}>View →</a>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#666', padding: '32px' }}>No messages yet</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;