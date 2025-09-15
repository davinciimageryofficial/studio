// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "sentry-supabase-32172921-b26f1",
  "appId": "1:427607387035:web:586bcd94ca0f4da5784f3e",
  "storageBucket": "sentry-supabase-32172921-b26f1.firebasestorage.app",
  "apiKey": "AIzaSyA7ElqO-IgVETyoUkNbafxC9Ekfw-yagIo",
  "authDomain": "sentry-supabase-32172921-b26f1.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "427607387035"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
