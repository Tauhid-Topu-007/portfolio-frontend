import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { getImageUrl } from '../services/api';
import { FaGraduationCap, FaBriefcase, FaCertificate, FaDownload, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

// ✅ Default image from public folder
import defaultProfileImg from '/images/Topu.jpg';

const AboutPage = () => {
  const { settings, experiences, educations, certificates, loading } = useContext(DataContext);

  // Safety checks
  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  const safeEducations = Array.isArray(educations) ? educations : [];
  const safeCertificates = Array.isArray(certificates) ? certificates : [];

  // ✅ Get profile image from settings or use default
  const profileImage = settings?.heroSection?.profileImage 
    ? getImageUrl(settings.heroSection.profileImage) 
    : defaultProfileImg;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
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

      <div className="pt-20 min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* ✅ Profile Image */}
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 shadow-xl mb-6">
                <img
                  src={profileImage}
                  alt={settings?.heroSection?.title || 'Profile'}
                  className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProfileImg;
                  }}
                />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                About <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Me</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {settings?.siteDescription || 'Passionate developer with years of experience creating amazing web applications'}
              </p>

              {/* Contact Info */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                {settings?.contactEmail && (
                  <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                    <FaEnvelope /> {settings.contactEmail}
                  </a>
                )}
                {settings?.contactPhone && (
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FaPhone /> {settings.contactPhone}
                  </span>
                )}
                {settings?.address && (
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FaMapMarkerAlt /> {settings.address}
                  </span>
                )}
              </div>

              {/* Resume Download */}
              {settings?.heroSection?.resumeUrl && (
                <a
                  href={settings.heroSection.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <FaDownload /> Download Resume
                </a>
              )}
            </motion.div>
          </div>
        </section>

        {/* Education Section */}
        {safeEducations.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-8"
              >
                <FaGraduationCap className="text-3xl text-blue-500" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Education</h2>
              </motion.div>
              <div className="space-y-6">
                {safeEducations.map((edu) => (
                  <motion.div
                    key={edu._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-blue-500"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{edu.degree} in {edu.field}</h3>
                    <p className="text-blue-500 font-medium">{edu.institution}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {new Date(edu.startDate).getFullYear()} - {edu.isCurrent ? 'Present' : new Date(edu.endDate).getFullYear()}
                    </p>
                    {edu.grade && <p className="text-gray-600 dark:text-gray-400 mt-2">Grade: {edu.grade}</p>}
                    {edu.description && <p className="text-gray-600 dark:text-gray-400 mt-2">{edu.description}</p>}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {safeExperiences.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-8"
              >
                <FaBriefcase className="text-3xl text-purple-500" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Experience</h2>
              </motion.div>
              <div className="space-y-6">
                {safeExperiences.map((exp) => (
                  <motion.div
                    key={exp._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-purple-500"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.position}</h3>
                    <p className="text-purple-500 font-medium">{exp.company}</p>
                    {exp.location && <p className="text-gray-500 text-sm">{exp.location}</p>}
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                      {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-3">{exp.description}</p>
                    {exp.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {exp.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                            {tech}
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
          <section className="py-16">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-8"
              >
                <FaCertificate className="text-3xl text-green-500" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Certificates</h2>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeCertificates.map((cert) => (
                  <motion.div
                    key={cert._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow"
                  >
                    <FaCertificate className="text-4xl text-green-500 mx-auto mb-3" />
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{cert.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{cert.issuer}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </p>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
                      >
                        View Credential →
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
            <p className="text-gray-500 dark:text-gray-400">No information added yet.</p>
          </section>
        )}
      </div>
    </>
  );
};

export default AboutPage;