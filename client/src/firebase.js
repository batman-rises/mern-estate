// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-e8d4e.firebaseapp.com",
  projectId: "mern-estate-e8d4e",
  storageBucket: "mern-estate-e8d4e.firebasestorage.app",
  messagingSenderId: "76084357339",
  appId: "1:76084357339:web:56d0f38c64baa3f7fb84fe",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
