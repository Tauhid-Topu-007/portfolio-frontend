import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { FaSearch, FaFilePdf, FaExternalLinkAlt, FaUserFriends, FaCalendar } from 'react-icons/fa';
import moment from 'moment';

const ResearchPage = () => {
  const { research, loading } = useContext(DataContext);
  const [search, setSearch] = useState('');

  // SAFE: Ensure research is an array
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Research | Portfolio</title>
        <meta name="description" content="View my research papers and publications" />
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
                Research <span className="gradient-text">Papers</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Academic publications and research contributions
              </p>
            </motion.div>
          </div>
        </section>

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
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    key={paper?._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg card-hover"
                  >
                    <h2 className="text-2xl font-bold mb-2">{paper?.title || 'Untitled'}</h2>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <FaUserFriends /> {(paper?.authors || []).slice(0, 3).join(', ')}
                        {(paper?.authors || []).length > 3 && ` +${paper.authors.length - 3}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendar /> {paper?.publicationDate ? moment(paper.publicationDate).format('YYYY') : 'N/A'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      <strong>Published in:</strong> {paper?.publicationVenue || 'N/A'}
                    </p>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {paper?.abstract || 'No abstract available.'}
                    </p>
                    
                    {(paper?.keywords || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(paper?.keywords || []).map((keyword, i) => (
                          <span key={i} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-3">
                      {paper?.doi && (
                        <a
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600"
                        >
                          DOI: {paper.doi} <FaExternalLinkAlt size={12} />
                        </a>
                      )}
                      {paper?.pdfUrl && (
                        <a
                          href={paper.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600"
                        >
                          <FaFilePdf /> Download PDF
                        </a>
                      )}
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