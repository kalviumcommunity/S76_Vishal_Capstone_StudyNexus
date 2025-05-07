import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContextDefinition";
import * as authService from "../services/authService";

// Add this hook to use the context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load/refresh
  useEffect(() => {
    const loggedInUser = authService.getCurrentUser();
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setCurrentUser(result.user);
    }
    return result.success;
  };

  // Register function
  const register = async (username, email, password) => {
    const result = await authService.register(username, email, password);
    if (result.success) {
      setCurrentUser(result.user);
    }
    return result;
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};