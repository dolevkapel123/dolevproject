import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

interface RegisterProps {
  onNavigate: (page: string) => void;
}

const Register = ({ onNavigate }: RegisterProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const notOnlyNumeric = (val: string) => !/^\d+$/.test(val);
    const isValidEmail = (val: string) => /^\S+@\S+\.\S+$/.test(val);

    if (firstName.length < 2 || !notOnlyNumeric(firstName)) {
      newErrors.firstName = 'First name must be at least 2 characters and not only numeric.';
    }
    if (lastName.length < 2 || !notOnlyNumeric(lastName)) {
      newErrors.lastName = 'Last name must be at least 2 characters and not only numeric.';
    }
    if (username.length < 2 || !notOnlyNumeric(username)) {
      newErrors.username = 'Username must be at least 2 characters and not only numeric.';
    }
    if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!age) {
      newErrors.age = 'Age is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: username });
        }
        console.log('Form submitted: success');
        onNavigate('main');
      } catch (err: any) {
        setErrors((prev) => ({ ...prev, firebase: err.message }));
      }
    }
  };

  const getLabelClass = (field: string) => 
    `block font-label text-[11px] font-bold tracking-widest uppercase mb-2 ${errors[field] ? 'text-red-500' : 'text-gray-100'}`;

  const getInputClass = (field: string) => 
    `w-full bg-transparent border-0 border-b-2 py-3 font-headline text-lg tracking-wide placeholder:text-gray-400 focus:ring-0 transition-all duration-300 ${errors[field] ? 'border-red-500 focus:border-red-500 text-red-500' : 'border-outline-variant/30 focus:border-primary text-white'}`;

  const getBorderClass = (field: string) =>
    `absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-500 group-focus-within:w-full ${errors[field] ? 'bg-red-500 w-full' : 'bg-primary'}`;

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden min-h-screen flex flex-col">
      <style>
        {`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .tonal-lift {
            box-shadow: 0 40px 40px -20px rgba(0, 0, 0, 0.5);
        }
        `}
      </style>
      
      {/* TopAppBar */}
      <header className="w-full top-0 z-50 bg-[#0e0e10] py-6">
        <div className="flex items-center justify-center w-full px-6">
          <h1 className="font-headline font-extrabold tracking-tight text-5xl sm:text-6xl tracking-widest text-[#e8b5ff] uppercase drop-shadow-[0_0_15px_rgba(232,181,255,0.7)]">
            EAR TRAINER
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 relative w-full">
        {/* Decorative Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-dim/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="w-full max-w-2xl z-10 space-y-12">
          {/* Welcome Header */}
          <div className="space-y-4 text-center md:pb-6">
            <span className="text-[#ce96ff] font-label text-[12px] font-bold tracking-[0.2em] uppercase block">Start Your Journey</span>
            <h2 className="font-headline text-7xl md:text-8xl font-black leading-tight tracking-tighter text-[#e8b5ff] drop-shadow-[0_0_20px_rgba(232,181,255,0.7)]">
              Create <br/>Profile
            </h2>
          </div>
          
          {/* Registration Form */}
          <form className="space-y-6 text-left" onSubmit={handleSubmit} autoComplete="off">
            <div className="flex gap-4">
              {/* First Name */}
              <div className="group relative w-1/2">
                <label className={getLabelClass('firstName')} htmlFor="firstName">First Name</label>
                <input className={getInputClass('firstName')} id="firstName" name="firstName" placeholder="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="new-password" />
                <div className={getBorderClass('firstName')}></div>
                {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="group relative w-1/2">
                <label className={getLabelClass('lastName')} htmlFor="lastName">Last Name</label>
                <input className={getInputClass('lastName')} id="lastName" name="lastName" placeholder="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="new-password" />
                <div className={getBorderClass('lastName')}></div>
                {errors.lastName && <p className="text-red-500 text-[10px] mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Username */}
            <div className="group relative">
              <label className={getLabelClass('username')} htmlFor="username">Username</label>
              <input className={getInputClass('username')} id="username" name="username" placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="new-password" />
              <div className={getBorderClass('username')}></div>
              {errors.username && <p className="text-red-500 text-[10px] mt-1">{errors.username}</p>}
            </div>
            
            {/* Email */}
            <div className="group relative">
              <label className={getLabelClass('email')} htmlFor="email">Email Address</label>
              <input className={getInputClass('email')} id="email" name="email" placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="new-password" />
              <div className={getBorderClass('email')}></div>
              {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
            </div>
            
            <div className="flex gap-4">
              {/* Password */}
              <div className="group relative w-1/2">
                <label className={getLabelClass('password')} htmlFor="password">Password</label>
                <input className={getInputClass('password')} id="password" name="password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                <div className={getBorderClass('password')}></div>
                {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="group relative w-1/2">
                <label className={getLabelClass('confirmPassword')} htmlFor="confirmPassword">Confirm Password</label>
                <input className={getInputClass('confirmPassword')} id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
                <div className={getBorderClass('confirmPassword')}></div>
                {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Age */}
            <div className="group relative w-1/3">
              <label className={getLabelClass('age')} htmlFor="age">Age</label>
              <input className={getInputClass('age')} id="age" name="age" placeholder="Age" type="number" min="1" value={age} onChange={(e) => setAge(e.target.value)} autoComplete="new-password" />
              <div className={getBorderClass('age')}></div>
              {errors.age && <p className="text-red-500 text-[10px] mt-1">{errors.age}</p>}
            </div>
            
            {/* Form Action */}
            <div className="pt-6 space-y-8">
              {errors.firebase && <p className="text-red-500 font-label text-xs text-center">{errors.firebase}</p>}
              <button className="w-full h-14 bg-primary text-on-primary font-label font-extrabold tracking-[0.15em] rounded-xl hover:bg-primary-dim active:scale-95 transition-all duration-200 flex items-center justify-center" type="submit">
                REGISTER
              </button>
              
              {/* Secondary Link */}
              <div className="flex flex-col items-center space-y-2">
                <span className="font-label text-xs text-on-surface-variant font-medium">ALREADY HAVE AN ACCOUNT?</span>
                <a className="font-headline text-primary font-bold tracking-wider hover:text-on-surface transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>LOGIN</a>
              </div>
            </div>
          </form>
        </div>
        
        {/* Background Element: Abstract Waveform */}
        <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden opacity-20 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="#ce96ff" fillOpacity="1"></path>
          </svg>
        </div>
      </main>
      
      {/* Visual Footer Anchor */}
      <footer className="w-full p-8 flex justify-between items-end">
        <div className="space-y-1">
          <div className="w-12 h-[2px] bg-primary"></div>
          <p className="font-label text-[10px] text-outline tracking-widest uppercase">Sonic Frequency v2.0</p>
        </div>
        
        {/* Subtle Branding Texture */}
        <div className="relative w-16 h-16 opacity-30">
          <img alt="Abstract audio waveform logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA76tMVSvNAqyq6awf4gbr7E9B0JloKlQb1Tw14199rQMM86nyjW48gunbryVHZ_wfehU3KFRgGoC_eA3mPdRAQJOwKQLgfc9lM6OnD6_J6wHXcAzbf1fr6ab535HKYDlV57F9FuL-AqrneAClAZbWOfz4UXTJGSHxZJgQjqGU4Ji6Gg2h30ByMT5sBRjqwkSR0TLbNEM1RyLEZY55XzMYCs0jepwHLlo90FAHRBpH6VhvTo46PNYPj0rwBbbf7wzo6Jg8YSF0RmUA" />
        </div>
      </footer>
    </div>
  );
};

export default Register;
