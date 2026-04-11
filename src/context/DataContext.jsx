import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [research, setResearch] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        projectsRes,
        blogsRes,
        skillsRes,
        experiencesRes,
        educationsRes,
        certificatesRes,
        researchRes,
        settingsRes,
      ] = await Promise.all([
        axios.get('/api/projects'),
        axios.get('/api/blogs?isPublished=true'),
        axios.get('/api/skills'),
        axios.get('/api/experiences'),
        axios.get('/api/educations'),
        axios.get('/api/certificates'),
        axios.get('/api/research'),
        axios.get('/api/settings'),
      ]);

      setProjects(projectsRes.data);
      setBlogs(blogsRes.data);
      setSkills(skillsRes.data);
      setExperiences(experiencesRes.data);
      setEducations(educationsRes.data);
      setCertificates(certificatesRes.data);
      setResearch(researchRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        blogs,
        skills,
        experiences,
        educations,
        certificates,
        research,
        settings,
        loading,
        refetch: fetchAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};