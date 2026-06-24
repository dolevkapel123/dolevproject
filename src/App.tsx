import { useState, useEffect } from 'react';
import { auth, getUserStats, updateUserStats } from './firebase';
import Register from './Register';
import Login from './Login';
import MainScreen from './MainScreen';
import DifficultyScreen from './DifficultyScreen';
import PianoTrainer from './PianoTrainer';

type Page = 'login' | 'register' | 'main' | 'difficulty' | 'piano';
type Difficulty = 'novice' | 'apprentice' | 'adept' | 'expert' | 'master';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('novice');
  const [expertSessionsCompleted, setExpertSessionsCompleted] = useState<number>(0);

  // Load completed expert sessions count from Firestore / fallback cache
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const stats = await getUserStats(user.uid);
        setExpertSessionsCompleted(stats.expertSessionsCompleted);
      } else {
        setExpertSessionsCompleted(0);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleCompleteExpertSession = async () => {
    const newVal = expertSessionsCompleted + 1;
    setExpertSessionsCompleted(newVal);
    
    // Update in Firestore (which also updates local storage)
    const user = auth.currentUser;
    if (user) {
      await updateUserStats(user.uid, { expertSessionsCompleted: newVal });
    }
  };

  return (
    <>
      {currentPage === 'login' && <Login onNavigate={(page) => setCurrentPage(page as Page)} />}
      {currentPage === 'register' && <Register onNavigate={(page) => setCurrentPage(page as Page)} />}
      {currentPage === 'main' && <MainScreen onNavigate={(page) => setCurrentPage(page as Page)} />}
      {currentPage === 'difficulty' && (
        <DifficultyScreen 
          onNavigate={(page) => setCurrentPage(page as Page)} 
          expertSessionsCompleted={expertSessionsCompleted}
          onSelectDifficulty={(diff) => {
            setSelectedDifficulty(diff);
            setCurrentPage('piano');
          }}
        />
      )}
      {currentPage === 'piano' && (
        <PianoTrainer 
          onNavigate={(page) => setCurrentPage(page as Page)} 
          difficulty={selectedDifficulty}
          onCompleteExpertSession={handleCompleteExpertSession}
        />
      )}
    </>
  )
}

export default App;
