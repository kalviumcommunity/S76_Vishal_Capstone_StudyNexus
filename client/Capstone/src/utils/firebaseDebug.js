// Firebase Auth Debug Utility
export const debugFirebaseAuth = () => {
  console.log('=== Firebase Auth Debug Info ===');
  console.log('Current URL:', window.location.href);
  console.log('Current Origin:', window.location.origin);
  console.log('User Agent:', navigator.userAgent);
  console.log('Is Localhost:', window.location.hostname === 'localhost');
  console.log('Port:', window.location.port);
  
  // Check if we're in development
  const isDev = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' ||
                window.location.hostname.includes('local');
  
  console.log('Is Development:', isDev);
  
  if (isDev) {
    console.log('Development mode detected - some Firebase features may be limited');
    console.log('Make sure localhost is authorized in Firebase Console > Authentication > Settings > Authorized Domains');
  }
  
  console.log('=== End Debug Info ===');
};

// Call this function to get debug info
export const logAuthEnvironment = () => {
  debugFirebaseAuth();
};
