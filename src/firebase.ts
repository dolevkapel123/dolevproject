import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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
const db = getFirestore(app);

export interface UserStats {
  correctGuesses: number;
  incorrectGuesses: number;
  totalSessions: number;
  dailyStreak: number;
  expertSessionsCompleted: number;
  lastSessionDate: string;
}

export const defaultStats: UserStats = {
  correctGuesses: 0,
  incorrectGuesses: 0,
  totalSessions: 0,
  dailyStreak: 0,
  expertSessionsCompleted: 0,
  lastSessionDate: "",
};

// Load stats from Firestore and save to localStorage
export async function syncFirestoreStatsToLocal(uid: string) {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      const stats = data.stats || defaultStats;
      localStorage.setItem('et_guessed_true', (stats.correctGuesses ?? 0).toString());
      localStorage.setItem('et_guessed_false', (stats.incorrectGuesses ?? 0).toString());
      localStorage.setItem('et_total_sessions', (stats.totalSessions ?? 0).toString());
      localStorage.setItem('et_daily_streak', (stats.dailyStreak ?? 0).toString());
      localStorage.setItem('et_expert_sessions_completed', (stats.expertSessionsCompleted ?? 0).toString());
      localStorage.setItem('et_last_session_date', stats.lastSessionDate ?? "");
      return stats;
    }
  } catch (err) {
    console.error("Error syncing Firestore stats to local:", err);
  }
  return null;
}

// Save stats from localStorage to Firestore
export async function syncLocalStatsToFirestore(uid: string) {
  try {
    const correct = parseInt(localStorage.getItem('et_guessed_true') || '0', 10);
    const incorrect = parseInt(localStorage.getItem('et_guessed_false') || '0', 10);
    const sessions = parseInt(localStorage.getItem('et_total_sessions') || '0', 10);
    const streak = parseInt(localStorage.getItem('et_daily_streak') || '0', 10);
    const expert = parseInt(localStorage.getItem('et_expert_sessions_completed') || '0', 10);
    const lastSession = localStorage.getItem('et_last_session_date') || "";

    const stats: UserStats = {
      correctGuesses: correct,
      incorrectGuesses: incorrect,
      totalSessions: sessions,
      dailyStreak: streak,
      expertSessionsCompleted: expert,
      lastSessionDate: lastSession
    };

    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, { stats }, { merge: true });
  } catch (err) {
    console.error("Error syncing local stats to Firestore:", err);
  }
}

export { app, analytics, auth, googleProvider, db };
