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

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching ALL data from API...');
      console.log('🕐 Timestamp:', new Date().toISOString());

      // Fetch settings first
      try {
        const settingsRes = await api.get('/settings');
        console.log('✅ Settings loaded:', settingsRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error('❌ Settings failed:', err.message);
      }

      // Fetch all other data
      const fetchPromises = [
        { key: 'projects', fn: () => api.get('/projects'), setter: setProjects },
        { key: 'blogs', fn: () => api.get('/blogs'), setter: setBlogs },
        { key: 'skills', fn: () => api.get('/skills'), setter: setSkills },
        { key: 'experiences', fn: () => api.get('/experiences'), setter: setExperiences },
        { key: 'educations', fn: () => api.get('/educations'), setter: setEducations },
        { key: 'research', fn: () => api.get('/research'), setter: setResearch },
        { key: 'certificates', fn: () => api.get('/certificates'), setter: setCertificates },
      ];

      for (const item of fetchPromises) {
        try {
          const res = await item.fn();
          const data = Array.isArray(res.data) ? res.data : (res.data?.[item.key] || []);
          item.setter(data);
          console.log(`✅ ${item.key}:`, data.length, 'items');
        } catch (err) {
          console.warn(`⚠️ ${item.key} failed:`, err.message);
          item.setter([]);
        }
      }

    } catch (error) {
      console.error('❌ Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ✅ Refresh function
  const refreshData = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
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
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;