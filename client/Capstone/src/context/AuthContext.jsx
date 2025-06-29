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
          localStorage.removeItem('googleAuthPending'); // Clear pending flag
          
          const userData = {
            email: redirectResult.user.email,
            displayName: redirectResult.user.displayName,
            photoURL: redirectResult.user.photoURL,
            uid: redirectResult.user.uid
          };
          
          // Try to send to backend
          try {
            const response = await axios.post("/api/auth/google-auth", userData);
            
            if (response.data.success) {
              setToken(response.data.token);
              setUser(response.data.user);
              console.log("Google redirect authentication successful");
              setLoading(false);
              return;
            }
          } catch (backendError) {
            console.error("Backend communication error during redirect:", backendError);
          }
          
          // Fall back to client session if backend fails
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

        // Check if we were expecting a redirect result but didn't get one
        if (localStorage.getItem('googleAuthPending')) {
          console.log("Redirect authentication was cancelled or failed");
          localStorage.removeItem('googleAuthPending');
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
        localStorage.removeItem('googleAuthPending');
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

  // Enhanced Google sign-in function with comprehensive error handling
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // Check if auth is initialized
      if (!auth) {
        throw new Error("Firebase auth not initialized");
      }

      const provider = new GoogleAuthProvider();
      
      // Configure provider with minimal required parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // Add required scopes
      provider.addScope('email');
      provider.addScope('profile');

      console.log("Attempting Google sign-in...");
      
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupError) {
        console.log("Popup failed, trying redirect as fallback:", popupError.code);
        
        // If popup fails, automatically try redirect
        if (popupError.code === 'auth/popup-closed-by-user' || 
            popupError.code === 'auth/popup-blocked' ||
            popupError.code === 'auth/internal-error') {
          
          console.log("Switching to redirect method...");
          await signInWithRedirect(auth, provider);
          return { success: true, message: "Redirecting for Google sign-in..." };
        }
        
        throw popupError; // Re-throw other errors
      }
      
      console.log("Google sign-in result:", result);
      
      if (result?.user) {
        console.log("User authenticated with Google:", result.user.email);
        
        // Create user data object
        const userData = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          uid: result.user.uid
        };
        
        // Try to send to backend
        try {
          const response = await axios.post("/api/auth/google-auth", userData);
          
          if (response.data.success) {
            setToken(response.data.token);
            setUser(response.data.user);
            console.log("Google authentication successful with backend");
            return { success: true };
          } else {
            console.error("Backend authentication failed:", response.data);
            // Fall back to client-side session
            return await createClientSession(result.user, "Backend authentication failed, using client session");
          }
        } catch (backendError) {
          console.error("Backend communication error:", backendError);
          // Fall back to client-side session
          return await createClientSession(result.user, "Server unavailable, using offline mode");
        }
      }
      
      return { success: false, message: "Google sign-in failed - no user returned" };
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to create client-side session when backend is unavailable
  const createClientSession = async (firebaseUser, message) => {
    const tempUser = {
      id: firebaseUser.uid,
      fullName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      email: firebaseUser.email,
      profilePicture: firebaseUser.photoURL,
      authProvider: 'google',
      isTemporary: true
    };
    
    localStorage.setItem('tempUser', JSON.stringify(tempUser));
    setUser(tempUser);
    
    console.log("Created client-side session:", message);
    return { 
      success: true, 
      message: message,
      isTemporary: true
    };
  };

  // Helper function to handle authentication errors
  const handleAuthError = (error) => {
    let message = "Google sign-in failed";
    
    if (error.code) {
      switch (error.code) {
        case 'auth/popup-blocked':
          message = "Popup was blocked. Trying redirect method...";
          // Automatically attempt redirect
          setTimeout(() => signInWithGoogleRedirect().catch(console.error), 1000);
          break;
        case 'auth/popup-closed-by-user':
          message = "Sign-in was cancelled. You can try again or use the redirect option.";
          break;
        case 'auth/cancelled-popup-request':
          message = "Another sign-in is in progress. Please wait.";
          break;
        case 'auth/internal-error':
          message = "Internal error occurred. Trying redirect method...";
          setTimeout(() => signInWithGoogleRedirect().catch(console.error), 1000);
          break;
        case 'auth/network-request-failed':
          message = "Network error. Please check your connection.";
          break;
        case 'auth/too-many-requests':
          message = "Too many requests. Please wait a moment and try again.";
          break;
        case 'auth/unauthorized-domain':
          message = "This domain is not authorized. Please contact support.";
          break;
        case 'auth/operation-not-allowed':
          message = "Google sign-in is not enabled. Please contact support.";
          break;
        default:
          message = `Authentication error (${error.code}). Please try the redirect option.`;
      }
    } else if (error.name === 'AxiosError') {
      if (error.code === 'ERR_NETWORK') {
        message = "Cannot connect to server. Please check if the server is running.";
      } else {
        message = "Server error occurred. Please try again.";
      }
    } else if (error.message) {
      message = error.message;
    }
    
    return { success: false, message };
  };

  // Enhanced Google sign-in with redirect (fallback method)
  const signInWithGoogleRedirect = async () => {
    try {
      if (!auth) {
        throw new Error("Firebase auth not initialized");
      }

      const provider = new GoogleAuthProvider();
      
      // Configure provider with minimal parameters for redirect
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      provider.addScope('email');
      provider.addScope('profile');

      console.log("Attempting Google sign-in with redirect...");
      
      // Store a flag to indicate we're expecting a redirect result
      localStorage.setItem('googleAuthPending', 'true');
      
      await signInWithRedirect(auth, provider);
      // Note: The result will be handled in the useEffect hook via getRedirectResult
      
    } catch (error) {
      console.error("Google redirect sign-in error:", error);
      localStorage.removeItem('googleAuthPending');
      throw error;
    }
  };

  // Comprehensive logout function
  const logout = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Firebase logout error:", error);
    }
    
    // Clear all local storage data regardless of Firebase logout result
    removeToken();
    localStorage.removeItem('tempUser');
    localStorage.removeItem('googleAuthPending');
    setUser(null);
    
    console.log("User logged out successfully");
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
