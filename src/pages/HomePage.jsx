import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Home/Hero';
import Skills from '../components/Home/Skills';
import Projects from '../components/Home/Projects';
import Contact from '../components/Home/Contact';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Home | Portfolio</title>
        <meta name="description" content="Welcome to my portfolio website" />
      </Helmet>
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
};

export default HomePage;