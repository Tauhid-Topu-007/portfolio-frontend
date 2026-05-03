import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';

const Footer = () => {
  const { settings } = useContext(DataContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {settings?.siteName || 'Portfolio'}
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {settings?.siteDescription || 'Full Stack Developer & Research Enthusiast'}
            </p>
          </div>
          
          <div className="flex gap-6">
            {settings?.socialLinks?.github && (
              <a href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 transition-colors">GitHub</a>
            )}
            {settings?.socialLinks?.linkedin && (
              <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 transition-colors">LinkedIn</a>
            )}
            {settings?.socialLinks?.twitter && (
              <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 transition-colors">Twitter</a>
            )}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {currentYear} {settings?.siteName || 'Portfolio'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;