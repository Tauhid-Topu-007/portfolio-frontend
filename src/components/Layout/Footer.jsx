import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { DataContext } from '../../context/DataContext';

const Footer = () => {
  const { settings } = useContext(DataContext);
  const currentYear = new Date().getFullYear();

  const socialIcons = {
    github: FaGithub,
    linkedin: FaLinkedin,
    twitter: FaTwitter,
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">
              {settings?.siteName || 'Portfolio'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {settings?.siteDescription || 'Creating amazing web experiences'}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">About</Link></li>
              <li><Link to="/projects" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">Projects</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2">
              {settings?.contactEmail && (
                <li className="text-gray-600 dark:text-gray-400">{settings.contactEmail}</li>
              )}
              {settings?.contactPhone && (
                <li className="text-gray-600 dark:text-gray-400">{settings.contactPhone}</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Me</h4>
            <div className="flex space-x-4">
              {settings?.socialLinks?.github && (
                <a href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                  <FaGithub size={24} />
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                  <FaLinkedin size={24} />
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                  <FaTwitter size={24} />
                </a>
              )}
              <a href="mailto:contact@example.com" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {currentYear} {settings?.siteName || 'Portfolio'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;