// src/pages/ResearchPage.jsx
import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { getImageUrl } from '../services/api';
import NeuralBackground from '../components/NeuralBackground';
import { FaSearch, FaFilePdf, FaExternalLinkAlt, FaUserFriends, FaCalendar, FaBookOpen, FaQuoteLeft, FaGraduationCap } from 'react-icons/fa';
import moment from 'moment';

const ResearchPage = () => {
  const { research, loading } = useContext(DataContext);
  const [search, setSearch] = useState('');

  const safeResearch = Array.isArray(research) ? research : [];

  const filteredResearch = safeResearch.filter(paper => {
    if (!paper) return false;
    if (!search) return true;
    return (
      (paper.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (paper.abstract || '').toLowerCase().includes(search.toLowerCase()) ||
      (paper.authors || []).some(author => (author || '').toLowerCase().includes(search.toLowerCase())) ||
      (paper.keywords || []).some(keyword => (keyword || '').toLowerCase().includes(search.toLowerCase()))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading research papers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Research | Portfolio</title>
        <meta name="description" content="View my research papers and publications" />
      </Helmet>

      <NeuralBackground 
        density="low"
        primaryColor="#8B5CF6"
        secondaryColor="#3B82F6"
        accentColor="#EC4899"
        connectionOpacity={0.3}
        nodeSize={2.2}
        pulseSpeed={0.9}
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
                <FaGraduationCap className="text-4xl text-white" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Research Papers
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto backdrop-blur-sm bg-white/40 dark:bg-gray-900/40 rounded-2xl p-5">
                Academic publications and research contributions in various fields
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
              className="max-w-md mx-auto mb-10"
            >
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search papers by title, author, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-5 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>
            </motion.div>

            {filteredResearch.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
                  <FaBookOpen className="text-5xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No research papers found.</p>
                  <button 
                    onClick={() => setSearch('')}
                    className="mt-4 text-purple-500 hover:text-pink-500"
                  >
                    Clear search →
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {filteredResearch.map((paper, index) => (
                  <motion.div
                    key={paper._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <FaFilePdf className="text-white text-3xl" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">
                          {paper.title || 'Untitled'}
                        </h2>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <FaUserFriends className="text-purple-500" /> {(paper.authors || []).slice(0, 3).join(', ')}
                            {(paper.authors || []).length > 3 && ` +${paper.authors.length - 3}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendar className="text-purple-500" /> {paper.publicationDate ? moment(paper.publicationDate).format('YYYY') : 'N/A'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          <strong className="text-purple-500">Published in:</strong> {paper.publicationVenue || 'N/A'}
                        </p>
                        
                        <div className="relative mt-3 mb-4">
                          <FaQuoteLeft className="absolute -top-2 -left-2 text-purple-300 dark:text-purple-700 text-xl" />
                          <p className="text-gray-600 dark:text-gray-400 pl-6 leading-relaxed">
                            {paper.abstract || 'No abstract available.'}
                          </p>
                        </div>
                        
                        {(paper.keywords || []).length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {paper.keywords.map((keyword, i) => (
                              <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-3">
                          {paper.doi && (
                            <a
                              href={`https://doi.org/${paper.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-purple-500 hover:text-pink-500 transition-colors"
                            >
                              DOI: {paper.doi} <FaExternalLinkAlt size={12} />
                            </a>
                          )}
                          {paper.pdfUrl && (
                            <a
                              href={getImageUrl(paper.pdfUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 text-sm"
                            >
                              <FaFilePdf /> Download PDF
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default ResearchPage;