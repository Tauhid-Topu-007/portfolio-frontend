// src/components/Admin/AdminLayout.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, FaProjectDiagram, FaBlog, FaFlask, 
  FaCode, FaBriefcase, FaGraduationCap, FaCertificate, 
  FaEnvelope, FaCog, FaBars, FaTimes, FaSignOutAlt,
  FaMoon, FaSun
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

// Default avatar from public folder
import defaultAvatar from '/images/Topu.jpg';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Check and apply theme on mount and when toggled
  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('adminTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('adminTheme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

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
    { path: '/admin/settings', label: 'Settings', icon: FaCog },
  ];

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo & User Info */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-purple-500 shadow-md bg-purple-100 dark:bg-purple-900/30">
              <img 
                src={defaultAvatar} 
                alt={user?.name || 'Admin'} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {user?.name || 'Admin'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'admin@portfolio.com'}
              </p>
            </div>
          </div>
          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">
            Administrator
          </span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} className={active ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Bottom Actions - Theme Toggle & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink0 space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            {isDarkMode ? <FaSun size={18} className="text-yellow-500" /> : <FaMoon size={18} className="text-purple-500" />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
          >
            <FaSignOutAlt size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FaBars size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <span className="font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Admin Panel
          </span>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isDarkMode ? <FaSun size={18} className="text-yellow-500" /> : <FaMoon size={18} className="text-purple-500" />}
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
          Portfolio Admin Panel &copy; {new Date().getFullYear()} | 
          <button onClick={toggleTheme} className="ml-2 text-purple-500 hover:text-purple-600 dark:text-purple-400">
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;