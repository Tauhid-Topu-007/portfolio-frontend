// src/components/Home/Projects.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DataContext } from '../../context/DataContext';
import { getImageUrl } from '../../services/api';
import { FaGithub, FaExternalLinkAlt, FaStar } from 'react-icons/fa';

const Projects = () => {
  const { projects, loading } = useContext(DataContext);

  if (loading) return null;

  const activeProjects = projects?.filter(p => p.isActive) || [];
  const featuredProjects = activeProjects.filter(p => p.featured);
  const otherProjects = activeProjects.filter(p => !p.featured);
  const displayProjects = [...featuredProjects, ...otherProjects].slice(0, 6);

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 shadow-lg"
          >
            <FaStar className="text-2xl text-white" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Some of my best work that showcases my skills and creativity
          </p>
        </motion.div>

        {displayProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
              <p className="text-gray-500 dark:text-gray-400">No projects added yet.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={getImageUrl(project.image) || 'https://placehold.co/600x400/8B5CF6/white?text=Project'}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x400/8B5CF6/white?text=Project';
                    }}
                  />
                  {project.featured && (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full font-semibold shadow-md flex items-center gap-1">
                      <FaStar className="text-xs" /> Featured
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
                      Learn More →
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
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/projects" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;