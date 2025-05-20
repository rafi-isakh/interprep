// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCoXpYKwDVt_BgrnaGnN89Jk1fdMld9YWs",
    authDomain: "interprep-e2d98.firebaseapp.com",
    projectId: "interprep-e2d98",
    storageBucket: "interprep-e2d98.firebasestorage.app",
    messagingSenderId: "289385948093",
    appId: "1:289385948093:web:6e935f5ae4d094f88868d4",
    measurementId: "G-8HB675WYRF"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);