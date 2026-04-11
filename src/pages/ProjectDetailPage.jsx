import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa';
import moment from 'moment';

const ProjectDetailPage = () => {
  const { id } = useParams();
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Link to="/projects" className="text-primary-500 hover:text-primary-600">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} | Portfolio</title>
        <meta name="description" content={project.description} />
      </Helmet>

      <div className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] bg-cover bg-center" style={{ backgroundImage: `url(${project.image})` }}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
              <div className="flex flex-wrap justify-center gap-2">
                {project.technologies?.map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Link to="/projects" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 mb-8">
              <FaArrowLeft /> Back to Projects
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {project.longDescription || project.description}
                  </p>
                  
                  {project.longDescription && (
                    <>
                      <h3 className="text-xl font-bold mb-3">Key Features</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <FaGithub /> View on GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Project Info</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <FaCalendar /> Category
                      </div>
                      <p className="capitalize">{project.category}</p>
                    </div>

                    {project.createdAt && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                          <FaCalendar /> Created
                        </div>
                        <p>{moment(project.createdAt).format('MMMM DD, YYYY')}</p>
                      </div>
                    )}

                    {project.featured && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                          <FaTag /> Status
                        </div>
                        <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm rounded">
                          Featured Project
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
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded"
                          >
                            {tech}
                          </span>
                        ))}
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