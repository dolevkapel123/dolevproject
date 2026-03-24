const Data = () => {
  return (
    <div className="bg-background text-on-background font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen pb-36">
      <style>
        {`
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(25, 25, 28, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        body {
            min-height: max(884px, 100dvh);
        }
        `}
      </style>

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0e0e10]/60 backdrop-blur-xl bg-gradient-to-b from-purple-500/10 to-transparent shadow-none">
        <div className="flex items-center px-6 py-4 w-full justify-center">
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-label text-primary font-black tracking-widest uppercase text-[10px] mb-2 block">Performance Analytics</span>
              <h2 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-on-background">DATA CENTER</h2>
            </div>
          </div>
        </section>

        {/* Bento Grid Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          {/* Accuracy Percentage */}
          <div className="md:col-span-8 glass-panel rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <span className="font-label text-on-surface-variant font-black tracking-widest uppercase text-xs">Overall Accuracy</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-headline text-8xl font-bold text-on-background">0</span>
                  <span className="font-headline text-4xl text-primary font-light">%</span>
                </div>
                <p className="text-on-surface-variant mt-4 max-w-xs leading-relaxed">Play your first session to see your accuracy and insights.</p>
              </div>
              <div className="w-48 h-48 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-highest" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-primary drop-shadow-[0_0_8px_rgba(206,150,255,0.6)]" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeDashoffset="552.92" strokeLinecap="round" strokeWidth="12"></circle>
                </svg>
                <span className="absolute material-symbols-outlined text-5xl text-primary" data-icon="insights">insights</span>
              </div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="md:col-span-4 bg-surface-container p-8 rounded-3xl border border-primary/20 flex flex-col justify-between">
            <div>
              <span className="font-label text-tertiary font-black tracking-widest uppercase text-xs">Daily Streak</span>
              <div className="mt-2 flex items-center gap-3">
                <span className="font-headline text-7xl font-bold text-on-background">0</span>
                <span className="material-symbols-outlined text-tertiary text-4xl" data-icon="local_fire_department" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex justify-between mb-2 px-1">
                <span className="text-[10px] font-black uppercase text-on-surface-variant">Next Milestone: 3 Days</span>
                <span className="text-[10px] font-black uppercase text-tertiary">0%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-tertiary to-tertiary-dim w-0"></div>
              </div>
            </div>
          </div>

          {/* Total Sessions */}
          <div className="md:col-span-4 bg-surface-container-low p-8 rounded-3xl">
            <span className="font-label text-on-surface-variant font-black tracking-widest uppercase text-xs">Total Sessions</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-headline text-6xl font-bold text-on-background">0</span>
              <span className="material-symbols-outlined text-secondary" data-icon="history_edu">history_edu</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold rounded-full text-on-surface-variant">0 this week</span>
              <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold rounded-full text-on-surface-variant">Avg 0m/day</span>
            </div>
          </div>

          {/* Proficiency Chart (Asymmetric Visual) */}
          <div className="md:col-span-8 bg-surface-container p-8 rounded-3xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="font-label text-on-surface-variant font-black tracking-widest uppercase text-xs">Proficiency Growth</span>
                <h3 className="font-headline text-2xl font-bold mt-1">Skill Distribution</h3>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-surface-container-highest rounded-xl text-primary"><span className="material-symbols-outlined" data-icon="equalizer">equalizer</span></button>
              </div>
            </div>
            <div className="flex items-end justify-between h-40 gap-16 max-w-md mx-auto">
              {/* Chords Bar */}
              <div className="flex-1 bg-primary/20 rounded-t-xl relative group h-0">
                <div className="absolute inset-0 bg-primary opacity-40 group-hover:opacity-100 transition-opacity rounded-t-xl"></div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface-variant">NOTE INTERVALS</span>
              </div>
              {/* Notes Bar */}
              <div className="flex-1 bg-primary/20 rounded-t-xl relative group h-0">
                <div className="absolute inset-0 bg-primary opacity-40 group-hover:opacity-100 transition-opacity rounded-t-xl"></div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface-variant">NOTES</span>
              </div>
            </div>
          </div>
        </div>
        {/* Recent Achievements */}
      </main>

      {/* BottomNavBar */}
      <div className="fixed bottom-0 left-0 w-full z-50 p-6 bg-gradient-to-t from-background via-background/95 to-transparent">
        <button className="w-full bg-[#7C4DFF] hover:bg-[#6A3EE3] text-white font-headline font-bold py-5 px-8 rounded-full shadow-[0_10px_30px_rgba(124,77,255,0.3)] transition-all active:scale-[0.98] duration-200 uppercase tracking-widest text-sm flex items-center justify-center">
          CHOOSE DIFFICULTY
        </button>
      </div>
    </div>
  );
};

export default Data;
