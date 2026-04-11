import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ fullScreen = true }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin border-t-primary-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;