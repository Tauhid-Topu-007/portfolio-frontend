import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaFilePdf, FaExternalLinkAlt, FaUserFriends, FaCalendar, FaBook, FaQuoteLeft } from 'react-icons/fa';
import moment from 'moment';

const ResearchDetail = ({ paper, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Research paper not found</h2>
        <Link to="/research" className="text-primary-500 hover:text-primary-600">
          Back to Research
        </Link>
      </div>
    );
  }

  return (
    <article>
      <div className="max-w-4xl mx-auto">
        <Link to="/research" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 mb-6">
          <FaArrowLeft /> Back to Research
        </Link>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{paper.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <FaUserFriends /> {paper.authors?.join(', ')}
            </span>
            <span className="flex items-center gap-1">
              <FaCalendar /> {moment(paper.publicationDate).format('MMMM YYYY')}
            </span>
            <span className="flex items-center gap-1">
              <FaBook /> {paper.publicationVenue}
            </span>
          </div>
          
          {paper.doi && (
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600"
            >
              DOI: {paper.doi} <FaExternalLinkAlt size={12} />
            </a>
          )}
        </motion.div>
        
        {/* Abstract */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <FaQuoteLeft className="text-3xl text-primary-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold mb-2">Abstract</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {paper.abstract}
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Content */}
        {paper.content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold mb-4">Research Highlights</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{paper.content}</p>
            </div>
          </motion.div>
        )}
        
        {/* Keywords */}
        {paper.keywords && paper.keywords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold mb-4">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {paper.keywords.map((keyword, i) => (
                <span key={i} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Citations */}
        {paper.citations > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8"
          >
            <p className="text-lg">
              <strong>{paper.citations}</strong> papers have cited this research
            </p>
          </motion.div>
        )}
        
        {/* PDF Download */}
        {paper.pdfUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <FaFilePdf /> Download Full Paper (PDF)
            </a>
          </motion.div>
        )}
      </div>
    </article>
  );
};

export default ResearchDetail;