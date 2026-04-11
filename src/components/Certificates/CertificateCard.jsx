import React from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';
import { FaExternalLinkAlt, FaFilePdf } from 'react-icons/fa';

const CertificateCard = ({ certificate, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg card-hover"
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-1">{certificate.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{certificate.issuer}</p>
      </div>
      
      <div className="mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-500">
          Issued: {moment(certificate.issueDate).format('MMMM YYYY')}
        </span>
        {certificate.expiryDate && (
          <span className="text-sm text-gray-500 dark:text-gray-500 ml-2">
            | Expires: {moment(certificate.expiryDate).format('MMMM YYYY')}
          </span>
        )}
      </div>
      
      {certificate.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          {certificate.description}
        </p>
      )}
      
      {certificate.skills && certificate.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {certificate.skills.map((skill, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex gap-3">
        {certificate.credentialUrl && (
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 text-sm font-semibold"
          >
            Verify <FaExternalLinkAlt size={12} />
          </a>
        )}
        {certificate.certificateFile && (
          <a
            href={certificate.certificateFile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 text-sm font-semibold"
          >
            View PDF <FaFilePdf size={12} />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default CertificateCard;