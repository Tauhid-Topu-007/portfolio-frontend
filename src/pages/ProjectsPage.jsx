import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { getImageUrl } from '../services/api';
import { FaGithub, FaExternalLinkAlt, FaSearch } from 'react-icons/fa';

const ProjectsPage = () => {
  const { projects, loading } = useContext(DataContext);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const safeProjects = Array.isArray(projects) ? projects : [];

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Apps' },
    { value: 'ai', label: 'AI/ML' },
    { value: 'other', label: 'Other' },
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Projects | Portfolio</title>
        <meta name="description" content="View my portfolio of projects and work" />
      </Helmet>

      <div className="pt-20 min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                My <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Projects</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Here are some of my recent works and personal projects
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setFilter(cat.value)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      filter === cat.value
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => {
                  const imageUrl = getImageUrl(project.image);
                  
                  return (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg card-hover"
                    >
                      {/* ✅ Project Image with cache-busting */}
                      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600">
                                  <div class="text-center text-gray-400">
                                    <svg class="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <p class="text-xs">No Image</p>
                                  </div>
                                </div>
                              `;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600">
                            <div className="text-center text-gray-400">
                              <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs">No Image</p>
                            </div>
                          </div>
                        )}
                        {project.featured && (
                          <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-400 text-gray-900 text-xs rounded-full font-semibold">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies?.slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                          {project.technologies?.length > 3 && (
                            <span className="text-xs text-gray-500">+{project.technologies.length - 3}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <Link to={`/projects/${project._id}`} className="text-blue-500 hover:text-blue-600 font-semibold">
                            View Details →
                          </Link>
                          <div className="flex gap-3">
                            {project.githubUrl && (
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
                                <FaGithub size={20} />
                              </a>
                            )}
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
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