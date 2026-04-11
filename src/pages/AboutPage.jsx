import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import Timeline from '../components/Education/Timeline';
import ExperienceCard from '../components/Experience/ExperienceCard';
import CertificateCard from '../components/Certificates/CertificateCard';
import { FaGraduationCap, FaBriefcase, FaCertificate } from 'react-icons/fa';

const AboutPage = () => {
  const { experiences, educations, certificates, loading } = useContext(DataContext);
  const { user } = useContext(AuthContext);

  const sections = [
    { id: 'education', title: 'Education', icon: FaGraduationCap, data: educations },
    { id: 'experience', title: 'Experience', icon: FaBriefcase, data: experiences },
    { id: 'certificates', title: 'Certificates', icon: FaCertificate, data: certificates },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>About Me | Portfolio</title>
        <meta name="description" content="Learn more about my background, education, and experience" />
      </Helmet>

      <div className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-primary-500/10 to-primary-700/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                About <span className="gradient-text">Me</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {user?.bio || 'Passionate developer with years of experience creating amazing web applications'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Sections */}
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="py-16">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-2">
                  <section.icon className="text-3xl text-primary-500" />
                  <h2 className="text-3xl font-bold">{section.title}</h2>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full" />
              </motion.div>

              {section.id === 'education' && <Timeline items={section.data} />}
              {section.id === 'experience' && (
                <div className="grid grid-cols-1 gap-6">
                  {section.data?.map((item, idx) => (
                    <ExperienceCard key={item._id} experience={item} index={idx} />
                  ))}
                </div>
              )}
              {section.id === 'certificates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.data?.map((cert, idx) => (
                    <CertificateCard key={cert._id} certificate={cert} index={idx} />
                  ))}
                </div>
              )}

              {(!section.data || section.data.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No {section.title.toLowerCase()} added yet.
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </>
  );
};

export default AboutPage;