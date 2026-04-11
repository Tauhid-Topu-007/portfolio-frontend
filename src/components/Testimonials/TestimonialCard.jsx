import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar, FaStarHalf, FaRegStar } from 'react-icons/fa';

const TestimonialCard = ({ testimonial, index }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className="text-yellow-400" />);
    }
    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg card-hover relative"
    >
      <FaQuoteLeft className="absolute top-4 right-4 text-4xl text-gray-200 dark:text-gray-700" />
      
      <div className="flex items-center gap-4 mb-4">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
            {testimonial.name?.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-bold text-lg">{testimonial.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.position}</p>
          {testimonial.company && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.company}</p>
          )}
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex gap-1">
          {renderStars(testimonial.rating || 5)}
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        "{testimonial.message}"
      </p>
      
      {testimonial.date && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
          {new Date(testimonial.date).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  );
};

export default TestimonialCard;