import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
// Import Firebase auth
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged  
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
  const [firebaseUser, setFirebaseUser] = useState(null);

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
            setUser(response.data.user); // Fixed: direct user access
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

  // Listen for Firebase auth state changes (for Google Sign-in)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      
      if (currentUser && !user) {
        // User signed in with Firebase but we need to get JWT from backend
        try {
          const response = await axios.post("/api/auth/google-signin", {
            email: currentUser.email,
            fullName: currentUser.displayName,
            uid: currentUser.uid,
            photoURL: currentUser.photoURL
          });
          
          if (response.data.success) {
            setToken(response.data.token);
            setUser(response.data.user);
          }
        } catch (error) {
          console.error("Google auth backend error:", error);
        }
      }
    });

    // Check for redirect result on app load
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Redirect result:", result);
        }
      } catch (error) {
        console.error("Redirect result error:", error);
      }
    };

    handleRedirectResult();
    
    return () => unsubscribe();
  }, [user]);

  // Google sign-in function with popup blocking fallback
  const signInWithGoogle = async (useRedirect = false) => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      
      // Configure provider for better popup handling
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      let result;
      
      if (useRedirect) {
        // Use redirect method as fallback
        await signInWithRedirect(auth, provider);
        return true; // The result will be handled by getRedirectResult in useEffect
      } else {
        // Try popup first
        try {
          result = await signInWithPopup(auth, provider);
        } catch (popupError) {
          // Check if popup was blocked
          if (popupError.code === 'auth/popup-blocked' || 
              popupError.code === 'auth/cancelled-popup-request' ||
              popupError.message.includes('popup')) {
            console.log("Popup blocked, falling back to redirect...");
            // Fallback to redirect
            await signInWithRedirect(auth, provider);
            return true;
          } else {
            throw popupError; // Re-throw other errors
          }
        }
      }
      
      // If we get here, popup succeeded
      if (result) {
        // If you need to register the user in your backend
        try {
          const idToken = await result.user.getIdToken();
          
          // Optional: Call your backend to register/login the Google user
          const response = await axios.post("/api/auth/google-auth", { 
            idToken,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          });
          
          if (response.data.success && response.data.token) {
            setToken(response.data.token);
          } else {
            // Just use the Firebase token directly if no backend token
            setToken(idToken);
          }
          
          return true;
        } catch (backendError) {
          console.error("Backend registration error:", backendError);
          // Fall back to using Firebase token directly
          const idToken = await result.user.getIdToken();
          setToken(idToken);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Google Sign-in error:", error);
      
      // Provide more specific error messages
      if (error.code === 'auth/popup-blocked') {
        throw new Error("Popup was blocked by browser. Please allow popups and try again, or use the redirect option.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error("Sign-in was cancelled. Please try again.");
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error("Network error. Please check your internet connection.");
      } else {
        throw new Error(error.message || "Failed to sign in with Google");
      }
    } finally {
      setLoading(false);
    }
  };

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

  // Combined logout function
  const logout = async () => {
    try {
      // Firebase logout if available
      if (firebaseUser) {
        await firebaseSignOut(auth);
      }
      // Also clear traditional auth
      removeToken();
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        signInWithGoogle,
        isAuthenticated: !!user,
        currentUser: user // For backward compatibility
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};