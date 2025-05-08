import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create context
const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

// Set base URL
axios.defaults.baseURL = 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // JWT utility functions
  const setToken = (token) => localStorage.setItem('token', token);
  const removeToken = () => localStorage.removeItem('token');

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          // IMPORTANT: Use the CORRECT path with /api prefix
          const response = await axios.get("/api/auth/me");
          if (response.data.success) {
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function with correct API path
  const login = async (email, password) => {
    setLoading(true);
    try {
      // IMPORTANT: Use the CORRECT path with /api prefix
      const response = await axios.post("/api/auth/login", { email, password });
      
      console.log("Login response:", response.data);
      
      if (response.data.success) {
        const token = response.data.token;
        console.log("Token received:", token);
        
        if (token) {
          setToken(token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUser(response.data.user);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function with correct API path
  const register = async (username, email, password) => {
    setLoading(true);
    try {
      // IMPORTANT: Use the CORRECT path with /api prefix
      const response = await axios.post("/api/auth/register", {
        fullName: username,
        email, 
        password
      });
      
      console.log("Register response:", response.data);
      
      if (response.data.success) {
        const token = response.data.token;
        console.log("Token received:", token);
        
        if (token) {
          setToken(token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUser(response.data.user);
          return { success: true };
        }
      }
      
      return {
        success: false,
        message: response.data.message || "Registration failed"
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Server error"
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    removeToken();
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        currentUser: user // For backward compatibility
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};