import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaSave, FaUpload, FaTrash, FaUser, FaGlobe, FaEnvelope, FaLink, FaPalette, FaEye, FaHome } from 'react-icons/fa';
import { DataContext } from '../../context/DataContext';
import api from '../../services/api';

// ✅ Backend URL for uploads
const BACKEND_URL = 'https://portfolio-backend-axtu.onrender.com';

const SettingsManager = () => {
  const navigate = useNavigate();
  const { settings, refreshData } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);

  const [formData, setFormData] = useState({
    siteName: 'My Portfolio',
    siteTitle: 'My Portfolio',
    siteDescription: 'Welcome to my portfolio',
    siteKeywords: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      facebook: '',
      youtube: '',
    },
    heroSection: {
      title: 'Tauhidul Islam Topu',
      subtitle: 'Full Stack Developer',
      profileImage: '',
      backgroundImage: '',
      resumeUrl: '',
    },
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      darkMode: false,
    },
  });

  // Load settings from context
  useEffect(() => {
    if (settings) {
      console.log('📋 Loading settings into form:', settings);
      setFormData({
        siteName: settings.siteName || 'My Portfolio',
        siteTitle: settings.siteTitle || 'My Portfolio',
        siteDescription: settings.siteDescription || '',
        siteKeywords: Array.isArray(settings.siteKeywords) 
          ? settings.siteKeywords.join(', ') 
          : (settings.siteKeywords || ''),
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        address: settings.address || '',
        socialLinks: {
          github: settings.socialLinks?.github || '',
          linkedin: settings.socialLinks?.linkedin || '',
          twitter: settings.socialLinks?.twitter || '',
          instagram: settings.socialLinks?.instagram || '',
          facebook: settings.socialLinks?.facebook || '',
          youtube: settings.socialLinks?.youtube || '',
        },
        heroSection: {
          title: settings.heroSection?.title || 'Tauhidul Islam Topu',
          subtitle: settings.heroSection?.subtitle || 'Full Stack Developer',
          profileImage: settings.heroSection?.profileImage || '',
          backgroundImage: settings.heroSection?.backgroundImage || '',
          resumeUrl: settings.heroSection?.resumeUrl || '',
        },
        theme: {
          primaryColor: settings.theme?.primaryColor || '#6366f1',
          secondaryColor: settings.theme?.secondaryColor || '#8b5cf6',
          darkMode: settings.theme?.darkMode || false,
        },
      });
    }
  }, [settings]);

  // ✅ Upload Profile Image to Cloudinary
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('profileImage', file);

    setUploadingProfile(true);
    try {
      const token = localStorage.getItem('token');
      console.log('📤 Uploading profile image to Cloudinary...');
      
      const response = await fetch(`${BACKEND_URL}/api/upload/profile`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData,
      });

      const data = await response.json();
      console.log('📥 Upload response:', data);

      if (data.success) {
        const imageUrl = data.fullUrl || data.url;
        console.log('✅ Cloudinary URL:', imageUrl);
        
        setFormData(prev => ({
          ...prev,
          heroSection: { ...prev.heroSection, profileImage: imageUrl }
        }));
        toast.success('✅ Image uploaded to Cloudinary! Now click "Save All Settings" to apply.');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      toast.error('Failed to upload image. Check console for details.');
    } finally {
      setUploadingProfile(false);
    }
  };

  // ✅ Upload Background Image to Cloudinary
  const handleBackgroundUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('backgroundImage', file);

    setUploadingBackground(true);
    try {
      const token = localStorage.getItem('token');
      console.log('📤 Uploading background image to Cloudinary...');
      
      const response = await fetch(`${BACKEND_URL}/api/upload/background`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData,
      });

      const data = await response.json();
      console.log('📥 Upload response:', data);

      if (data.success) {
        const imageUrl = data.fullUrl || data.url;
        console.log('✅ Cloudinary URL:', imageUrl);
        
        setFormData(prev => ({
          ...prev,
          heroSection: { ...prev.heroSection, backgroundImage: imageUrl }
        }));
        toast.success('✅ Background uploaded to Cloudinary! Click "Save All Settings" to apply.');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      toast.error('Failed to upload background image.');
    } finally {
      setUploadingBackground(false);
    }
  };

  // Remove Profile Image
  const handleRemoveProfileImage = () => {
    setFormData(prev => ({
      ...prev,
      heroSection: { ...prev.heroSection, profileImage: '' }
    }));
    toast.success('Profile image removed. Click Save to apply.');
  };

  // Remove Background Image
  const handleRemoveBackgroundImage = () => {
    setFormData(prev => ({
      ...prev,
      heroSection: { ...prev.heroSection, backgroundImage: '' }
    }));
    toast.success('Background image removed. Click Save to apply.');
  };

  // ✅ Save Settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare keywords
    const keywordsArray = formData.siteKeywords
      ? formData.siteKeywords.split(',').map(k => k.trim()).filter(k => k)
      : [];

    const dataToSend = {
      siteName: formData.siteName,
      siteTitle: formData.siteTitle,
      siteDescription: formData.siteDescription,
      siteKeywords: keywordsArray,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      address: formData.address,
      socialLinks: formData.socialLinks,
      heroSection: {
        title: formData.heroSection.title,
        subtitle: formData.heroSection.subtitle,
        profileImage: formData.heroSection.profileImage,
        backgroundImage: formData.heroSection.backgroundImage,
        resumeUrl: formData.heroSection.resumeUrl,
      },
      theme: formData.theme,
    };

    console.log('📤 Saving settings:', dataToSend);

    try {
      const response = await api.put('/settings', dataToSend);
      console.log('✅ Settings saved:', response.data);

      // Refresh context data
      if (typeof refreshData === 'function') {
        await refreshData();
      }

      toast.success('✅ Settings saved successfully! Redirecting to homepage...');

      // Redirect to homepage
      setTimeout(() => {
        navigate('/');
        window.location.href = '/';
      }, 1500);

    } catch (error) {
      console.error('❌ Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  const handleHeroChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      heroSection: { ...prev.heroSection, [field]: value }
    }));
  };

  const handleThemeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      theme: { ...prev.theme, [field]: value }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            ⚙️ Site Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Customize your portfolio appearance and information
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { navigate('/'); window.location.href = '/'; }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm"
          >
            <FaHome size={14} /> View Site
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <FaSave size={14} /> {loading ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ===== HERO SECTION ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FaUser className="text-blue-500" /> Hero Section
            </h2>
            <p className="text-xs text-gray-500 mt-1">This appears on your homepage</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Hero Title & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.heroSection.title}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  placeholder="Tauhidul Islam Topu"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Shows as "Hi, I'm [Your Name]"</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Hero Subtitle</label>
                <input
                  type="text"
                  value={formData.heroSection.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  placeholder="Full Stack Developer"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Appears in the typewriter animation</p>
              </div>
            </div>

            {/* Profile Image Upload */}
            <div className="border-t pt-5">
              <label className="block text-sm font-semibold mb-3">Profile Picture</label>
              <div className="flex flex-wrap items-start gap-4">
                {/* Preview */}
                <div className="relative">
                  {formData.heroSection.profileImage ? (
                    <div className="relative group">
                      <img
                        src={formData.heroSection.profileImage}
                        alt="Profile"
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                        onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23ddd" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23999" font-size="40">?</text></svg>'; }}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveProfileImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="Remove image"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border-4 border-blue-300">
                      <FaUser className="text-white text-3xl md:text-5xl" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1 min-w-[200px]">
                  <label className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors ${uploadingProfile ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <FaUpload size={14} />
                    <span className="text-sm">
                      {uploadingProfile ? 'Uploading to Cloudinary...' : 
                       formData.heroSection.profileImage ? 'Change Picture' : 'Upload to Cloudinary'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileUpload}
                      className="hidden"
                      disabled={uploadingProfile}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Square image recommended. Max 10MB</p>
                  {formData.heroSection.profileImage && (
                    <div className="mt-1">
                      <p className="text-xs text-green-600">✅ Image ready</p>
                      <p className="text-xs text-gray-400 truncate max-w-xs">{formData.heroSection.profileImage}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resume URL */}
            <div>
              <label className="block text-sm font-semibold mb-2">Resume URL</label>
              <input
                type="url"
                value={formData.heroSection.resumeUrl}
                onChange={(e) => handleHeroChange('resumeUrl', e.target.value)}
                placeholder="https://example.com/your-resume.pdf"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ===== GENERAL SETTINGS ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FaGlobe className="text-blue-500" /> General Settings
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Site Name</label>
              <input type="text" value={formData.siteName}
                onChange={(e) => setFormData(p => ({ ...p, siteName: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Site Description</label>
              <textarea rows={2} value={formData.siteDescription}
                onChange={(e) => setFormData(p => ({ ...p, siteDescription: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Keywords (SEO)</label>
              <input type="text" value={formData.siteKeywords}
                onChange={(e) => setFormData(p => ({ ...p, siteKeywords: e.target.value }))}
                placeholder="react, javascript, developer, portfolio"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
            </div>
          </div>
        </div>

        {/* ===== CONTACT INFO ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FaEnvelope className="text-blue-500" /> Contact Information
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input type="email" value={formData.contactEmail}
                onChange={(e) => setFormData(p => ({ ...p, contactEmail: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone</label>
              <input type="text" value={formData.contactPhone}
                onChange={(e) => setFormData(p => ({ ...p, contactPhone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Address</label>
              <input type="text" value={formData.address}
                onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
            </div>
          </div>
        </div>

        {/* ===== SOCIAL LINKS ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FaLink className="text-blue-500" /> Social Media Links
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {['github', 'linkedin', 'twitter', 'instagram', 'facebook', 'youtube'].map(platform => (
              <div key={platform}>
                <label className="block text-sm font-semibold mb-2 capitalize">{platform}</label>
                <input type="url" value={formData.socialLinks[platform]}
                  onChange={(e) => handleSocialChange(platform, e.target.value)}
                  placeholder={`https://${platform}.com/yourusername`}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900" />
              </div>
            ))}
          </div>
        </div>

        {/* ===== THEME ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FaPalette className="text-blue-500" /> Theme Settings
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <label className="text-sm font-semibold">Primary Color:</label>
              <input type="color" value={formData.theme.primaryColor}
                onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                className="w-16 h-10 rounded border cursor-pointer" />
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{formData.theme.primaryColor}</code>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.theme.darkMode}
                onChange={(e) => handleThemeChange('darkMode', e.target.checked)}
                className="w-4 h-4 text-blue-500 rounded" />
              <span className="font-semibold text-sm">Enable Dark Mode by Default</span>
            </label>
          </div>
        </div>

        {/* ===== SAVE BUTTON ===== */}
        <div className="sticky bottom-4 flex justify-center md:justify-end gap-3">
          <button
            type="button"
            onClick={() => { navigate('/'); window.location.href = '/'; }}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <FaEye size={14} /> View Site
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <FaSave size={14} /> {loading ? 'Saving...' : 'Save All Settings & Go to Homepage'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;