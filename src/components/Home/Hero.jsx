// src/components/Home/Hero.jsx
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { DataContext } from '../../context/DataContext';
import { getImageUrl } from '../../services/api';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaArrowDown } from 'react-icons/fa';

// Default image
const DEFAULT_IMAGE = "https://ui-avatars.com/api/?background=8B5CF6&color=fff&bold=true&name=User";

const Hero = () => {
  const { settings, loading } = useContext(DataContext);

  if (loading) return null;

  const displayName = settings?.heroSection?.title || settings?.siteName || 'Tauhidul Islam Topu';
  const profileImage = settings?.heroSection?.profileImage 
    ? getImageUrl(settings.heroSection.profileImage) 
    : DEFAULT_IMAGE;

  const socials = {
    github: settings?.socialLinks?.github,
    linkedin: settings?.socialLinks?.linkedin,
    twitter: settings?.socialLinks?.twitter,
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 relative">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="relative mb-8"
          >
            <div className="relative w-36 h-36 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-spin-slow opacity-75 blur-xl" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-1">
                <img
                  src={profileImage}
                  alt={displayName}
                  className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-900"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE;
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Name - Now showing FULL NAME */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Hi, I'm{' '}
            <br />
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent block md:inline-block">
              {displayName}
            </span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl lg:text-4xl text-gray-600 dark:text-gray-400 mb-4 h-16"
          >
            <Typewriter
              words={[
                settings?.heroSection?.subtitle || 'Full Stack Developer',
                'AI & ML Engineer',
                'Research Enthusiast',
                'Problem Solver',
              ]}
              loop={true}
              cursor
              cursorStyle='|'
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {settings?.siteDescription || 'Passionate developer creating amazing digital experiences with cutting-edge technology. Specialized in full-stack development and AI solutions.'}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a 
              href="#projects" 
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              View Projects
            </a>
            <a 
              href="#contact" 
              className="px-8 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              Contact Me
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4 mt-8"
          >
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noopener noreferrer"
                className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-xl transition-all hover:scale-110 hover:text-purple-500">
                <FaGithub size={22} />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-xl transition-all hover:scale-110 hover:text-blue-500">
                <FaLinkedin size={22} />
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noopener noreferrer"
                className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-xl transition-all hover:scale-110 hover:text-sky-500">
                <FaTwitter size={22} />
              </a>
            )}
            {settings?.contactEmail && (
              <a href={`mailto:${settings.contactEmail}`}
                className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-xl transition-all hover:scale-110 hover:text-red-500">
                <FaEnvelope size={22} />
              </a>
            )}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-gray-400 dark:text-gray-500 text-sm">Scroll Down</span>
              <FaArrowDown className="text-gray-400" />
            </motion.div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;