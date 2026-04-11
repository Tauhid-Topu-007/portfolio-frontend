import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { DataContext } from "../../context/DataContext";
import { AuthContext } from "../../context/AuthContext";

const Hero = () => {
  const { settings, loading } = useContext(DataContext);
  const { user } = useContext(AuthContext);

  if (loading) return null;

  // Get profile image from settings (uploaded via admin panel)
  const profileImage =
    settings?.heroSection?.profileImage ||
    user?.avatar ||
    "https://via.placeholder.com/128";
  const backgroundImage = settings?.heroSection?.backgroundImage;

  return (
    <section
      className="min-h-screen flex items-center justify-center pt-16 relative"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }
          : {}
      }
    >
      {backgroundImage && <div className="absolute inset-0 bg-black/50" />}

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-primary-700 p-1">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            Hi, I'm{" "}
            <br />
            <span className="gradient-text">Tauhidul Islam Topu</span>
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-6"
          >
            <Typewriter
              words={[
                user?.title ||
                  settings?.heroSection?.title ||
                  "Full Stack Developer",
    "AI Engineer",
    "Machine Learning Enthusiast",
    "Research Paper Writer",
    "Problem Solver",
    "Tech Enthusiast",
    "Creative Thinker",
    "Open Source Contributor",
    "Lifelong Learner",
              ]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
          >
            {user?.bio ||
              settings?.siteDescription ||
              "Passionate developer creating amazing web experiences with modern technologies."}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center space-x-4 flex-wrap gap-4"
          >
            <a href="#projects" className="btn-primary">
              View Projects
            </a>
            <a href="#contact" className="btn-secondary">
              Contact Me
            </a>
            {settings?.heroSection?.resumeUrl && (
              <a
                href={settings.heroSection.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Download Resume
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
