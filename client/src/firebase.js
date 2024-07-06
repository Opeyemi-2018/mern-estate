// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-app-d3602.firebaseapp.com",
  projectId: "estate-app-d3602",
  storageBucket: "estate-app-d3602.appspot.com",
  messagingSenderId: "434791164033",
  appId: "1:434791164033:web:dc23ceb461fed908e34580"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);