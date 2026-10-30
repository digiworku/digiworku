import React, { useState } from 'react';
import { Mail, Lock, User, CheckCircle, AlertCircle, Loader2, Phone, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabase';
import { saveUserProfileToDB, fetchUserProfileFromDB } from '../services/userService';

interface AuthFormProps {
  authMode: 'signin' | 'signup';
  darkMode: boolean;
  onSuccess: (user: { name: string; email: string; avatarUrl: string; registered?: boolean; mobile?: string }) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ authMode, darkMode, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (authMode === 'signup' && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (authMode === 'signup') {
        // ── Real Supabase Auth signup ──
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: { name: name.trim(), mobile: mobileNumber.trim() }
          }
        });

        if (error) throw error;
        if (!data.user) throw new Error('Signup failed. Please try again.');

        // Save profile to database
        await saveUserProfileToDB({
          id: data.user.id,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          mobile: mobileNumber.trim(),
          avatar_url: null
        });

        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=00c853&color=fff&bold=true&size=256`;
        setSuccess(true);
        setTimeout(() => {
          onSuccess({ name: name.trim(), email: email.trim().toLowerCase(), mobile: mobileNumber.trim(), avatarUrl, registered: true });
        }, 800);

      } else {
        // ── Real Supabase Auth signin ──
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Incorrect email or password. Please try again.');
          }
          throw error;
        }

        if (!data.user) throw new Error('Sign in failed. Please try again.');

        // Fetch profile from database
        const profile = await fetchUserProfileFromDB(data.user.id);

        const displayName = profile?.name || data.user.user_metadata?.name || email.split('@')[0];
        const avatarUrl = profile?.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=00c853&color=fff&bold=true&size=256`;

        setSuccess(true);
        setTimeout(() => {
          onSuccess({
            name: displayName,
            email: data.user!.email!,
            mobile: profile?.mobile || '',
            avatarUrl,
            registered: true
          });
        }, 800);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'An error occurred. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrorMessage('Enter your email address first, then click Forgot Password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage(null);
      alert(`✅ Password reset link sent to ${email.trim()}. Check your inbox.`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-500/5 dark:bg-red-500/10 border border-red-500/15 text-red-600 dark:text-red-400 rounded-xl text-[11px] font-medium leading-relaxed animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

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
              {authMode === 'signup' ? 'Check your email to verify your account.' : 'Loading your workspace...'}
            </div>
          </div>
        </div>
      )}

      {!success && (
        <>
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
                  placeholder="e.g. Rahul Sharma"
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

          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400/80 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
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

          {authMode === 'signup' && (
            <div className="space-y-1.5">
              <label className="block text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Mobile Number <span className="normal-case text-slate-300">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400/80 absolute left-3.5 top-3" />
                <input
                  type="tel"
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
          )}

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <span>Password</span>
              {authMode === 'signin' && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="hover:text-[#00c853] transition-colors cursor-pointer capitalize font-semibold"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400/80 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Min. 6 characters"
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
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-5 rounded-xl text-xs font-bold tracking-widest text-white uppercase transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
              loading
                ? 'bg-[#00c853]/60 select-none'
                : 'bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-extrabold'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{authMode === 'signin' ? 'Signing in...' : 'Creating account...'}</span>
              </>
            ) : (
              <span>{authMode === 'signin' ? 'Sign In to Workspace' : 'Create My Account'}</span>
            )}
          </button>
        </>
      )}
    </form>
  );
};
