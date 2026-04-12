import React from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';

const ExperienceCard = ({ experience, index }) => {
  // Safely access properties with optional chaining
  const exp = experience || {};
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: (index || 0) * 0.1 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg card-hover"
    >
      <div className="flex flex-wrap justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{exp.position || 'Position'}</h3>
          <p className="text-gray-600 dark:text-gray-400 font-semibold">{exp.company || 'Company'}</p>
          {exp.location && (
            <p className="text-sm text-gray-500 dark:text-gray-500">{exp.location}</p>
          )}
        </div>
        <div className="text-right">
          <span className="text-sm text-primary-500">
            {exp.startDate ? moment(exp.startDate).format('MMM YYYY') : 'N/A'} - {exp.isCurrent ? 'Present' : (exp.endDate ? moment(exp.endDate).format('MMM YYYY') : 'N/A')}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">{exp.description || 'No description available.'}</p>
      
      {exp.achievements && exp.achievements.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Key Achievements:</h4>
          <ul className="space-y-1">
            {exp.achievements.map((achievement, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {exp.technologies && exp.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {exp.technologies.map((tech, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ExperienceCard;