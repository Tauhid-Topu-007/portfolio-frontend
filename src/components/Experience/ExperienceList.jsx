import React from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';

const ExperienceList = ({ experiences, loading }) => {
  // Ensure experiences is an array
  const experiencesArray = Array.isArray(experiences) ? experiences : [];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (experiencesArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No experience entries yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {experiencesArray.map((exp, index) => (
        <motion.div
          key={exp._id || index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
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
          
          {(exp.achievements || []).length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Key Achievements:</h4>
              <ul className="space-y-1">
                {(exp.achievements || []).map((achievement, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-primary-500 mt-1">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {(exp.technologies || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(exp.technologies || []).map((tech, i) => (
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
      ))}
    </div>
  );
};

export default ExperienceList;