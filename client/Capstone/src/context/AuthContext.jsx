import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
// Import Firebase auth
import { 
  GoogleAuthProvider, 
  signInWithPopup,
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
  const setToken = (token) => localStorage.setItem('token', token);
  const removeToken = () => localStorage.removeItem('token');

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      
      if (currentUser) {
        // User is signed in with Firebase
        try {
          // Get ID token from Firebase user
          const idToken = await currentUser.getIdToken();
          
          // You might want to send this token to your backend to verify and create a session
          // or use it directly for authentication
          setToken(idToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
          
          // Set user based on Firebase user info
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            authProvider: 'google'
          });
        } catch (error) {
          console.error("Firebase token error:", error);
        }
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Check traditional JWT auth
  useEffect(() => {
    const checkAuth = async () => {
      if (firebaseUser) return; // Skip if Firebase user is already set
      
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
  }, [firebaseUser]);

  // Google sign-in function
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // If you need to register the user in your backend
      // You can make an API call here using the Google user data
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
    } catch (error) {
      console.error("Google Sign-in error:", error);
      return false;
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