import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate Firebase configuration
const requiredFields: (keyof typeof firebaseConfig)[] = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field]);

if (missingFields.length > 0) {
  throw new Error(
    `Firebase configuration incomplete. Missing fields: ${missingFields.join(', ')}. ` +
    'Please check your .env file and ensure all required Firebase environment variables are set.'
  );
}

// Validate that none of the fields are empty strings
const emptyFields = requiredFields.filter(field => firebaseConfig[field] === '' || firebaseConfig[field] === 'undefined');

if (emptyFields.length > 0) {
  throw new Error(
    `Firebase configuration invalid. Empty fields found: ${emptyFields.join(', ')}. ` +
    'Please check your .env file and ensure all Firebase environment variables have valid values.'
  );
}

// Initialize Firebase with enhanced error handling
let app: ReturnType<typeof initializeApp>;
try {
  app = initializeApp(firebaseConfig);
  
  // Log successful initialization (only in development)
  if (import.meta.env.DEV) {
    console.log('✅ Firebase initialized successfully');
    console.log('📋 Project ID:', firebaseConfig.projectId);
    console.log('🌐 Auth Domain:', firebaseConfig.authDomain);
  }
} catch (error) {
  if (error instanceof Error) {
    // Enhanced CORS error handling
    if (error.message.includes('CORS') || error.message.includes('fetch') || error.message.includes('network')) {
      throw new Error(
        '❌ Firebase Connection Error (CORS/Network): ' +
        '\n\nPossible solutions:' +
        '\n1. 🔐 Authorize domain in Firebase Console:' +
        '\n   - Go to: https://console.firebase.google.com/' +
        '\n   - Navigate to: Authentication > Settings > Authorized Domains' +
        '\n   - Add: localhost and your production domain' +
        '\n\n2. 🌐 Check your network connection and proxy settings' +
        '\n\n3. ⚙️ Verify Firebase configuration in .env file' +
        '\n\n4. 🔄 Try restarting your dev server: npm run dev' +
        `\n\nOriginal error: ${error.message}`
      );
    }
    throw error;
  }
  throw error;
}

export const auth = getAuth(app);
export const db = getFirestore(app);
