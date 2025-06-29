import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
// Import Firebase auth
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, app } from '../firebase/config';

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
        // First check for Google redirect result
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult?.user) {
          console.log("Processing Google redirect result:", redirectResult.user.email);
          
          // Send Google user data to backend for JWT token
          try {
            const response = await axios.post("/api/auth/google-auth", {
              email: redirectResult.user.email,
              displayName: redirectResult.user.displayName,
              photoURL: redirectResult.user.photoURL,
              uid: redirectResult.user.uid
            });
            
            if (response.data.success) {
              setToken(response.data.token);
              setUser(response.data.user);
              console.log("Google redirect authentication successful");
              setLoading(false);
              return;
            }
          } catch (backendError) {
            console.error("Backend communication error during redirect:", backendError);
            
            // Create temporary user session for redirect flow
            const tempUser = {
              id: redirectResult.user.uid,
              fullName: redirectResult.user.displayName || redirectResult.user.email.split('@')[0],
              email: redirectResult.user.email,
              profilePicture: redirectResult.user.photoURL,
              authProvider: 'google',
              isTemporary: true
            };
            
            localStorage.setItem('tempUser', JSON.stringify(tempUser));
            setUser(tempUser);
            console.log("Using temporary session for redirect due to backend unavailability");
            setLoading(false);
            return;
          }
        }
        
        // Then check for existing JWT token
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          // Verify token with backend
          try {
            const response = await axios.get("/api/auth/me");
            if (response.data.success) {
              setUser(response.data.user);
            } else {
              removeToken();
            }
          } catch (error) {
            console.error("Token verification failed:", error);
            removeToken();
            
            // Check for temporary user as fallback
            const tempUser = localStorage.getItem('tempUser');
            if (tempUser) {
              try {
                const parsedUser = JSON.parse(tempUser);
                setUser(parsedUser);
                console.log("Using temporary user session");
              } catch (parseError) {
                console.error("Failed to parse temporary user:", parseError);
                localStorage.removeItem('tempUser');
              }
            }
          }
        } else {
          // No token, check for temporary user
          const tempUser = localStorage.getItem('tempUser');
          if (tempUser) {
            try {
              const parsedUser = JSON.parse(tempUser);
              setUser(parsedUser);
              console.log("Using temporary user session");
            } catch (parseError) {
              console.error("Failed to parse temporary user:", parseError);
              localStorage.removeItem('tempUser');
            }
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

  // Enhanced Google sign-in function with better error handling
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // Check if auth is initialized
      if (!auth) {
        throw new Error("Firebase auth not initialized");
      }

      const provider = new GoogleAuthProvider();
      
      // Configure provider with additional parameters
      provider.setCustomParameters({
        prompt: 'select_account',
        include_granted_scopes: 'true',
        access_type: 'online'
      });

      // Add scopes
      provider.addScope('email');
      provider.addScope('profile');

      console.log("Attempting Google sign-in...");
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in result:", result);
      
      if (result.user) {
        console.log("User authenticated with Google:", result.user.email);
        
        // Send Google user data to backend for JWT token
        try {
          const response = await axios.post("/api/auth/google-auth", {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            uid: result.user.uid
          });
          
          if (response.data.success) {
            setToken(response.data.token);
            setUser(response.data.user);
            console.log("Google authentication successful");
            return { success: true };
          } else {
            console.error("Backend authentication failed:", response.data);
            return { success: false, message: response.data.message };
          }
        } catch (backendError) {
          console.error("Backend communication error:", backendError);
          
          // If backend is down, create a temporary user session
          // This allows the frontend to work even if backend is unavailable
          const tempUser = {
            id: result.user.uid,
            fullName: result.user.displayName || result.user.email.split('@')[0],
            email: result.user.email,
            profilePicture: result.user.photoURL,
            authProvider: 'google',
            isTemporary: true // Flag to indicate this is a temporary session
          };
          
          // Store temporary user data locally
          localStorage.setItem('tempUser', JSON.stringify(tempUser));
          setUser(tempUser);
          
          console.log("Using temporary session due to backend unavailability");
          return { 
            success: true, 
            message: "Signed in successfully (offline mode)",
            isTemporary: true
          };
        }
      }
      
      return { success: false, message: "Google sign-in failed - no user returned" };
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      // Handle specific Firebase errors
      let message = "Google sign-in failed";
      
      if (error.code) {
        switch (error.code) {
          case 'auth/popup-blocked':
            message = "Popup was blocked. Please allow popups and try again.";
            break;
          case 'auth/popup-closed-by-user':
            message = "Sign-in was cancelled.";
            break;
          case 'auth/cancelled-popup-request':
            message = "Another popup is already open.";
            break;
          case 'auth/internal-error':
            message = "Internal authentication error. Please check your internet connection and try again.";
            break;
          case 'auth/network-request-failed':
            message = "Network error. Please check your internet connection.";
            break;
          case 'auth/too-many-requests':
            message = "Too many requests. Please wait and try again.";
            break;
          case 'auth/unauthorized-domain':
            message = "This domain is not authorized for Google sign-in.";
            break;
          default:
            message = `Authentication error: ${error.message}`;
        }
      } else if (error.name === 'AxiosError' && error.code === 'ERR_NETWORK') {
        message = "Cannot connect to server. Please check if the server is running and try again.";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Alternative Google sign-in with redirect (fallback method)
  const signInWithGoogleRedirect = async () => {
    try {
      // Check if auth is initialized
      if (!auth) {
        throw new Error("Firebase auth not initialized");
      }

      const provider = new GoogleAuthProvider();
      
      // Configure provider with additional parameters
      provider.setCustomParameters({
        prompt: 'select_account',
        include_granted_scopes: 'true',
        access_type: 'online'
      });

      // Add scopes
      provider.addScope('email');
      provider.addScope('profile');

      console.log("Attempting Google sign-in with redirect...");
      await signInWithRedirect(auth, provider);
      // Note: The result will be handled in the useEffect hook via getRedirectResult
      
    } catch (error) {
      console.error("Google redirect sign-in error:", error);
      
      // Handle specific Firebase errors
      let message = "Google sign-in failed";
      
      if (error.code) {
        switch (error.code) {
          case 'auth/internal-error':
            message = "Internal authentication error. Please check your internet connection and try again.";
            break;
          case 'auth/network-request-failed':
            message = "Network error. Please check your internet connection.";
            break;
          case 'auth/too-many-requests':
            message = "Too many requests. Please wait and try again.";
            break;
          case 'auth/unauthorized-domain':
            message = "This domain is not authorized for Google sign-in.";
            break;
          default:
            message = `Authentication error: ${error.message}`;
        }
      } else if (error.message) {
        message = error.message;
      }
      
      throw new Error(message);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Clear JWT token and user state
      removeToken();
      localStorage.removeItem('tempUser'); // Also remove temporary user data
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if Firebase logout fails, clear local state
      removeToken();
      localStorage.removeItem('tempUser');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    signInWithGoogle,
    signInWithGoogleRedirect,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
