import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCqRW1pedET4TshmBDjhYn8v3dXK9IxIE",
  authDomain: "studynexus-c84ba.firebaseapp.com",
  projectId: "studynexus-c84ba",
  storageBucket: "studynexus-c84ba.firebasestorage.app",
  messagingSenderId: "200919600873",
  appId: "1:200919600873:web:056f6839b0d77ba8de2a78"
  // measurementId is optional for basic auth
};

// Validate Firebase configuration
const validateConfig = (config) => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missing = requiredFields.filter(field => !config[field]);
  
  if (missing.length > 0) {
    console.error('Missing required Firebase config fields:', missing);
    throw new Error(`Firebase configuration missing: ${missing.join(', ')}`);
  }
  
  console.log('Firebase config validation passed');
  return true;
};

// Initialize Firebase
let app;
let auth;

try {
  validateConfig(firebaseConfig);
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Configure auth settings
  auth.languageCode = 'en';
  
  console.log('Firebase initialized successfully');
  console.log('Auth domain:', firebaseConfig.authDomain);
  console.log('Project ID:', firebaseConfig.projectId);
  
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { auth, app };