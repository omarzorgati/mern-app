// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernapp-83647.firebaseapp.com",
  projectId: "mernapp-83647",
  storageBucket: "mernapp-83647.appspot.com",
  messagingSenderId: "417014726828",
  appId: "1:417014726828:web:ef195aea2378a93488df09",
  measurementId: "G-2YYPJGNVSJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

