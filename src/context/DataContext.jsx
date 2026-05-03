import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const DataContext = createContext();

export const useData = () => {
  const context = React.useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [research, setResearch] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const endpoints = [
        { key: 'projects', url: '/api/projects' },
        { key: 'blogs', url: '/api/blogs' },
        { key: 'skills', url: '/api/skills' },
        { key: 'experiences', url: '/api/experiences' },
        { key: 'educations', url: '/api/educations' },
        { key: 'research', url: '/api/research' },
        { key: 'certificates', url: '/api/certificates' },
        { key: 'settings', url: '/api/settings' },
      ];

      const setters = {
        projects: setProjects,
        blogs: setBlogs,
        skills: setSkills,
        experiences: setExperiences,
        educations: setEducations,
        research: setResearch,
        certificates: setCertificates,
        settings: setSettings,
      };

      const results = await Promise.allSettled(
        endpoints.map(endpoint => api.get(endpoint.url))
      );

      results.forEach((result, index) => {
        const { key } = endpoints[index];
        if (result.status === 'fulfilled') {
          setters[key](result.value.data || []);
        } else {
          console.warn(`⚠️ Failed to fetch ${key}:`, result.reason?.message);
          setters[key](key === 'settings' ? null : []);
        }
      });

    } catch (error) {
      console.error('❌ Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = useCallback(() => fetchAllData(), []);

  return (
    <DataContext.Provider value={{
      projects, blogs, skills, experiences, educations,
      research, certificates, settings, loading, refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;