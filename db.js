// Firebase initialization for Brickell Payroll (shared by employee.html and admin.html).
// The web config below is PUBLIC by design — access is controlled by Firestore
// security rules + login, not by hiding these values.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqFlziYcDotKpvywAMxLHxEGEz_J4OUfM",
  authDomain: "payroll-a5d44.firebaseapp.com",
  projectId: "payroll-a5d44",
  storageBucket: "payroll-a5d44.firebasestorage.app",
  messagingSenderId: "875982909160",
  appId: "1:875982909160:web:acea0ae9581afdee6a635d"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// The one admin login. Anyone signed in with this email is treated as the admin
// (see firestore.rules). Everyone else is an employee restricted to their own data.
export const ADMIN_EMAIL = "admin@brickellmg.com";
