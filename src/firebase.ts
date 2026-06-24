import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, increment, updateDoc, deleteField } from "firebase/firestore";

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

// Local storage key mapping for fallback cache
const LOCAL_KEYS = {
  correctGuesses: 'et_guessed_true',
  incorrectGuesses: 'et_guessed_false',
  totalSessions: 'et_total_sessions',
  dailyStreak: 'et_daily_streak',
  expertSessionsCompleted: 'et_expert_sessions_completed',
  lastSessionDate: 'et_last_session_date'
};

// Load stats directly from Firestore, with LocalStorage fallback
export async function getUserStats(uid: string): Promise<UserStats> {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      const nestedStats = data.stats || {};
      
      // Collect values from incorrect root-level dot-notation fields (e.g. "stats.correctGuesses")
      const rootDotStats: Record<string, any> = {};
      let hasIncorrectKeys = false;
      
      Object.keys(LOCAL_KEYS).forEach((key) => {
        const dotKey = `stats.${key}`;
        if (dotKey in data) {
          rootDotStats[key] = data[dotKey];
          hasIncorrectKeys = true;
        }
      });

      const mergedStats = { ...defaultStats } as any;

      // Merge and clean nested, incorrect root-level dot-keys, and local storage values
      Object.keys(LOCAL_KEYS).forEach((key) => {
        const k = key as keyof UserStats;
        const defaultVal = defaultStats[k];
        const nestedVal = nestedStats[k];
        const rootDotVal = rootDotStats[key];
        const localVal = localStorage.getItem(LOCAL_KEYS[key as keyof UserStats]);

        if (typeof defaultVal === 'number') {
          let cleanNested = typeof nestedVal === 'number' ? (isNaN(nestedVal) ? 0 : nestedVal) : 0;
          let cleanRootDot = typeof rootDotVal === 'number' ? (isNaN(rootDotVal) ? 0 : rootDotVal) : 0;
          let cleanLocal = parseInt(localVal || '0', 10);
          if (isNaN(cleanLocal)) cleanLocal = 0;

          mergedStats[k] = Math.max(cleanNested, cleanRootDot, cleanLocal);
        } else {
          mergedStats[k] = (nestedVal || rootDotVal || localVal || defaultVal);
        }
      });

      // If incorrect dot-keys or NaNs were found in Firestore, perform database cleanup
      if (hasIncorrectKeys || isNaN(nestedStats.correctGuesses) || isNaN(nestedStats.incorrectGuesses)) {
        const cleanupData: Record<string, any> = {
          stats: mergedStats
        };
        // Set all incorrect root-level dot keys to deleteField()
        Object.keys(LOCAL_KEYS).forEach((key) => {
          const dotKey = `stats.${key}`;
          if (dotKey in data) {
            cleanupData[dotKey] = deleteField();
          }
        });

        await updateDoc(userDocRef, cleanupData);
      }

      // Update local storage fallback cache
      Object.entries(LOCAL_KEYS).forEach(([key, localKey]) => {
        localStorage.setItem(localKey, (mergedStats[key as keyof UserStats] ?? defaultStats[key as keyof UserStats]).toString());
      });

      return mergedStats;
    }
  } catch (err) {
    console.error("Error fetching and self-healing user stats from Firestore:", err);
  }

  // Fallback to local storage values (defensively parsing NaN)
  const getLocalInt = (key: string) => {
    const val = parseInt(localStorage.getItem(key) || '0', 10);
    return isNaN(val) ? 0 : val;
  };

  return {
    correctGuesses: getLocalInt(LOCAL_KEYS.correctGuesses),
    incorrectGuesses: getLocalInt(LOCAL_KEYS.incorrectGuesses),
    totalSessions: getLocalInt(LOCAL_KEYS.totalSessions),
    dailyStreak: getLocalInt(LOCAL_KEYS.dailyStreak),
    expertSessionsCompleted: getLocalInt(LOCAL_KEYS.expertSessionsCompleted),
    lastSessionDate: localStorage.getItem(LOCAL_KEYS.lastSessionDate) || ""
  };
}

// Save stats directly to Firestore, also updating the LocalStorage fallback cache
export async function updateUserStats(uid: string, stats: Partial<UserStats>) {
  // Update local storage fallback cache synchronously for instant responsiveness
  Object.entries(stats).forEach(([key, val]) => {
    const localKey = LOCAL_KEYS[key as keyof UserStats];
    if (localKey) {
      const cleanVal = typeof val === 'number' && isNaN(val) ? 0 : val;
      localStorage.setItem(localKey, cleanVal.toString());
    }
  });

  try {
    const userDocRef = doc(db, "users", uid);
    
    // Construct dot-notation updates to prevent overwriting other subfields in the stats map
    const updateObj: Record<string, any> = {};
    Object.entries(stats).forEach(([key, val]) => {
      const cleanVal = typeof val === 'number' && isNaN(val) ? 0 : val;
      updateObj[`stats.${key}`] = cleanVal;
    });

    await updateDoc(userDocRef, updateObj);
  } catch (err) {
    console.error("Error updating user stats in Firestore:", err);
  }
}

// Atomically increment specific numeric fields in Firestore, also updating the LocalStorage fallback cache synchronously
export async function incrementUserStats(uid: string, fields: { correctGuesses?: number; incorrectGuesses?: number }) {
  // Update local storage fallback cache synchronously first
  Object.entries(fields).forEach(([key, val]) => {
    const localKey = LOCAL_KEYS[key as keyof UserStats];
    if (localKey) {
      let current = parseInt(localStorage.getItem(localKey) || '0', 10);
      if (isNaN(current)) current = 0;
      const cleanVal = typeof val === 'number' && isNaN(val) ? 0 : val;
      localStorage.setItem(localKey, (current + cleanVal).toString());
    }
  });

  try {
    const userDocRef = doc(db, "users", uid);

    // Construct dot-notation updates with FieldValue.increment
    const updateObj: Record<string, any> = {};
    Object.entries(fields).forEach(([key, val]) => {
      const cleanVal = typeof val === 'number' && isNaN(val) ? 0 : val;
      updateObj[`stats.${key}`] = increment(cleanVal);
    });

    await updateDoc(userDocRef, updateObj);
  } catch (err) {
    console.error("Error atomically incrementing user stats in Firestore:", err);
  }
}


export { app, analytics, auth, googleProvider, db };
