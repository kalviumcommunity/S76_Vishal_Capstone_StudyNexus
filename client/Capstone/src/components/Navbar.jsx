import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/studynexus-logo.png"; // Adjust path as needed

const Navbar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const scrollToFeatures = (e) => {
    // Only work on homepage
    if (location.pathname !== '/') {
      return;
    }
    
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // For non-homepage, navigate to homepage and then scroll
  const featuresLink = location.pathname === '/' 
    ? <a href="#features" onClick={scrollToFeatures} className="text-lg text-gray-800 hover:text-gray-600">Features</a>
    : <Link to="/?scrollTo=features" className="text-lg text-gray-800 hover:text-gray-600">Features</Link>;

  return (
    <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-center">
        <div className="mr-3">
          {logoImage ? (
            <img src={logoImage} alt="StudyNexus" className="w-10 h-10" />
          ) : (
            <svg
              className="w-8 h-8 text-black"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="12" r="8" fill="black" />
            </svg>
          )}
        </div>
        <h1 className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-600">
            StudyNexus
          </Link>
        </h1>
      </div>

      <div className="flex items-center space-x-10">
        {featuresLink}
        {currentUser ? (
          <>
            <Link
              to="/dashboard"
              className="text-lg text-gray-800 hover:text-gray-600"
            >
              Dashboard
            </Link>
            <span className="text-lg text-gray-800">
              Hello, {currentUser.username || "User"}
            </span>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-lg text-gray-800 hover:text-gray-600"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="text-lg text-gray-800 hover:text-gray-600"
            >
              Sign Up
            </Link>
          </>
        )}
        <button className="bg-[#00EACC] text-black text-lg px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition">
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;