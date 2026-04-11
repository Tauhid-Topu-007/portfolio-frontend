import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
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
      ] = await Promise.allSettled([
        api.get('/projects'),
        api.get('/blogs?isPublished=true'),
        api.get('/skills'),
        api.get('/experiences'),
        api.get('/educations'),
        api.get('/certificates'),
        api.get('/research'),
        api.get('/settings'),
      ]);

      // Handle each response individually to prevent one failure from breaking everything
      if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value.data);
      if (blogsRes.status === 'fulfilled') setBlogs(blogsRes.value.data);
      if (skillsRes.status === 'fulfilled') setSkills(skillsRes.value.data);
      if (experiencesRes.status === 'fulfilled') setExperiences(experiencesRes.value.data);
      if (educationsRes.status === 'fulfilled') setEducations(educationsRes.value.data);
      if (certificatesRes.status === 'fulfilled') setCertificates(certificatesRes.value.data);
      if (researchRes.status === 'fulfilled') setResearch(researchRes.value.data);
      if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value.data);
      
      if (settingsRes.status === 'rejected') {
        console.error('Settings fetch failed, using defaults');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchAllData();
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
        error,
        refetch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};