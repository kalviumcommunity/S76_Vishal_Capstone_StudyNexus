const admin = require('firebase-admin');

// Simplified initialization for development - no credentials required for initial testing
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // If using environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized with service account from env variable');
  } else {
    try {
      // Try to load from file if it exists
      const serviceAccount = require('./service-account-key.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin SDK initialized with service account from file');
    } catch (fileError) {
      // Initialize without credentials for development
      if (!admin.apps.length) {
        admin.initializeApp();
        console.log('Firebase Admin SDK initialized without credentials (development mode only)');
      }
    }
  }
} catch (error) {
  console.warn('Firebase Admin initialization warning:', error.message);
  // Initialize without credentials as fallback
  if (!admin.apps.length) {
    admin.initializeApp();
    console.log('Firebase Admin SDK initialized without credentials (fallback)');
  }
}

module.exports = admin;