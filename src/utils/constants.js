export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const CATEGORIES = {
  PROJECT: {
    WEB: 'web',
    MOBILE: 'mobile',
    AI: 'ai',
    OTHER: 'other',
  },
  SKILL: {
    FRONTEND: 'frontend',
    BACKEND: 'backend',
    DATABASE: 'database',
    DEVOPS: 'devops',
    TOOLS: 'tools',
    SOFT: 'soft',
  },
};

export const SKILL_CATEGORIES = [
  { value: 'frontend', label: 'Frontend Development' },
  { value: 'backend', label: 'Backend Development' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'tools', label: 'Tools' },
  { value: 'soft', label: 'Soft Skills' },
];

export const PROJECT_CATEGORIES = [
  { value: 'web', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile Apps' },
  { value: 'ai', label: 'AI/ML' },
  { value: 'other', label: 'Other' },
];

export const FILE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedImages: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedDocs: ['application/pdf'],
};

export const SOCIAL_PLATFORMS = [
  { name: 'github', label: 'GitHub', icon: 'FaGithub' },
  { name: 'linkedin', label: 'LinkedIn', icon: 'FaLinkedin' },
  { name: 'twitter', label: 'Twitter', icon: 'FaTwitter' },
  { name: 'instagram', label: 'Instagram', icon: 'FaInstagram' },
  { name: 'facebook', label: 'Facebook', icon: 'FaFacebook' },
  { name: 'youtube', label: 'YouTube', icon: 'FaYoutube' },
];