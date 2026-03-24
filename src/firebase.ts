import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBayvK67_kAnX8PHLu5PMFP-1wkGYrdW4I",
  authDomain: "eartrainerdolev.firebaseapp.com",
  projectId: "eartrainerdolev",
  storageBucket: "eartrainerdolev.firebasestorage.app",
  messagingSenderId: "804919146330",
  appId: "1:804919146330:web:5f01ca834644b5342ca563",
  measurementId: "G-0DVW7Y088C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };
