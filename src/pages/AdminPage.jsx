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

const AdminPage = () => {
  const { user, loading } = useContext(AuthContext);

  console.log('🔐 AdminPage - User:', user);
  console.log('🔐 AdminPage - Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    console.log('❌ Not authorized, redirecting to login');
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