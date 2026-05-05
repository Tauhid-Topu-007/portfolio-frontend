// src/pages/AboutPage.jsx
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { getImageUrl } from '../services/api';
import NeuralBackground from '../components/NeuralBackground';
import { FaGraduationCap, FaBriefcase, FaCertificate, FaDownload, FaMapMarkerAlt, FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaHeart, FaCode, FaRocket, FaLaptopCode } from 'react-icons/fa';

import defaultProfileImg from '/images/Topu.jpg';

const AboutPage = () => {
  const { settings, experiences, educations, certificates, projects, loading, socialLinks } = useContext(DataContext);

  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  const safeEducations = Array.isArray(educations) ? educations : [];
  const safeCertificates = Array.isArray(certificates) ? certificates : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  const profileImage = settings?.heroSection?.profileImage 
    ? getImageUrl(settings.heroSection.profileImage) 
    : defaultProfileImg;

  const socials = {
    github: socialLinks?.github || settings?.socialLinks?.github,
    linkedin: socialLinks?.linkedin || settings?.socialLinks?.linkedin,
    twitter: socialLinks?.twitter || settings?.socialLinks?.twitter,
  };

  // Calculate total experience years from experiences
  const calculateTotalExperience = () => {
    let totalYears = 0;
    safeExperiences.forEach(exp => {
      const start = new Date(exp.startDate);
      const end = exp.isCurrent ? new Date() : new Date(exp.endDate);
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      totalYears += years;
    });
    return Math.floor(totalYears) || 2; // Default to 2 if no experiences
  };

  // Stats for visual interest
  const stats = [
    { icon: FaLaptopCode, value: safeProjects.length || 0, label: 'Projects Completed', suffix: '+' },
    { icon: FaCode, value: calculateTotalExperience(), label: 'Years Experience', suffix: '+' },
    { icon: FaHeart, value: safeCertificates.length || 0, label: 'Certifications', suffix: '' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>About Me | {settings?.siteName || 'Portfolio'}</title>
        <meta name="description" content={settings?.siteDescription || 'Learn more about me and my journey'} />
      </Helmet>

      {/* Beautiful Dynamic Neural Background */}
      <NeuralBackground 
        density="medium"
        primaryColor="#8B5CF6"
        secondaryColor="#3B82F6"
        accentColor="#EC4899"
        connectionOpacity={0.4}
        nodeSize={2.8}
        pulseSpeed={1.3}
      />

      <div className="relative z-10 pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
                className="relative w-40 h-40 mx-auto mb-8"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-spin-slow opacity-75 blur-xl" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-1">
                  <img
                    src={profileImage}
                    alt={settings?.heroSection?.title || 'Profile'}
                    className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-900"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultProfileImg;
                    }}
                  />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent"
              >
                About Me
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto backdrop-blur-sm bg-white/40 dark:bg-gray-900/40 rounded-2xl p-5 shadow-lg"
              >
                {settings?.heroSection?.subtitle || 'Passionate developer creating amazing digital experiences with cutting-edge technology'}
              </motion.p>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-wrap justify-center gap-6 mt-8"
              >
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-2xl px-6 py-3 shadow-lg border border-white/20">
                    <stat.icon className="text-3xl text-purple-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}{stat.suffix}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4 mt-8"
              >
                {settings?.contactEmail && (
                  <a href={`mailto:${settings.contactEmail}`} className="group flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-purple-200 dark:border-purple-800">
                    <FaEnvelope className="text-purple-500 group-hover:text-pink-500 transition-colors" />
                    <span className="text-gray-700 dark:text-gray-300">{settings.contactEmail}</span>
                  </a>
                )}
                {settings?.contactPhone && (
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg">
                    <FaPhone className="text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">{settings.contactPhone}</span>
                  </div>
                )}
                {settings?.address && (
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span className="text-gray-700 dark:text-gray-300">{settings.address}</span>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex justify-center gap-4 mt-6"
              >
                {socials.github && (
                  <a href={socials.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 hover:text-purple-500">
                    <FaGithub size={22} />
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 hover:text-blue-500">
                    <FaLinkedin size={22} />
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 hover:text-sky-500">
                    <FaTwitter size={22} />
                  </a>
                )}
              </motion.div>

              {settings?.heroSection?.resumeUrl && (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  href={settings.heroSection.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <FaDownload /> Download Resume
                </motion.a>
              )}
            </motion.div>
          </div>
        </section>

        {/* Education Section */}
        {safeEducations.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <FaGraduationCap className="text-2xl text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Education</h2>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {safeEducations.map((edu, index) => (
                  <motion.div
                    key={edu._id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
                  >
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{edu.degree} in {edu.field}</h3>
                    <p className="text-purple-500 font-semibold mb-2">{edu.institution}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                      {new Date(edu.startDate).getFullYear()} - {edu.isCurrent ? 'Present' : new Date(edu.endDate).getFullYear()}
                    </p>
                    {edu.grade && (
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400">
                        🎓 Grade: {edu.grade}
                      </span>
                    )}
                    {edu.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-3">{edu.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {safeExperiences.length > 0 && (
          <section className="py-12 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <FaBriefcase className="text-2xl text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Work Experience</h2>
              </motion.div>
              
              <div className="space-y-6">
                {safeExperiences.map((exp, index) => (
                  <motion.div
                    key={exp._id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-l-purple-500 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex flex-wrap justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.position}</h3>
                        <p className="text-purple-500 font-semibold">{exp.company}</p>
                        {exp.location && <p className="text-gray-500 text-sm">📍 {exp.location}</p>}
                      </div>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium text-purple-600 dark:text-purple-400">
                        📅 {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                        {exp.isCurrent ? ' Present' : new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-3">{exp.description}</p>
                    {exp.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.technologies.map((tech, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                            💻 {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Certificates Section */}
        {safeCertificates.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                  <FaCertificate className="text-2xl text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Certifications</h2>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeCertificates.map((cert, index) => (
                  <motion.div
                    key={cert._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] text-center border border-gray-200 dark:border-gray-700"
                  >
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FaCertificate className="text-3xl text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{cert.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{cert.issuer}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      📅 {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </p>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-green-500 hover:text-green-600 text-sm font-medium"
                      >
                        🔗 View Credential →
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {safeEducations.length === 0 && safeExperiences.length === 0 && safeCertificates.length === 0 && (
          <section className="py-16 text-center">
            <div className="container mx-auto px-4">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-xl">
                <FaGlobe className="text-5xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No information added yet.</p>
              </div>
            </div>
          </section>
        )}
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
    </>
  );
};

export default AboutPage;