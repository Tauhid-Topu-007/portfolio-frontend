import React from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';

const Timeline = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary-500 to-primary-700" />

      <div className="space-y-12">
        {items.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`relative flex flex-col md:flex-row ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Timeline Dot */}
            <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500 ring-4 ring-primary-200 dark:ring-primary-900 z-10" />

            {/* Content */}
            <div className={`ml-12 md:ml-0 w-full md:w-1/2 ${
              index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
            }`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg card-hover">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{item.degree || item.position}</h3>
                  <span className="text-sm text-primary-500">
                    {moment(item.startDate).format('YYYY')} - {item.isCurrent ? 'Present' : moment(item.endDate).format('YYYY')}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-semibold mb-2">
                  {item.institution || item.company}
                </p>
                {item.field && (
                  <p className="text-gray-500 dark:text-gray-500 mb-3">Field: {item.field}</p>
                )}
                {item.grade && (
                  <p className="text-gray-500 dark:text-gray-500 mb-3">Grade: {item.grade}</p>
                )}
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                {item.achievements && item.achievements.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {item.achievements.map((achievement, i) => (
                      <li key={i} className="text-sm text-gray-500 dark:text-gray-500">
                        • {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;