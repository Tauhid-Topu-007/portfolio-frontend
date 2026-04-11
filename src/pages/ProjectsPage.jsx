import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { FaGithub, FaExternalLinkAlt, FaSearch } from 'react-icons/fa';

const ProjectsPage = () => {
  const { projects, loading } = useContext(DataContext);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Apps' },
    { value: 'ai', label: 'AI/ML' },
    { value: 'other', label: 'Other' },
  ];

  const filteredProjects = projects?.filter(project => {
    const matchesFilter = filter === 'all' || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) ||
                          project.description.toLowerCase().includes(search.toLowerCase()) ||
                          project.technologies?.some(tech => tech.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch && project.isActive;
  });

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
        <title>Projects | Portfolio</title>
        <meta name="description" content="View my portfolio of projects and work" />
      </Helmet>

      <div className="pt-20 min-h-screen">
        <section className="py-12 bg-gradient-to-br from-primary-500/10 to-primary-700/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                My <span className="gradient-text">Projects</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Here are some of my recent works and personal projects
              </p>
            </motion.div>
          </div>
        </section>

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
                        ? 'bg-primary-500 text-white'
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
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Projects Grid */}
            <AnimatePresence>
              {filteredProjects?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg card-hover"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={project.image || 'https://via.placeholder.com/400x300'}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                        {project.featured && (
                          <span className="absolute top-2 right-2 px-2 py-1 bg-primary-500 text-white text-xs rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies?.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies?.length > 3 && (
                            <span className="text-xs text-gray-500">+{project.technologies.length - 3}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <Link
                            to={`/projects/${project._id}`}
                            className="text-primary-500 hover:text-primary-600 font-semibold"
                          >
                            View Details →
                          </Link>
                          <div className="flex gap-3">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                              >
                                <FaGithub size={20} />
                              </a>
                            )}
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                              >
                                <FaExternalLinkAlt size={18} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectsPage;