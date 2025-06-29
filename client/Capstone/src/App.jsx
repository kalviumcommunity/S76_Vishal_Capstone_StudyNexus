import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Login from "./components/LoginPage";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import LearningStyleAssessment from "./components/LearningStyleAssessment";
import LearningStyleResults from "./components/LearningStyleResults";
import StudyGroups from "./components/StudyGroups";
import Resources from "./components/Resources";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading state if auth is still being checked
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Main app content
const AppContent = () => {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen px-4 py-6 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <LearningStyleAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <LearningStyleResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-groups"
            element={
              <ProtectedRoute>
                <StudyGroups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
      {/* JWT Debug component removed from here */}
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;