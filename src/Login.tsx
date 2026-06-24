import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db, getUserStats, defaultStats } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface LoginProps {
  onNavigate: (page: string) => void;
}

const Login = ({ onNavigate }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully');
      await getUserStats(userCredential.user.uid);
      onNavigate('main');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save/merge Google user profile to Firestore
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        const updateData: any = {
          uid: user.uid,
          email: user.email || '',
          username: user.displayName || '',
          lastLogin: new Date().toISOString()
        };

        // Initialize stats if this is a new user or stats are missing in database
        if (!userDoc.exists() || !userDoc.data()?.stats) {
          updateData.stats = defaultStats;
        }

        await setDoc(userDocRef, updateData, { merge: true });
      } catch (firestoreErr) {
        console.error("Failed to save/merge Google user details to Cloud Firestore. Falling back to local storage.", firestoreErr);
      }

      await getUserStats(user.uid);
      console.log('Google login successful');
      onNavigate('main');
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div className="bg-background text-on-background font-body selection:bg-primary/30 min-h-screen flex flex-col overflow-x-hidden">
      <style>
        {`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .glass-panel {
            background: rgba(25, 25, 28, 0.6);
            backdrop-filter: blur(20px);
        }
        body {
            min-height: max(884px, 100dvh);
        }
        `}
      </style>

      {/* Hero Background Texture */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[30%] h-[30%] bg-secondary-container/20 rounded-full blur-[100px]"></div>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20" 
          data-alt="Subtle grid pattern of dots" 
          style={{ backgroundImage: 'radial-gradient(#48474a 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-secondary-container shadow-[0_0_40px_rgba(206,150,255,0.3)] mb-6 transform -rotate-3">
              <span className="material-symbols-outlined text-on-primary text-4xl" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>piano</span>
            </div>
            <h1 className="font-headline font-black text-4xl tracking-widest text-primary uppercase">EAR TRAINER</h1>
            <p className="font-label text-on-surface-variant text-[10px] tracking-[0.3em] uppercase opacity-70">
              Precision Performance Lab
            </p>
          </div>

          {/* Login Form */}
          <div className="glass-panel p-8 md:p-10 rounded-3xl shadow-2xl border border-outline-variant/10">
            <form className="space-y-10" onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="relative group">
                <label className="block font-label text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-2 group-focus-within:text-primary transition-colors">
                  Email Address
                </label>
                <div className="flex items-center gap-3 border-b-2 border-outline-variant transition-all duration-300 group-focus-within:border-primary group-focus-within:shadow-[0_4px_12px_-4px_rgba(206,150,255,0.2)]">
                  <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-headline py-3 px-0 placeholder:text-outline/50" placeholder="ENTER EMAIL ADDRESS" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="flex justify-between items-end mb-2">
                  <label className="block font-label text-[10px] font-bold tracking-widest text-on-surface-variant uppercase group-focus-within:text-primary transition-colors">
                    Password
                  </label>
                  <a className="font-label text-[9px] font-bold tracking-widest text-primary/60 hover:text-primary transition-colors uppercase" href="#">
                    Forgot?
                  </a>
                </div>
                <div className="flex items-center gap-3 border-b-2 border-outline-variant transition-all duration-300 group-focus-within:border-primary group-focus-within:shadow-[0_4px_12px_-4px_rgba(206,150,255,0.2)]">
                  <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-headline py-3 px-0 placeholder:text-outline/50" placeholder="••••••••" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <span 
                    onClick={() => setShowPassword(!showPassword)}
                    className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface select-none"
                  >
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </div>
              </div>

              {/* Error Display */}
              {error && <p className="text-red-500 font-label text-xs tracking-wide text-center">{error}</p>}

              {/* CTA Buttons */}
              <div className="space-y-6 pt-4">
                <button className="w-full h-14 bg-primary text-on-primary font-headline font-bold text-sm tracking-widest uppercase rounded-xl shadow-[0_8px_20px_rgba(206,150,255,0.25)] hover:shadow-[0_12px_30px_rgba(206,150,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300" type="submit">
                  ENTER STUDIO
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-outline-variant/20"></div>
                  <span className="flex-shrink mx-4 font-label text-[10px] text-outline tracking-widest uppercase">Or Sync With</span>
                  <div className="flex-grow border-t border-outline-variant/20"></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button className="flex items-center justify-center gap-2 h-12 bg-surface-container-highest/40 border border-outline-variant/10 rounded-xl hover:bg-surface-container-highest transition-colors active:scale-95 duration-200" type="button" onClick={handleGoogleLogin}>
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">google</span>
                    <span className="font-label text-[10px] font-bold tracking-widest uppercase">Google</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sign Up Prompt */}
          <p className="mt-12 text-center">
            <span className="font-label text-xs text-on-surface-variant tracking-wide">New to the studio?</span>
            <a className="ml-2 font-label text-xs font-bold text-primary tracking-widest uppercase hover:underline underline-offset-4 decoration-primary/30 transition-all cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate('register'); }}>
              Create Identity
            </a>
          </p>
        </div>
      </main>

      {/* Footer Identity */}
      <footer className="relative z-10 px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
        <div className="flex items-center gap-4">
          <span className="font-headline text-lg font-bold tracking-tighter text-on-surface-variant">ET_SYS_V4.2</span>
          <div className="w-1 h-1 rounded-full bg-primary"></div>
          <span className="font-label text-[9px] tracking-[0.2em] uppercase">Encrypted Session</span>
        </div>
        <div className="flex gap-8">
          <a className="font-label text-[9px] tracking-[0.2em] uppercase hover:text-on-surface transition-colors" href="#">Privacy</a>
          <a className="font-label text-[9px] tracking-[0.2em] uppercase hover:text-on-surface transition-colors" href="#">Terms</a>
          <a className="font-label text-[9px] tracking-[0.2em] uppercase hover:text-on-surface transition-colors" href="#">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
