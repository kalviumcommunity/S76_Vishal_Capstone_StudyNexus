import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
// Import Firebase auth
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../firebase/config';

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
  const setToken = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };
  
  const removeToken = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common["Authorization"];
  };

  // Check for existing JWT token on app load
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          // Verify token with backend
          const response = await axios.get("/api/auth/me");
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            removeToken();
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

  // Traditional email/password login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    } finally {
      setLoading(false);
    }
  };

  // Traditional email/password registration
  const register = async (fullName, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/register", {
        fullName,
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Registration failed" 
      };
    } finally {
      setLoading(false);
    }
  };

  // Simplified Google sign-in function
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      
      // Configure provider
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // Send Google user data to backend for JWT token
        const response = await axios.post("/api/auth/google-auth", {
          idToken: await result.user.getIdToken(),
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        });
        
        if (response.data.success) {
          setToken(response.data.token);
          setUser(response.data.user);
          return { success: true };
        } else {
          return { success: false, message: response.data.message };
        }
      }
      
      return { success: false, message: "Google sign-in failed" };
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      // Handle specific errors
      let message = "Google sign-in failed";
      if (error.code === 'auth/popup-blocked') {
        message = "Popup was blocked. Please allow popups and try again.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        message = "Sign-in was cancelled.";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Clear JWT token and user state
      removeToken();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
