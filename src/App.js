import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Layout components
import Layout from "./components/Layout/Layout";
import AdminLayout from "./components/Admin/AdminLayout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import LoadingSpinner from "./components/UI/LoadingSpinner";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Admin/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Blogs = lazy(() => import("./pages/Admin/Blogs"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Research = lazy(() => import("./pages/Research"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/Admin/About"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/Admin/Login"));
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AdminProjects = lazy(() => import("./pages/Admin/Projects"));
const AdminBlogs = lazy(() => import("./pages/Admin/Blogs"));
const AdminSettings = lazy(() => import("./pages/Admin/Settings"));

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />

            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/:id" element={<ProjectDetail />} />
                  <Route path="blogs" element={<Blogs />} />
                  <Route path="blogs/:slug" element={<BlogDetail />} />
                  <Route path="research" element={<Research />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="about" element={<About />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="blogs" element={<AdminBlogs />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
