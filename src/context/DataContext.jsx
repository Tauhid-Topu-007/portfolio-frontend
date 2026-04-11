import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Always initialize as empty arrays
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
      ] = await Promise.all([
        api.get('/projects').catch(() => ({ data: [] })),
        api.get('/blogs?isPublished=true').catch(() => ({ data: [] })),
        api.get('/skills').catch(() => ({ data: [] })),
        api.get('/experiences').catch(() => ({ data: [] })),
        api.get('/educations').catch(() => ({ data: [] })),
        api.get('/certificates').catch(() => ({ data: [] })),
        api.get('/research').catch(() => ({ data: [] })),
        api.get('/settings').catch(() => ({ data: null })),
      ]);

      // Always set arrays, even if response is invalid
      setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
      setBlogs(Array.isArray(blogsRes.data) ? blogsRes.data : []);
      setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
      setExperiences(Array.isArray(experiencesRes.data) ? experiencesRes.data : []);
      setEducations(Array.isArray(educationsRes.data) ? educationsRes.data : []);
      setCertificates(Array.isArray(certificatesRes.data) ? certificatesRes.data : []);
      setResearch(Array.isArray(researchRes.data) ? researchRes.data : []);
      setSettings(settingsRes.data || null);
      
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