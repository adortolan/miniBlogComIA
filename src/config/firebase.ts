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
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
