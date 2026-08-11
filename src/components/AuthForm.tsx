import React, { useState } from 'react';
import { Mail, Lock, User, CheckCircle, AlertCircle, Loader2, Phone, Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  authMode: 'signin' | 'signup';
  darkMode: boolean;
  onSuccess: (user: { name: string; email: string; avatarUrl: string; registered?: boolean; mobile?: string }) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ authMode, darkMode, onSuccess }) => {
  // Field values state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Field validation and form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation checks
    if (authMode === 'signup' && !name.trim()) {
      setErrorMessage('Please enter your full name to set up client access.');
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please provide a valid corporate or personal email address.');
      return;
    }

    if (!mobileNumber.trim()) {
      setErrorMessage('Please provide a valid mobile number for secure MFA notifications.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Your password must contain at least 6 secure characters.');
      return;
    }

    // Trigger loading spinner simulation
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Generate a polished avatar based on the user's email with a fallback initials avatar
      const cleanEmail = email.trim().toLowerCase();
      const extractedName = cleanEmail.split('@')[0]
        .split(/[._+-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const displayName = authMode === 'signin' 
        ? (cleanEmail === 'digiworku@gmail.com' ? 'DigiWorku Founder' : extractedName) 
        : name.trim();

      const chosenAvatar = `https://unavatar.io/${encodeURIComponent(cleanEmail)}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=00c853&color=fff&bold=true&size=256`;

      const authenticatedUser = {
        name: displayName,
        email: cleanEmail,
        mobile: mobileNumber.trim(),
        avatarUrl: chosenAvatar,
        registered: authMode === 'signup'
      };

      // Save credentials session in local state & localStorage
      localStorage.setItem('digiworku-user-session', JSON.stringify(authenticatedUser));

      // Small success check transition before calling parent success handler
      setTimeout(() => {
        onSuccess(authenticatedUser);
      }, 800);

    }, 1500); // realistic networking feedback delay
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      {/* Error Message banner */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-500/5 dark:bg-red-500/10 border border-red-500/15 text-red-600 dark:text-red-400 rounded-xl text-[11px] font-medium leading-relaxed animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Verification Success banner */}
      {success && (
        <div className="flex flex-col items-center justify-center p-6 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-slate-800 dark:text-white rounded-2xl text-center space-y-3 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-[#00c853]" />
          </div>
          <div>
            <div className="text-xs font-black tracking-wider uppercase text-[#00c853]">
              {authMode === 'signin' ? 'Access Granted' : 'Account Created'}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold mt-1">
              Synchronizing secure digital workspace parameters...
            </div>
          </div>
        </div>
      )}

      {!success && (
        <>
          {/* 1. Name input (Signup only) */}
          {authMode === 'signup' && (
            <div className="space-y-1.5">
              <label className="block text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400/80 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Baker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full text-xs font-semibold pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-slate-800 dark:focus:border-slate-100 transition-all ${
                    darkMode 
                      ? 'bg-slate-900/35 border-slate-800/80 text-white placeholder-slate-600' 
                      : 'bg-slate-50/50 border-slate-200/80 text-slate-850 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>
          )}

          {/* 2. Email Address */}
          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400/80 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="username@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full text-xs font-semibold pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-slate-800 dark:focus:border-slate-100 transition-all ${
                  darkMode 
                    ? 'bg-slate-900/35 border-slate-800/80 text-white placeholder-slate-600' 
                    : 'bg-slate-50/50 border-slate-200/80 text-slate-850 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* 3. Mobile Number */}
          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400/80 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className={`w-full text-xs font-semibold pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-slate-800 dark:focus:border-slate-100 transition-all ${
                  darkMode 
                    ? 'bg-slate-900/35 border-slate-800/80 text-white placeholder-slate-600' 
                    : 'bg-slate-50/50 border-slate-200/80 text-slate-850 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* 4. Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <span>Security Password</span>
              {authMode === 'signin' && (
                <button
                  type="button"
                  onClick={() => alert("Simulated: Forgot password flow initiated. Reset directives will be dispatched shortly!")}
                  className="hover:text-[#00c853] transition-colors cursor-pointer capitalize font-semibold"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400/80 absolute left-3.5 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter 6+ characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full text-xs font-semibold pl-10 pr-12 py-3 rounded-xl border focus:outline-none focus:border-slate-800 dark:focus:border-slate-100 transition-all ${
                  darkMode 
                    ? 'bg-slate-900/35 border-slate-800/80 text-white placeholder-slate-600' 
                    : 'bg-slate-50/50 border-slate-200/80 text-slate-850 placeholder-slate-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-5 rounded-xl text-xs font-bold tracking-widest text-white uppercase transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
              loading 
                ? 'bg-[#00c853]/60 dark:bg-emerald-600/60 select-none' 
                : 'bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:hover:text-black font-extrabold'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white dark:text-slate-900" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                {authMode === 'signin' ? 'Sign In to Workspace' : 'Create My Account'}
              </>
            )}
          </button>
        </>
      )}
    </form>
  );
};
