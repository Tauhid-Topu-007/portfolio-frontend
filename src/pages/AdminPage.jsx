// src/pages/AdminPage.jsx
import React, { useContext } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../components/Admin/AdminLayout';
import AdminDashboard from '../components/Admin/AdminDashboard';
import ProjectManager from '../components/Admin/ProjectManager';
import BlogManager from '../components/Admin/BlogManager';
import ResearchManager from '../components/Admin/ResearchManager';
import SkillManager from '../components/Admin/SkillManager';
import ExperienceManager from '../components/Admin/ExperienceManager';
import EducationManager from '../components/Admin/EducationManager';
import CertificateManager from '../components/Admin/CertificateManager';
import MessageManager from '../components/Admin/MessageManager';
import SettingsManager from '../components/Admin/SettingsManager';
import { FaSpinner } from 'react-icons/fa';

const AdminPage = () => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/projects" element={<ProjectManager />} />
        <Route path="/blogs" element={<BlogManager />} />
        <Route path="/research" element={<ResearchManager />} />
        <Route path="/skills" element={<SkillManager />} />
        <Route path="/experiences" element={<ExperienceManager />} />
        <Route path="/educations" element={<EducationManager />} />
        <Route path="/certificates" element={<CertificateManager />} />
        <Route path="/messages" element={<MessageManager />} />
        <Route path="/settings" element={<SettingsManager />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPage;