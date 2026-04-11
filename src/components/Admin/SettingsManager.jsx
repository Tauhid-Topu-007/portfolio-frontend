import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSave, FaUpload, FaTrash, FaUser, FaImage, FaPalette, FaEnvelope, FaLink, FaGlobe } from 'react-icons/fa';
import { DataContext } from '../../context/DataContext';

const SettingsManager = () => {
  const { settings, refetch } = useContext(DataContext);
  const [formData, setFormData] = useState({
    siteName: '',
    siteTitle: '',
    siteDescription: '',
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
      title: '',
      subtitle: '',
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
  const [loading, setLoading] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || '',
        siteTitle: settings.siteTitle || '',
        siteDescription: settings.siteDescription || '',
        siteKeywords: Array.isArray(settings.siteKeywords) ? settings.siteKeywords.join(', ') : '',
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
          title: settings.heroSection?.title || '',
          subtitle: settings.heroSection?.subtitle || '',
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

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('profileImage', file);

    setUploadingProfile(true);
    try {
      const response = await axios.post('/api/upload/profile', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleHeroChange('profileImage', response.data.url);
      toast.success('Profile image uploaded successfully');
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleBackgroundUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('backgroundImage', file);

    setUploadingBackground(true);
    try {
      const response = await axios.post('/api/upload/background', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleHeroChange('backgroundImage', response.data.url);
      toast.success('Background image uploaded successfully');
    } catch (error) {
      console.error('Error uploading background image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingBackground(false);
    }
  };

  const handleRemoveProfileImage = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;
    
    const imageUrl = formData.heroSection.profileImage;
    if (imageUrl) {
      const filename = imageUrl.split('/').pop();
      try {
        await axios.delete(`/api/upload/profile/${filename}`);
        handleHeroChange('profileImage', '');
        toast.success('Profile image removed successfully');
      } catch (error) {
        console.error('Error removing image:', error);
        toast.error('Failed to remove image');
      }
    } else {
      handleHeroChange('profileImage', '');
      toast.success('Profile image removed');
    }
  };

  const handleRemoveBackgroundImage = async () => {
    if (!window.confirm('Are you sure you want to remove the background image?')) return;
    
    const imageUrl = formData.heroSection.backgroundImage;
    if (imageUrl) {
      const filename = imageUrl.split('/').pop();
      try {
        await axios.delete(`/api/upload/background/${filename}`);
        handleHeroChange('backgroundImage', '');
        toast.success('Background image removed successfully');
      } catch (error) {
        console.error('Error removing image:', error);
        toast.error('Failed to remove image');
      }
    } else {
      handleHeroChange('backgroundImage', '');
      toast.success('Background image removed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Process siteKeywords properly
    let keywordsArray = [];
    if (formData.siteKeywords) {
      if (typeof formData.siteKeywords === 'string') {
        keywordsArray = formData.siteKeywords.split(',').map(k => k.trim()).filter(k => k);
      } else if (Array.isArray(formData.siteKeywords)) {
        keywordsArray = formData.siteKeywords;
      }
    }
    
    const dataToSend = {
      siteName: formData.siteName,
      siteTitle: formData.siteTitle,
      siteDescription: formData.siteDescription,
      siteKeywords: keywordsArray,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      address: formData.address,
      socialLinks: formData.socialLinks,
      heroSection: formData.heroSection,
      theme: formData.theme,
    };
    
    try {
      await axios.put('/api/settings', dataToSend);
      toast.success('Settings updated successfully');
      refetch();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialChange = (platform, value) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: value,
      },
    });
  };

  const handleHeroChange = (field, value) => {
    setFormData({
      ...formData,
      heroSection: {
        ...formData.heroSection,
        [field]: value,
      },
    });
  };

  const handleThemeChange = (field, value) => {
    setFormData({
      ...formData,
      theme: {
        ...formData.theme,
        [field]: value,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold gradient-text">Site Settings</h1>
        <button 
          onClick={() => window.location.reload()}
          className="text-gray-500 hover:text-primary-500 transition-colors"
        >
          Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile & Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaUser className="text-primary-500" />
              Profile & Hero Section
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Customize your profile picture and hero section content
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Profile Image Upload */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <label className="block text-lg font-semibold mb-3">Profile Picture</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Image Preview */}
                <div className="relative">
                  {formData.heroSection.profileImage ? (
                    <div className="relative group">
                      <img
                        src={formData.heroSection.profileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary-500 shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleRemoveProfileImage}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                      <FaUser className="text-white text-5xl" />
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <div className="flex-1">
                  <label className={`cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors ${uploadingProfile ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <FaUpload size={16} />
                    <span>{uploadingProfile ? 'Uploading...' : formData.heroSection.profileImage ? 'Change Profile Picture' : 'Upload Profile Picture'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileUpload}
                      className="hidden"
                      disabled={uploadingProfile}
                    />
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Recommended: Square image, 128x128px or larger, max 5MB (JPG, PNG, GIF, WebP)
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    This picture will appear on your homepage hero section
                  </p>
                </div>
              </div>
            </div>

            {/* Background Image Upload */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                <FaImage className="text-primary-500" />
                Background Image (Optional)
              </label>
              {formData.heroSection.backgroundImage && (
                <div className="relative mb-3 group">
                  <img
                    src={formData.heroSection.backgroundImage}
                    alt="Background"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveBackgroundImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}
              <label className={`cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${uploadingBackground ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <FaUpload size={16} />
                <span>{uploadingBackground ? 'Uploading...' : formData.heroSection.backgroundImage ? 'Change Background' : 'Upload Background Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  className="hidden"
                  disabled={uploadingBackground}
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Recommended: 1920x1080px landscape image, max 5MB
              </p>
            </div>
            
            {/* Hero Text Content */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hero Title</label>
                <input
                  type="text"
                  value={formData.heroSection.title}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  placeholder="e.g., Full Stack Developer"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This appears in the typewriter animation
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                <input
                  type="text"
                  value={formData.heroSection.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  placeholder="e.g., I create amazing web experiences"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Resume URL</label>
                <input
                  type="url"
                  value={formData.heroSection.resumeUrl}
                  onChange={(e) => handleHeroChange('resumeUrl', e.target.value)}
                  placeholder="https://example.com/resume.pdf"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Link to your resume file (PDF, DOC, etc.)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaGlobe className="text-primary-500" />
              General Settings
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Site Name</label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Site Title</label>
                <input
                  type="text"
                  value={formData.siteTitle}
                  onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Site Description</label>
                <textarea
                  rows={2}
                  value={formData.siteDescription}
                  onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Site Keywords (comma separated)</label>
                <input
                  type="text"
                  value={formData.siteKeywords}
                  onChange={(e) => setFormData({ ...formData, siteKeywords: e.target.value })}
                  placeholder="react, javascript, portfolio, developer, web development"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Keywords help with SEO - separate with commas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaEnvelope className="text-primary-500" />
              Contact Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Contact Phone</label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="New York, USA"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaLink className="text-primary-500" />
              Social Media Links
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">GitHub</label>
                <input
                  type="url"
                  value={formData.socialLinks.github}
                  onChange={(e) => handleSocialChange('github', e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Twitter</label>
                <input
                  type="url"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Instagram</label>
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Facebook</label>
                <input
                  type="url"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/username"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">YouTube</label>
                <input
                  type="url"
                  value={formData.socialLinks.youtube}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/c/username"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaPalette className="text-primary-500" />
              Theme Settings
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.theme.primaryColor}
                    onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                    className="w-16 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.theme.primaryColor}
                    onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.theme.secondaryColor}
                    onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                    className="w-16 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.theme.secondaryColor}
                    onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.theme.darkMode}
                    onChange={(e) => handleThemeChange('darkMode', e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                  <span className="font-medium">Enable Dark Mode by Default</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7">
                  Users can still toggle dark mode manually using the theme switcher in the navbar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading || uploadingProfile || uploadingBackground} 
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave /> {loading ? 'Saving...' : uploadingProfile || uploadingBackground ? 'Uploading...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;