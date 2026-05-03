import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { DataContext } from '../../context/DataContext';
import { getImageUrl } from '../../services/api';

const Hero = () => {
  const { settings, loading } = useContext(DataContext);

  if (loading) return null;

  const displayName = settings?.heroSection?.title || settings?.siteName || 'Tauhidul Islam Topu';
  
  // ✅ FIXED: Get profile image from backend settings, NOT Cloudinary
  const profileImage = settings?.heroSection?.profileImage 
    ? getImageUrl(settings.heroSection.profileImage) 
    : null;

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 shadow-xl">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    const div = document.createElement('div');
                    div.className = 'w-full h-full rounded-full flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600';
                    div.textContent = displayName.charAt(0).toUpperCase();
                    parent.appendChild(div);
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            Hi, I'm{' '}
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {displayName}
            </span>
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-6 h-12"
          >
            <Typewriter
              words={[
                settings?.heroSection?.subtitle || 'Full Stack Developer',
                'AI Engineer',
                'Machine Learning Enthusiast',
                'Research Paper Writer',
              ]}
              loop={true}
              cursor
              cursorStyle='|'
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
          >
            {settings?.siteDescription || 'Passionate developer creating amazing web experiences.'}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center space-x-4"
          >
            <a href="#projects" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              View Projects
            </a>
            <a href="#contact" className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300">
              Contact Me
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;