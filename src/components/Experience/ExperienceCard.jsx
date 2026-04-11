import React from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';

const ExperienceCard = ({ experience, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg card-hover"
    >
      <div className="flex flex-wrap justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{experience.position}</h3>
          <p className="text-gray-600 dark:text-gray-400 font-semibold">{experience.company}</p>
          {experience.location && (
            <p className="text-sm text-gray-500 dark:text-gray-500">{experience.location}</p>
          )}
        </div>
        <div className="text-right">
          <span className="text-sm text-primary-500">
            {moment(experience.startDate).format('MMM YYYY')} - {experience.isCurrent ? 'Present' : moment(experience.endDate).format('MMM YYYY')}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">{experience.description}</p>
      
      {experience.achievements && experience.achievements.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Key Achievements:</h4>
          <ul className="space-y-1">
            {experience.achievements.map((achievement, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {experience.technologies && experience.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech, i) => (
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