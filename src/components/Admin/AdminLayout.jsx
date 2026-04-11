import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaProjectDiagram, 
  FaBlog, 
  FaFlask, 
  FaCode, 
  FaBriefcase, 
  FaGraduationCap, 
  FaCertificate, 
  FaEnvelope, 
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/admin/projects', label: 'Projects', icon: FaProjectDiagram },
    { path: '/admin/blogs', label: 'Blogs', icon: FaBlog },
    { path: '/admin/research', label: 'Research', icon: FaFlask },
    { path: '/admin/skills', label: 'Skills', icon: FaCode },
    { path: '/admin/experiences', label: 'Experiences', icon: FaBriefcase },
    { path: '/admin/educations', label: 'Education', icon: FaGraduationCap },
    { path: '/admin/certificates', label: 'Certificates', icon: FaCertificate },
    { path: '/admin/messages', label: 'Messages', icon: FaEnvelope },
    { path: '/admin/settings', label: 'Settings', icon: FaCog }, // Make sure this line exists
  ];

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-40 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h1 className="text-2xl font-bold gradient-text">Admin Panel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your portfolio</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <FaSignOutAlt size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        <div className="px-4 md:px-6 py-6 pb-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;