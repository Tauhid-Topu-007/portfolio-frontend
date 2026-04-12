import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';

const Hero = () => {
  const { settings, loading } = useContext(DataContext);
  const { user } = useContext(AuthContext);

  if (loading) return null;

  // Get profile image - use Cloudinary URL or fallback
  let profileImage = 'https://res.cloudinary.com/dhjnfh1mi/image/upload/v1/portfolio/default-profile';
  
  if (settings?.heroSection?.profileImage) {
    profileImage = settings.heroSection.profileImage;
  }

  return (
    <section className="min-h-screen flex items-center justify-center pt-16">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-primary-700 p-1">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://res.cloudinary.com/dhjnfh1mi/image/upload/v1/portfolio/default-profile';
                }}
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            Hi, I'm{' '}
            <span className="gradient-text">{user?.name || settings?.siteName || 'Developer'}</span>
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-6"
          >
            <Typewriter
              words={[
                user?.title || settings?.heroSection?.title || 'Full Stack Developer',
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
            {user?.bio || settings?.siteDescription || 'Passionate developer creating amazing web experiences.'}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center space-x-4"
          >
            <a href="#projects" className="btn-primary">
              View Projects
            </a>
            <a href="#contact" className="btn-secondary">
              Contact Me
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;