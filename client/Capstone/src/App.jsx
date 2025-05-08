import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Login from "./components/LoginPage";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

// JWT Debug Component - Add this to check token generation
const JwtDebug = () => {
  const token = localStorage.getItem('token');
  
  return (
    <div className="fixed bottom-0 right-0 bg-black text-white p-2 m-2 rounded text-xs max-w-xs opacity-70 hover:opacity-100">
      <p><strong>JWT Status:</strong> {token ? '✅ Token Found' : '❌ No Token'}</p>
      <p className="truncate">{token ? `Token: ${token.slice(0, 20)}...` : 'Not logged in'}</p>
      <button 
        className="bg-blue-500 px-2 py-1 rounded mt-1" 
        onClick={() => console.log('Full token:', token)}
      >
        Log Token
      </button>
    </div>
  );
};

// Protected Route component - Updated to use isAuthenticated
const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();
  
  // Show loading state if auth is still being checked
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Wrap entire app with AuthProvider
const AppWithAuth = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

// Main app content
const AppContent = () => {
  const { user } = useAuth();
  
  // Log authentication status on each render
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Auth status:', { 
      user: user ? 'Logged in' : 'Not logged in',
      token: token ? 'Token exists' : 'No token'
    });
  }, [user]);
  
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen px-4 py-6 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
      <JwtDebug /> {/* Add the debug component */}
    </Router>
  );
};

export default AppWithAuth;