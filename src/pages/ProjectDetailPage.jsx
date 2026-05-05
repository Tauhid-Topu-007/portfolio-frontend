// src/pages/ProjectDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import NeuralBackground from '../components/NeuralBackground';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCalendar, FaTag, FaCheckCircle, FaHeart, FaEye, FaStar, FaCode, FaDatabase, FaServer, FaMobileAlt } from 'react-icons/fa';
import moment from 'moment';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await axios.get(`/api/projects/${id}`);
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      if (error.response?.status === 404) {
        navigate('/projects');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get icon for technology
  const getTechIcon = (tech) => {
    const techLower = tech.toLowerCase();
    if (techLower.includes('react') || techLower.includes('vue') || techLower.includes('angular')) 
      return <FaCode className="text-blue-500" />;
    if (techLower.includes('node') || techLower.includes('python') || techLower.includes('java'))
      return <FaServer className="text-green-500" />;
    if (techLower.includes('mongodb') || techLower.includes('sql') || techLower.includes('postgres'))
      return <FaDatabase className="text-yellow-500" />;
    if (techLower.includes('flutter') || techLower.includes('react native') || techLower.includes('swift'))
      return <FaMobileAlt className="text-purple-500" />;
    return <FaCode className="text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{project.title} | Portfolio</title>
        <meta name="description" content={project.description} />
      </Helmet>

      <NeuralBackground 
        density="low"
        primaryColor="#8B5CF6"
        secondaryColor="#3B82F6"
        accentColor="#EC4899"
        connectionOpacity={0.3}
        nodeSize={2.2}
        pulseSpeed={0.8}
      />

      <div className="relative z-10 pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] bg-cover bg-center" style={{ backgroundImage: `url(${project.image})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                {project.title}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-2"
              >
                {project.technologies?.map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm flex items-center gap-1">
                    {getTechIcon(tech)} {tech}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Link to="/projects" className="inline-flex items-center gap-2 text-purple-500 hover:text-pink-500 mb-8 group">
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Project Overview</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {project.longDescription || project.description}
                  </p>
                  
                  {project.longDescription && (
                    <>
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Key Features</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {project.longDescription}
                      </p>
                    </>
                  )}

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all hover:scale-105"
                      >
                        <FaGithub /> View on GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
                      >
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Project Info</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <FaTag /> Category
                      </div>
                      <p className="capitalize text-gray-900 dark:text-white font-medium">{project.category}</p>
                    </div>

                    {project.createdAt && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                          <FaCalendar /> Created
                        </div>
                        <p className="text-gray-900 dark:text-white">{moment(project.createdAt).format('MMMM DD, YYYY')}</p>
                      </div>
                    )}

                    {project.featured && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                          <FaCheckCircle /> Status
                        </div>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm rounded-full">
                          <FaStar className="text-xs" /> Featured Project
                        </span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                        <FaTag /> Technologies Used
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.map((tech, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm rounded-full"
                          >
                            {getTechIcon(tech)} {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <FaEye /> Views
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{project.views || 0}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <FaHeart /> Likes
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{project.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectDetailPage;