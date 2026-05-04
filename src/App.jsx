import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';

// Layout Components
import Layout from './components/Layout/Layout';

// Loading Spinner
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const ResearchPage = lazy(() => import('./pages/ResearchPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Admin Pages
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

function App() {
  console.log('🚀 Portfolio App Loaded - v2.0');

  return (
    <HelmetProvider>
      {/* ✅ ThemeProvider must wrap everything for dark mode */}
      <ThemeProvider>
        {/* ✅ AuthProvider for authentication state */}
        <AuthProvider>
          {/* ✅ DataProvider for settings, projects, blogs, etc. */}
          <DataProvider>
            <Router>
              {/* Toast notifications */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />

              {/* Lazy loading with Suspense */}
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* ==================== PUBLIC ROUTES ==================== */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="projects/:id" element={<ProjectDetailPage />} />
                    <Route path="blog" element={<BlogPage />} />
                    <Route path="blog/:slug" element={<BlogDetailPage />} />
                    <Route path="research" element={<ResearchPage />} />
                    <Route path="contact" element={<ContactPage />} />
                  </Route>

                  {/* ==================== AUTH ROUTES ==================== */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                  {/* ==================== ADMIN ROUTES ==================== */}
                  <Route path="/admin/*" element={<AdminPage />} />

                  {/* ==================== 404 CATCH ALL ==================== */}
                  <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">404</h1>
                        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Page Not Found</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
                        <a href="/" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                          Go Home
                        </a>
                      </div>
                    </div>
                  } />
                </Routes>
              </Suspense>
            </Router>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;