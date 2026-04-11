import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaExternalLinkAlt, FaUserFriends, FaCalendar, FaBook, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import moment from 'moment';

const ResearchCard = ({ paper, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden card-hover"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 hover:text-primary-500 transition-colors">
          {paper.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <FaUserFriends size={14} />
            {paper.authors?.slice(0, 3).join(', ')}
            {paper.authors?.length > 3 && ` +${paper.authors.length - 3}`}
          </span>
          <span className="flex items-center gap-1">
            <FaCalendar size={14} />
            {moment(paper.publicationDate).format('YYYY')}
          </span>
          <span className="flex items-center gap-1">
            <FaBook size={14} />
            {paper.publicationVenue}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {paper.abstract}
        </p>
        
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            {paper.content && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Key Points:</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {paper.content}
                </p>
              </div>
            )}
            
            {paper.keywords && paper.keywords.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Keywords:</h4>
                <div className="flex flex-wrap gap-2">
                  {paper.keywords.map((keyword, i) => (
                    <span key={i} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {paper.citations > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cited by: {paper.citations} papers
              </p>
            )}
          </motion.div>
        )}
        
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="flex gap-3">
            {paper.doi && (
              <a
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-sm"
              >
                DOI: {paper.doi} <FaExternalLinkAlt size={12} />
              </a>
            )}
            {paper.pdfUrl && (
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-sm"
              >
                <FaFilePdf /> Download PDF
              </a>
            )}
          </div>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-500 transition-colors"
          >
            {expanded ? (
              <>Show Less <FaChevronUp size={12} /></>
            ) : (
              <>Show More <FaChevronDown size={12} /></>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResearchCard;