import { useState } from 'react';
import Register from './Register';
import Login from './Login';
import MainScreen from './MainScreen';

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'main'>('login');

  return (
    <>
      {currentPage === 'login' && <Login onNavigate={(page) => setCurrentPage(page as any)} />}
      {currentPage === 'register' && <Register onNavigate={(page) => setCurrentPage(page as any)} />}
      {currentPage === 'main' && <MainScreen />}
    </>
  )
}

export default App;
