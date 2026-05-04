import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { getImageUrl } from '../services/api';
import { FaSearch, FaFilePdf, FaExternalLinkAlt, FaUserFriends, FaCalendar } from 'react-icons/fa';
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Research | Portfolio</title>
        <meta name="description" content="View my research papers and publications" />
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
                Research <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Papers</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Academic publications and research contributions
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Search */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search research papers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Research Papers */}
            {filteredResearch.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No research papers found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredResearch.map((paper, index) => (
                  <motion.div
                    key={paper._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg card-hover"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* ✅ Paper Image/Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <FaFilePdf className="text-white text-3xl" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                          {paper.title || 'Untitled'}
                        </h2>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <FaUserFriends /> {(paper.authors || []).slice(0, 3).join(', ')}
                            {(paper.authors || []).length > 3 && ` +${paper.authors.length - 3}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendar /> {paper.publicationDate ? moment(paper.publicationDate).format('YYYY') : 'N/A'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          <strong>Published in:</strong> {paper.publicationVenue || 'N/A'}
                        </p>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {paper.abstract || 'No abstract available.'}
                        </p>
                        
                        {(paper.keywords || []).length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {paper.keywords.map((keyword, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
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
                              className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600"
                            >
                              DOI: {paper.doi} <FaExternalLinkAlt size={12} />
                            </a>
                          )}
                          {paper.pdfUrl && (
                            <a
                              href={getImageUrl(paper.pdfUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
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