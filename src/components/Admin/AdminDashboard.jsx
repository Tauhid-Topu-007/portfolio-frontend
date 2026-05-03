import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  FaProjectDiagram, FaBlog, FaFlask, FaCode, FaEnvelope,
  FaCertificate, FaBriefcase, FaGraduationCap 
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { projects, blogs, research, skills, certificates, experiences, educations, loading } = useContext(DataContext);
  const { user } = useContext(AuthContext);

  console.log('📊 Dashboard Data:', { projects, blogs, skills });

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeBlogs = Array.isArray(blogs) ? blogs : [];
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeCertificates = Array.isArray(certificates) ? certificates : [];
  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  const safeEducations = Array.isArray(educations) ? educations : [];
  const safeResearch = Array.isArray(research) ? research : [];

  const statCards = [
    { title: 'Projects', value: safeProjects.length, icon: FaProjectDiagram, color: 'bg-blue-500', link: '/admin/projects' },
    { title: 'Blogs', value: safeBlogs.length, icon: FaBlog, color: 'bg-green-500', link: '/admin/blogs' },
    { title: 'Research', value: safeResearch.length, icon: FaFlask, color: 'bg-purple-500', link: '/admin/research' },
    { title: 'Skills', value: safeSkills.length, icon: FaCode, color: 'bg-yellow-500', link: '/admin/skills' },
    { title: 'Experiences', value: safeExperiences.length, icon: FaBriefcase, color: 'bg-indigo-500', link: '/admin/experiences' },
    { title: 'Education', value: safeEducations.length, icon: FaGraduationCap, color: 'bg-teal-500', link: '/admin/educations' },
    { title: 'Certificates', value: safeCertificates.length, icon: FaCertificate, color: 'bg-pink-500', link: '/admin/certificates' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, {user?.name || 'Admin'}!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.link}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;