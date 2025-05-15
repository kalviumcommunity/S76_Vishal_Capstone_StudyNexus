import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCqRW1pedET4TshmBDjhYn8v3dXK9IxIE",
  authDomain: "studynexus-c84ba.firebaseapp.com",
  projectId: "studynexus-c84ba",
  storageBucket: "studynexus-c84ba.firebasestorage.app",
  messagingSenderId: "200919600873",
  appId: "1:200919600873:web:056f6839b0d77ba8de2a78",
//   measurementId: "G-55MYNLB0SY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };