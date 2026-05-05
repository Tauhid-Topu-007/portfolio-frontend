// src/pages/HomePage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import NeuralBackground from '../components/NeuralBackground';
import Hero from '../components/Home/Hero';
import Skills from '../components/Home/Skills';
import Projects from '../components/Home/Projects';
import Contact from '../components/Home/Contact';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Home | Portfolio</title>
        <meta name="description" content="Welcome to my portfolio website - Full Stack Developer, AI Engineer, and Creative Problem Solver" />
      </Helmet>

      {/* Beautiful Neural Background for Homepage */}
      <NeuralBackground 
        density="medium"
        primaryColor="#8B5CF6"
        secondaryColor="#3B82F6"
        accentColor="#EC4899"
        connectionOpacity={0.35}
        nodeSize={2.5}
        pulseSpeed={1.2}
      />

      <div className="relative z-10">
        <Hero />
        <Skills />
        <Projects />
        <Contact />
      </div>
    </>
  );
};

export default HomePage;