import { useState, useEffect } from 'react';

interface PianoTrainerProps {
  onNavigate: (page: 'login' | 'register' | 'main' | 'difficulty' | 'piano') => void;
  difficulty: 'novice' | 'apprentice' | 'adept' | 'expert' | 'master';
  onCompleteExpertSession: () => void;
}

interface KeyInfo {
  name: string;
  isBlack: boolean;
  freq: number;
}

const WHITE_KEYS: KeyInfo[] = [
  { name: 'C', isBlack: false, freq: 261.63 },
  { name: 'D', isBlack: false, freq: 293.66 },
  { name: 'E', isBlack: false, freq: 329.63 },
  { name: 'F', isBlack: false, freq: 349.23 },
  { name: 'G', isBlack: false, freq: 392.00 },
  { name: 'A', isBlack: false, freq: 440.00 },
  { name: 'B', isBlack: false, freq: 493.88 },
  { name: 'C2', isBlack: false, freq: 523.25 } // High C
];

const BLACK_KEYS: KeyInfo[] = [
  { name: 'C#', isBlack: true, freq: 277.18 },
  { name: 'D#', isBlack: true, freq: 311.13 },
  { name: 'F#', isBlack: true, freq: 369.99 },
  { name: 'G#', isBlack: true, freq: 415.30 },
  { name: 'A#', isBlack: true, freq: 466.16 }
];

const ALL_KEYS = [...WHITE_KEYS, ...BLACK_KEYS];

// Audio synthesizers for piano keys and chimes
const playPianoTone = (frequency: number) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Fundamental tone (Triangle)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gain1.gain.setValueAtTime(0, audioCtx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.03); // Attack
    gain1.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2); // Decay/Release
    
    // Soft Harmonic (Sine)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, audioCtx.currentTime);
    gain2.gain.setValueAtTime(0, audioCtx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    
    osc1.start();
    osc2.start();
    
    osc1.stop(audioCtx.currentTime + 1.3);
    osc2.stop(audioCtx.currentTime + 0.9);
  } catch (e) {
    console.error("Web Audio not supported or blocked", e);
  }
};

const playChime = (isSuccess: boolean) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (isSuccess) {
      // High bright major chime
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
      gain2.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.28);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);

      const osc3 = audioCtx.createOscillator();
      const gain3 = audioCtx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16); // G5
      gain3.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.16);
      gain3.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
      osc3.connect(gain3);
      gain3.connect(audioCtx.destination);

      osc1.start();
      osc2.start(audioCtx.currentTime + 0.08);
      osc3.start(audioCtx.currentTime + 0.16);

      osc1.stop(audioCtx.currentTime + 0.25);
      osc2.stop(audioCtx.currentTime + 0.35);
      osc3.stop(audioCtx.currentTime + 0.5);
    } else {
      // Low dual-tone buzzer
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(146.83, audioCtx.currentTime); // D3
      gain1.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);

      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.4);
    }
  } catch (e) {}
};

const PianoTrainer = ({ onNavigate, difficulty, onCompleteExpertSession }: PianoTrainerProps) => {
  const [successes, setSuccesses] = useState<number>(0);
  const [targetNote, setTargetNote] = useState<{ name: string; octave: number; freq: number } | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  const [hasPlayedInitial, setHasPlayedInitial] = useState<boolean>(false);
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);

  // Generate target note based on difficulty requirements
  const generateTargetNote = () => {
    let pool: KeyInfo[] = [];
    let octave = 4;

    switch (difficulty) {
      case 'novice':
        // White keys only (C4-C5)
        pool = WHITE_KEYS;
        octave = 4;
        break;
      case 'apprentice':
        // White keys + G# and A#
        pool = [...WHITE_KEYS, BLACK_KEYS.find(k => k.name === 'G#')!, BLACK_KEYS.find(k => k.name === 'A#')!];
        octave = 4;
        break;
      case 'adept':
        // Full chromatic octave (C4-C5)
        pool = ALL_KEYS;
        octave = 4;
        break;
      case 'expert':
        // Full chromatic octave in a random octave (3, 4, or 5)
        pool = ALL_KEYS;
        octave = Math.floor(Math.random() * 3) + 3; // Random 3, 4, or 5
        break;
      case 'master':
        // Random note from random octave (each note randomly generated across octaves 3, 4, 5)
        pool = ALL_KEYS;
        octave = Math.floor(Math.random() * 3) + 3; // Random 3, 4, or 5
        break;
      default:
        pool = WHITE_KEYS;
        octave = 4;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    
    // Shift frequency depending on selected octave
    const octaveShift = Math.pow(2, octave - 4);
    const calculatedFreq = chosen.freq * octaveShift;

    return {
      name: chosen.name,
      octave,
      freq: calculatedFreq
    };
  };

  const startNewRound = () => {
    const note = generateTargetNote();
    setTargetNote(note);
    setFeedback('');
    setFeedbackType(null);
    
    // Auto play note after brief delay
    setTimeout(() => {
      playPianoTone(note.freq);
    }, 400);
  };

  // Select target note on component mount and update stats
  useEffect(() => {
    startNewRound();

    // Increment total sessions
    const sessions = parseInt(localStorage.getItem('et_total_sessions') || '0', 10);
    localStorage.setItem('et_total_sessions', (sessions + 1).toString());

    // Calculate and update daily streak
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const lastSessionDate = localStorage.getItem('et_last_session_date');
    const currentStreak = parseInt(localStorage.getItem('et_daily_streak') || '0', 10);

    if (!lastSessionDate) {
      localStorage.setItem('et_daily_streak', '1');
      localStorage.setItem('et_last_session_date', today);
    } else if (lastSessionDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');
      if (lastSessionDate === yesterday) {
        localStorage.setItem('et_daily_streak', (currentStreak + 1).toString());
      } else {
        localStorage.setItem('et_daily_streak', '1');
      }
      localStorage.setItem('et_last_session_date', today);
    }
  }, []);

  const handlePlayTarget = () => {
    if (targetNote) {
      playPianoTone(targetNote.freq);
      setHasPlayedInitial(true);
    }
  };

  const handleKeyClick = (key: KeyInfo) => {
    if (!targetNote || isSessionComplete) return;

    // Play clicked note in target note's octave for comparison
    const octaveShift = Math.pow(2, targetNote.octave - 4);
    const keyFreq = key.freq * octaveShift;
    playPianoTone(keyFreq);

    // Verify guess
    const isCorrect = key.name === targetNote.name;

    if (isCorrect) {
      // Record correct guess
      const currentTrue = parseInt(localStorage.getItem('et_guessed_true') || '0', 10);
      localStorage.setItem('et_guessed_true', (currentTrue + 1).toString());

      setFeedback('Correct!');
      setFeedbackType('success');
      playChime(true);

      const nextSuccesses = successes + 1;
      setSuccesses(nextSuccesses);

      if (nextSuccesses >= 10) {
        setIsSessionComplete(true);
        if (difficulty === 'expert') {
          onCompleteExpertSession();
        }
      } else {
        // Next round after brief delay
        setTimeout(() => {
          startNewRound();
        }, 1200);
      }
    } else {
      // Record incorrect guess
      const currentFalse = parseInt(localStorage.getItem('et_guessed_false') || '0', 10);
      localStorage.setItem('et_guessed_false', (currentFalse + 1).toString());

      setFeedback('Try again!');
      setFeedbackType('error');
      playChime(false);
    }
  };

  const handleFinishSession = () => {
    onNavigate('difficulty');
  };

  return (
    <div className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary min-h-screen relative overflow-x-hidden flex flex-col justify-between">
      <style>
        {`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .no-line-philosophy { border: none !important; }
        .tap-highlight-none { -webkit-tap-highlight-color: transparent; }
        .glass-panel {
          background: rgba(25, 25, 28, 0.6);
          backdrop-filter: blur(20px);
        }
        body {
          min-height: max(884px, 100dvh);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        `}
      </style>

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex items-center px-6 h-16 bg-[#0e0e10]/60 backdrop-blur-xl no-line-philosophy bg-gradient-to-b from-[#0e0e10] to-transparent justify-between">
        <button 
          onClick={() => onNavigate('difficulty')} 
          className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center text-on-background cursor-pointer"
          title="Back to Difficulty selection"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        <div className="flex items-center absolute left-1/2 -translate-x-1/2">
          <h1 className="text-2xl font-black tracking-widest text-[#ce96ff] uppercase font-headline">EAR TRAINER</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-primary-container/20 border border-primary/20 text-primary rounded-full font-label text-[10px] font-bold uppercase tracking-wider">
            {difficulty}
          </span>
        </div>
      </header>

      {/* Main Gameplay Screen */}
      <main className="pt-16 flex-1 flex flex-col justify-between">
        {/* Feedback and Action Area */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 gap-10 relative overflow-hidden">
          
          {/* Successes counter */}
          <div className="bg-surface-container-lowest/40 backdrop-blur-md border border-primary/20 px-6 py-2 rounded-full z-10 shadow-[0_0_20px_rgba(206,150,255,0.1)]">
            <span className="text-primary font-headline text-xs font-black tracking-[0.25em] uppercase">
              SUCCESSES: <span className="text-on-background ml-1">{successes} / 10</span>
            </span>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

          {/* Target Prompt and Feedback Banner */}
          <div className="text-center space-y-4 z-10">
            <div className="flex flex-col items-center">
              <span className="text-primary font-headline text-4xl md:text-5xl font-bold tracking-tight uppercase mb-2">
                WHICH NOTE IS PLAYING?
              </span>
              
              {/* Game instructions helper */}
              {!hasPlayedInitial && (
                <span className="text-on-surface-variant font-label text-xs tracking-wider uppercase opacity-60">
                  Click the Play Note button to hear the target sound
                </span>
              )}

              {/* Feedback Alert Overlay */}
              {feedback && (
                <div className="flex items-center gap-2 mt-4 transition-all duration-300 animate-pulse">
                  {feedbackType === 'success' ? (
                    <>
                      <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      <span className="text-tertiary font-label text-sm font-bold tracking-widest uppercase">
                        {feedback}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                        cancel
                      </span>
                      <span className="text-error font-label text-sm font-bold tracking-widest uppercase">
                        {feedback}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Major CTA: Play Note */}
          <div className="relative group z-10">
            <div className="absolute inset-0 bg-primary/20 blur-3xl scale-150 rounded-full transition-all group-active:scale-110"></div>
            <button 
              onClick={handlePlayTarget}
              className="relative w-48 h-48 md:w-56 md:h-56 bg-primary rounded-full flex flex-col items-center justify-center text-on-primary shadow-[0_0_60px_rgba(206,150,255,0.4)] hover:shadow-[0_0_80px_rgba(206,150,255,0.6)] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined text-5xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
              <span className="font-headline font-bold text-xl tracking-widest">PLAY NOTE</span>
            </button>
          </div>
        </section>

        {/* Piano Component Area */}
        <section className="h-[309px] md:h-[353px] bg-surface-container-lowest relative flex justify-center items-end px-2 overflow-x-auto no-scrollbar">
          <div className="flex h-full w-full max-w-6xl relative select-none">
            
            {/* White Keys Container */}
            <div className="flex w-full h-full gap-1">
              {WHITE_KEYS.map((key) => (
                <button
                  key={key.name}
                  onClick={() => handleKeyClick(key)}
                  className="flex-1 bg-white rounded-b-xl border-x border-b border-outline-variant/30 relative active:bg-primary/20 active:shadow-[0_0_30px_rgba(206,150,255,0.6)] active:ring-2 active:ring-primary transition-all duration-75 group tap-highlight-none cursor-pointer flex flex-col justify-end pb-4 text-left"
                >
                  <span className="text-center text-xs font-black text-surface-dim/60 font-label tracking-tighter">
                    {key.name === 'C2' ? 'C' : key.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Black Keys Overlays */}
            <div className="absolute top-0 left-0 w-full h-[58%] pointer-events-none px-[2%]">
              <div className="flex w-full h-full relative">
                {/* C# */}
                <button 
                  onClick={() => handleKeyClick(BLACK_KEYS[0])}
                  className="absolute left-[7.5%] w-[8%] h-[58%] bg-[#1e1e24] rounded-b-lg border-x border-b border-white/5 pointer-events-auto active:bg-primary active:shadow-[0_0_25px_rgba(206,150,255,0.7)] active:scale-95 transition-all shadow-2xl cursor-pointer"
                  title="C#"
                />
                {/* D# */}
                <button 
                  onClick={() => handleKeyClick(BLACK_KEYS[1])}
                  className="absolute left-[20%] w-[8%] h-[58%] bg-[#1e1e24] rounded-b-lg border-x border-b border-white/5 pointer-events-auto active:bg-primary active:shadow-[0_0_25px_rgba(206,150,255,0.7)] active:scale-95 transition-all shadow-2xl cursor-pointer"
                  title="D#"
                />
                {/* F# */}
                <button 
                  onClick={() => handleKeyClick(BLACK_KEYS[2])}
                  className="absolute left-[45%] w-[8%] h-[58%] bg-[#1e1e24] rounded-b-lg border-x border-b border-white/5 pointer-events-auto active:bg-primary active:shadow-[0_0_25px_rgba(206,150,255,0.7)] active:scale-95 transition-all shadow-2xl cursor-pointer"
                  title="F#"
                />
                {/* G# */}
                <button 
                  onClick={() => handleKeyClick(BLACK_KEYS[3])}
                  className="absolute left-[57.5%] w-[8%] h-[58%] bg-[#1e1e24] rounded-b-lg border-x border-b border-white/5 pointer-events-auto active:bg-primary active:shadow-[0_0_25px_rgba(206,150,255,0.7)] active:scale-95 transition-all shadow-2xl cursor-pointer"
                  title="G#"
                />
                {/* A# */}
                <button 
                  onClick={() => handleKeyClick(BLACK_KEYS[4])}
                  className="absolute left-[70%] w-[8%] h-[58%] bg-[#1e1e24] rounded-b-lg border-x border-b border-white/5 pointer-events-auto active:bg-primary active:shadow-[0_0_25px_rgba(206,150,255,0.7)] active:scale-95 transition-all shadow-2xl cursor-pointer"
                  title="A#"
                />
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Session Complete Modal Overlay */}
      {isSessionComplete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="glass-panel max-w-md w-full border border-primary/20 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-10 -mt-10"></div>
            
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-2">
              <span className="material-symbols-outlined text-5xl animate-bounce">
                workspace_premium
              </span>
            </div>
            
            <div className="space-y-2">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-background">
                SESSION COMPLETE!
              </h2>
              <p className="text-on-surface-variant font-label text-sm">
                Excellent! You successfully identified 10 target pitches on the keyboard.
              </p>
            </div>

            <div className="bg-surface-container-high/40 p-4 rounded-2xl border border-outline-variant/10 text-left space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                <span>Training Level:</span>
                <span className="text-primary">{difficulty}</span>
              </div>
              {difficulty === 'expert' && (
                <p className="text-[10px] text-tertiary uppercase tracking-tight leading-normal mt-1">
                  ★ Expert session logged! Keep going to unlock Master level.
                </p>
              )}
            </div>

            <button 
              onClick={handleFinishSession}
              className="w-full py-4 bg-primary hover:bg-primary-dim text-on-primary font-headline font-bold text-sm tracking-widest uppercase rounded-xl transition-all duration-200 active:scale-98 shadow-[0_4px_20px_rgba(206,150,255,0.3)] cursor-pointer"
            >
              Finish & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PianoTrainer;
