import { useState, useEffect } from 'react';
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

  // Load completed expert sessions count from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('et_expert_sessions_completed');
    if (saved) {
      setExpertSessionsCompleted(parseInt(saved, 10) || 0);
    }
  }, []);

  const handleCompleteExpertSession = () => {
    const newVal = expertSessionsCompleted + 1;
    setExpertSessionsCompleted(newVal);
    localStorage.setItem('et_expert_sessions_completed', newVal.toString());
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
