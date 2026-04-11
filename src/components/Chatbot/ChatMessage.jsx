import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaUser } from 'react-icons/fa';
import moment from 'moment';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isBot ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex gap-2 max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isBot ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-200 dark:bg-gray-700'
        }`}>
          {isBot ? <FaRobot size={16} className="text-primary-500" /> : <FaUser size={14} className="text-gray-600 dark:text-gray-400" />}
        </div>
        <div className={`rounded-lg p-3 ${
          isBot 
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' 
            : 'bg-primary-500 text-white'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          <p className="text-xs mt-1 opacity-70">
            {moment(message.timestamp).format('h:mm A')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;