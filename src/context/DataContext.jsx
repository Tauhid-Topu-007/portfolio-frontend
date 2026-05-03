import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

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
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Fetching all data from API...');

      // Fetch settings FIRST (most important for display)
      try {
        const settingsRes = await api.get('/settings');
        console.log('✅ Settings loaded:', settingsRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error('❌ Settings failed:', err.message);
      }

      // Fetch other data
      try {
        const projectsRes = await api.get('/projects');
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        console.log('✅ Projects:', projectsRes.data?.length || 0);
      } catch (err) { console.warn('⚠️ Projects failed:', err.message); setProjects([]); }

      try {
        const blogsRes = await api.get('/blogs');
        setBlogs(Array.isArray(blogsRes.data) ? blogsRes.data : []);
        console.log('✅ Blogs:', blogsRes.data?.length || 0);
      } catch (err) { console.warn('⚠️ Blogs failed:', err.message); setBlogs([]); }

      try {
        const skillsRes = await api.get('/skills');
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
      } catch (err) { setSkills([]); }

      try {
        const expRes = await api.get('/experiences');
        setExperiences(Array.isArray(expRes.data) ? expRes.data : []);
      } catch (err) { setExperiences([]); }

      try {
        const eduRes = await api.get('/educations');
        setEducations(Array.isArray(eduRes.data) ? eduRes.data : []);
      } catch (err) { setEducations([]); }

      try {
        const researchRes = await api.get('/research');
        setResearch(Array.isArray(researchRes.data) ? researchRes.data : []);
      } catch (err) { setResearch([]); }

      try {
        const certRes = await api.get('/certificates');
        setCertificates(Array.isArray(certRes.data) ? certRes.data : []);
      } catch (err) { setCertificates([]); }

    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ✅ Refresh function - called after settings update
  const refreshData = useCallback(() => {
    console.log('🔄 Refreshing all data...');
    fetchAllData();
  }, [fetchAllData]);

  const value = {
    projects, setProjects,
    blogs, setBlogs,
    skills, setSkills,
    experiences, setExperiences,
    educations, setEducations,
    research, setResearch,
    certificates, setCertificates,
    settings, setSettings,
    loading,
    error,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;