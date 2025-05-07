import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser, logout } from "../services/authService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout: contextLogout } = useAuth();

  // Fallback to service if context is not working
  const user = currentUser || getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    // Use context logout if available, otherwise use service
    if (contextLogout) {
      contextLogout();
    } else {
      logout();
    }
    navigate("/login");
  };

  if (!user) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome, {user.fullName || user.username || "User"}!
        </h2>
        <p className="mb-4">Email: {user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Your Study Groups</h3>
          <p className="text-gray-500">
            You haven't joined any study groups yet.
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Find Study Groups
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Sessions</h3>
          <p className="text-gray-500">No upcoming study sessions scheduled.</p>
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Create Study Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;