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

  // Helper function to ensure data is always an array
  const ensureArray = (data) => {
    return Array.isArray(data) ? data : [];
  };

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

      // Handle each response individually with safety checks
      if (projectsRes.status === 'fulfilled') {
        const data = projectsRes.value?.data;
        setProjects(ensureArray(data));
      } else {
        setProjects([]);
        console.error('Projects fetch failed:', projectsRes.reason);
      }

      if (blogsRes.status === 'fulfilled') {
        const data = blogsRes.value?.data;
        setBlogs(ensureArray(data));
      } else {
        setBlogs([]);
        console.error('Blogs fetch failed:', blogsRes.reason);
      }

      if (skillsRes.status === 'fulfilled') {
        const data = skillsRes.value?.data;
        setSkills(ensureArray(data));
      } else {
        setSkills([]);
        console.error('Skills fetch failed:', skillsRes.reason);
      }

      if (experiencesRes.status === 'fulfilled') {
        const data = experiencesRes.value?.data;
        setExperiences(ensureArray(data));
      } else {
        setExperiences([]);
        console.error('Experiences fetch failed:', experiencesRes.reason);
      }

      if (educationsRes.status === 'fulfilled') {
        const data = educationsRes.value?.data;
        setEducations(ensureArray(data));
      } else {
        setEducations([]);
        console.error('Educations fetch failed:', educationsRes.reason);
      }

      if (certificatesRes.status === 'fulfilled') {
        const data = certificatesRes.value?.data;
        setCertificates(ensureArray(data));
      } else {
        setCertificates([]);
        console.error('Certificates fetch failed:', certificatesRes.reason);
      }

      if (researchRes.status === 'fulfilled') {
        const data = researchRes.value?.data;
        setResearch(ensureArray(data));
      } else {
        setResearch([]);
        console.error('Research fetch failed:', researchRes.reason);
      }

      if (settingsRes.status === 'fulfilled') {
        setSettings(settingsRes.value?.data || null);
      } else {
        console.error('Settings fetch failed, using defaults');
        setSettings(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please check your connection.');
      // Set empty arrays on complete failure
      setProjects([]);
      setBlogs([]);
      setSkills([]);
      setExperiences([]);
      setEducations([]);
      setCertificates([]);
      setResearch([]);
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