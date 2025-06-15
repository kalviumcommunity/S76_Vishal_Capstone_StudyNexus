import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if user has completed learning style assessment
    // If not, redirect to assessment
    if (!user.learningStyle) {
      navigate("/assessment");
    }
  }, [navigate, user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleTakeLearningAssessment = () => {
    navigate("/assessment");
  };

  const handleViewResults = () => {
    navigate("/results");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Welcome, {user.fullName || user.username || "User"}!
          </h2>
          <p className="mb-4 text-gray-600">Email: {user.email}</p>
          
          {user.learningStyle && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">
                <strong>Learning Style:</strong> {user.learningStyle}
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Learning Assessment Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Learning Style Assessment
            </h3>
            <p className="text-gray-600 mb-4">
              {user.learningStyle 
                ? "Retake your learning style assessment to update your profile." 
                : "Discover your learning style to get personalized study recommendations."
              }
            </p>
            <button
              onClick={handleTakeLearningAssessment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition-colors"
            >
              {user.learningStyle ? "Retake Assessment" : "Take Assessment"}
            </button>
          </div>

          {/* Results Card */}
          {user.learningStyle && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Assessment Results
              </h3>
              <p className="text-gray-600 mb-4">
                View your detailed learning style results and personalized recommendations.
              </p>
              <button
                onClick={handleViewResults}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full transition-colors"
              >
                View Results
              </button>
            </div>
          )}

          {/* Study Groups Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Study Groups
            </h3>
            <p className="text-gray-600 mb-4">
              Join or create study groups with other learners.
            </p>
            <button
              onClick={() => navigate("/study-groups")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg w-full transition-colors"
            >
              Explore Groups
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;