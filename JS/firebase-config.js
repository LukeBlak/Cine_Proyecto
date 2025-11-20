// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// ✅ Configuración del proyecto cinestar727-be9fd
const firebaseConfig = {
  apiKey: "AIzaSyBHO8P3JMwu2X60NRH8HNV-2jVT1cgzuH4",
  authDomain: "cinestar727-be9fd.firebaseapp.com",
  projectId: "cinestar727-be9fd",
  storageBucket: "cinestar727-be9fd.firebasestorage.app",
  messagingSenderId: "648304002060",
  appId: "1:648304002060:web:d460d7b1d8958a8d319a29"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);