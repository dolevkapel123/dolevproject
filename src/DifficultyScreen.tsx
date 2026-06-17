interface DifficultyScreenProps {
  onNavigate: (page: 'login' | 'register' | 'main' | 'difficulty' | 'piano') => void;
  onSelectDifficulty?: (difficulty: 'novice' | 'apprentice' | 'adept' | 'expert' | 'master') => void;
  expertSessionsCompleted: number;
}

const DifficultyScreen = ({ onNavigate, onSelectDifficulty, expertSessionsCompleted }: DifficultyScreenProps) => {
  const handleSelect = (difficulty: 'novice' | 'apprentice' | 'adept' | 'expert' | 'master') => {
    console.log(`Difficulty chosen: ${difficulty}`);
    if (onSelectDifficulty) {
      onSelectDifficulty(difficulty);
    }
  };

  const isMasterUnlocked = expertSessionsCompleted >= 10;
  const progressPercentage = Math.min((expertSessionsCompleted / 10) * 100, 100);

  return (
    <div className="bg-background text-on-background font-body selection:bg-primary/30 min-h-screen relative overflow-x-hidden">
      <style>
        {`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-card {
          background: rgba(38, 37, 41, 0.4);
          backdrop-filter: blur(12px);
        }
        .locked-overlay {
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0, 0, 0, 0.2) 10px,
            rgba(0, 0, 0, 0.2) 20px
          );
        }
        body {
          min-height: max(884px, 100dvh);
        }
        `}
      </style>

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0e0e10]/60 backdrop-blur-xl flex items-center px-6 py-4 justify-between">
        <button 
          onClick={() => onNavigate('main')} 
          className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center text-on-background cursor-pointer"
          title="Back to Dashboard"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        <div className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          <span className="text-2xl font-bold tracking-tighter text-purple-400 italic font-headline">EAR TRAINER</span>
        </div>
        
        <div className="w-10"></div> {/* Spacer to keep the title perfectly centered */}
        
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-12">
          <p className="font-label text-primary font-black tracking-[0.2em] text-[10px] uppercase mb-2">Select Difficulty</p>
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-on-background uppercase">
            CHOOSE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-dim">DIFFICULTY</span>
          </h1>
        </div>

        {/* Bento Grid Difficulty Selection */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Novice Card */}
          <button 
            onClick={() => handleSelect('novice')}
            className="md:col-span-3 h-64 relative group overflow-hidden rounded-xl bg-surface-container-low transition-all duration-300 hover:ring-2 ring-primary/50 text-left p-8 cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl" data-icon="radio_button_checked">radio_button_checked</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="material-symbols-outlined" data-icon="radio_button_checked">radio_button_checked</span>
                </div>
                <h3 className="font-headline text-3xl font-bold text-on-background">Novice</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label text-[10px] font-black tracking-widest text-primary uppercase">Unlock the Basics</span>
                <span className="material-symbols-outlined text-primary text-sm" data-icon="arrow_forward">arrow_forward</span>
              </div>
            </div>
          </button>

          {/* Apprentice Card */}
          <button 
            onClick={() => handleSelect('apprentice')}
            className="md:col-span-3 h-64 relative group overflow-hidden rounded-xl bg-surface-container-low transition-all duration-300 hover:ring-2 ring-primary/50 text-left p-8 cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl" data-icon="humidity_low">humidity_low</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="material-symbols-outlined" data-icon="humidity_low">humidity_low</span>
                </div>
                <h3 className="font-headline text-3xl font-bold text-on-background">Apprentice</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label text-[10px] font-black tracking-widest text-primary uppercase">Develop your ear</span>
                <span className="material-symbols-outlined text-primary text-sm" data-icon="arrow_forward">arrow_forward</span>
              </div>
            </div>
          </button>

          {/* Adept Card */}
          <button 
            onClick={() => handleSelect('adept')}
            className="md:col-span-2 h-72 relative group overflow-hidden rounded-xl bg-surface-container-low transition-all duration-300 hover:ring-2 ring-primary/50 text-left p-8 cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl" data-icon="waves">waves</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="material-symbols-outlined" data-icon="waves">waves</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-background">Adept</h3>
              </div>
              <span className="font-label text-[10px] font-black tracking-widest text-primary uppercase">Mid-tier challenge</span>
            </div>
          </button>

          {/* Expert Card */}
          <button 
            onClick={() => handleSelect('expert')}
            className="md:col-span-2 h-72 relative group overflow-hidden rounded-xl bg-surface-container-low transition-all duration-300 hover:ring-2 ring-primary/50 text-left p-8 cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl" data-icon="bolt">bolt</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="material-symbols-outlined" data-icon="bolt">bolt</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-background">Expert</h3>
              </div>
              <span className="font-label text-[10px] font-black tracking-widest text-primary uppercase">Pro performance</span>
            </div>
          </button>

          {/* Master Card (Conditional Unlocked / Locked) */}
          {isMasterUnlocked ? (
            <button 
              onClick={() => handleSelect('master')}
              className="md:col-span-2 h-72 relative group overflow-hidden rounded-xl bg-surface-container-low transition-all duration-300 hover:ring-2 ring-primary/50 text-left p-8 cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-8xl" data-icon="workspace_premium">workspace_premium</span>
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-4">
                    <span className="material-symbols-outlined" data-icon="workspace_premium">workspace_premium</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-on-background">Master</h3>
                </div>
                <span className="font-label text-[10px] font-black tracking-widest text-primary uppercase">Infinite multi-octave challenge</span>
              </div>
            </button>
          ) : (
            <div className="md:col-span-2 h-72 relative group overflow-hidden rounded-xl bg-surface-container-lowest border border-outline-variant/10 text-left p-8 cursor-not-allowed">
              <div className="absolute inset-0 locked-overlay opacity-30"></div>
              <div className="relative z-10 flex flex-col h-full justify-between grayscale opacity-50">
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-outline-variant/20 text-on-surface-variant mb-4">
                    <span className="material-symbols-outlined" data-icon="lock">lock</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface-variant">Master</h3>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label text-[10px] font-black tracking-widest text-on-surface-variant uppercase">Locked</span>
                  <span className="font-label text-[9px] font-medium tracking-tight text-outline uppercase">
                    Complete 10 sessions of Expert to unlock ({expertSessionsCompleted}/10)
                  </span>
                </div>
              </div>
              {/* Progress Bar at bottom of locked card */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-variant">
                <div 
                  className="h-full bg-primary/70 transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Background Decorative Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-secondary-container/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
    </div>
  );
};

export default DifficultyScreen;
