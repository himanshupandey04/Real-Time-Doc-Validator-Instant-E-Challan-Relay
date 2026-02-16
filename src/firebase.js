// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDOUTVi7voP2JhmF96tPuF52QLrWnaeTiY",
    authDomain: "ecr-anpr.firebaseapp.com",
    projectId: "ecr-anpr",
    storageBucket: "ecr-anpr.firebasestorage.app",
    messagingSenderId: "599545356583",
    appId: "1:599545356583:web:351c502741e50dec5b4902",
    measurementId: "G-BX9DT7REBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
