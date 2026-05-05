// src/components/Home/Skills.jsx
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { DataContext } from '../../context/DataContext';
import { FaCode, FaDatabase, FaCloud, FaTools, FaUsers, FaMobileAlt, FaRobot, FaPalette } from 'react-icons/fa';

const Skills = () => {
  const { skills, loading } = useContext(DataContext);

  const categoryIcons = {
    frontend: <FaCode className="text-purple-500" />,
    backend: <FaCode className="text-purple-500" />,
    database: <FaDatabase className="text-purple-500" />,
    devops: <FaCloud className="text-purple-500" />,
    tools: <FaTools className="text-purple-500" />,
    soft: <FaUsers className="text-purple-500" />,
    mobile: <FaMobileAlt className="text-purple-500" />,
    ai: <FaRobot className="text-purple-500" />,
    design: <FaPalette className="text-purple-500" />,
  };

  const categoryNames = {
    frontend: 'Frontend Development',
    backend: 'Backend Development',
    database: 'Database',
    devops: 'DevOps & Cloud',
    tools: 'Tools & Technologies',
    soft: 'Soft Skills',
    mobile: 'Mobile Development',
    ai: 'AI & Machine Learning',
    design: 'UI/UX Design',
  };

  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (loading) return null;

  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 shadow-lg"
          >
            <FaCode className="text-2xl text-white" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            My Skills
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Technologies and tools I work with to bring ideas to life
          </p>
        </motion.div>

        <div className="space-y-12">
          {Object.entries(groupedSkills || {}).map(([category, categorySkills], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                  {categoryIcons[category] || <FaCode className="text-white" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">
                        {skill.name}
                      </h4>
                      <span className="text-purple-500 font-bold text-sm px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full"
                      />
                    </div>
                    {skill.yearsOfExperience > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                        <span>📅</span> {skill.yearsOfExperience} year{skill.yearsOfExperience > 1 ? 's' : ''} experience
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