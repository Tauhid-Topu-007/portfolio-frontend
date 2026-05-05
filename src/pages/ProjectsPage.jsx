// src/pages/ProjectsPage.jsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { getImageUrl } from '../services/api';
import NeuralBackground from '../components/NeuralBackground';
import { FaGithub, FaExternalLinkAlt, FaSearch, FaStar } from 'react-icons/fa';

const ProjectsPage = () => {
  const { projects, loading } = useContext(DataContext);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const safeProjects = Array.isArray(projects) ? projects : [];

  const categories = [
    { value: 'all', label: 'All', icon: '🎯' },
    { value: 'web', label: 'Web Development', icon: '🌐' },
    { value: 'mobile', label: 'Mobile Apps', icon: '📱' },
    { value: 'ai', label: 'AI/ML', icon: '🤖' },
    { value: 'other', label: 'Other', icon: '💡' },
  ];

  const filteredProjects = safeProjects.filter(project => {
    const matchesFilter = filter === 'all' || project.category === filter;
    const matchesSearch = (project.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (project.description || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch && project.isActive;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Projects | Portfolio</title>
        <meta name="description" content="View my portfolio of projects and work" />
      </Helmet>

      <NeuralBackground 
        density="medium"
        primaryColor="#8B5CF6"
        secondaryColor="#3B82F6"
        accentColor="#EC4899"
        connectionOpacity={0.35}
        nodeSize={2.5}
        pulseSpeed={1.1}
      />

      <div className="relative z-10 pt-20 min-h-screen">
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg"
              >
                <FaStar className="text-4xl text-white" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                My Projects
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto backdrop-blur-sm bg-white/40 dark:bg-gray-900/40 rounded-2xl p-5">
                Here are some of my recent works and personal projects that showcase my skills
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-8 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12"
            >
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setFilter(cat.value)}
                    className={`px-5 py-2.5 rounded-full transition-all duration-300 font-medium flex items-center gap-2 ${
                      filter === cat.value
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:shadow-md hover:scale-105 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span>{cat.icon}</span> {cat.label}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-5 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition w-64 md:w-80"
                />
              </div>
            </motion.div>

            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
                  <FaSearch className="text-5xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
                  <button 
                    onClick={() => { setSearch(''); setFilter('all'); }}
                    className="mt-4 text-purple-500 hover:text-pink-500"
                  >
                    Clear filters →
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => {
                  const imageUrl = getImageUrl(project.image);
                  
                  return (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
                    >
                      <div className="relative h-52 overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              const parent = e.target.parentElement;
                              const placeholder = document.createElement('div');
                              placeholder.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30';
                              placeholder.innerHTML = '<div class="text-center"><svg class="w-12 h-12 mx-auto mb-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-xs text-gray-500">No Image</p></div>';
                              parent.appendChild(placeholder);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                            <div className="text-center">
                              <svg className="w-12 h-12 mx-auto mb-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs text-gray-500">No Image</p>
                            </div>
                          </div>
                        )}
                        {project.featured && (
                          <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full font-semibold shadow-md">
                            ⭐ Featured
                          </span>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies?.slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full">
                              {tech}
                            </span>
                          ))}
                          {project.technologies?.length > 3 && (
                            <span className="text-xs text-gray-500">+{project.technologies.length - 3}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <Link to={`/projects/${project._id}`} className="text-purple-500 hover:text-pink-500 font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                            View Details →
                          </Link>
                          <div className="flex gap-3">
                            {project.githubUrl && (
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">
                                <FaGithub size={20} />
                              </a>
                            )}
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">
                                <FaExternalLinkAlt size={18} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectsPage;