import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { DataContext } from '../../context/DataContext';
import { FaCode, FaDatabase, FaCloud, FaTools, FaUsers, FaMobileAlt } from 'react-icons/fa';

const Skills = () => {
  const { skills, loading } = useContext(DataContext);

  const categoryIcons = {
    frontend: <FaCode className="text-primary-500" />,
    backend: <FaCode className="text-primary-500" />,
    database: <FaDatabase className="text-primary-500" />,
    devops: <FaCloud className="text-primary-500" />,
    tools: <FaTools className="text-primary-500" />,
    soft: <FaUsers className="text-primary-500" />,
  };

  const categoryNames = {
    frontend: 'Frontend Development',
    backend: 'Backend Development',
    database: 'Database',
    devops: 'DevOps',
    tools: 'Tools',
    soft: 'Soft Skills',
  };

  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (loading) return null;

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            My <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </motion.div>

        <div className="space-y-12">
          {Object.entries(groupedSkills || {}).map(([category, categorySkills]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-6">
                {categoryIcons[category]}
                <h3 className="text-xl font-semibold">{categoryNames[category] || category}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg card-hover"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-lg">{skill.name}</h4>
                      <span className="text-primary-500 font-semibold">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                      />
                    </div>
                    {skill.yearsOfExperience > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {skill.yearsOfExperience} years experience
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;