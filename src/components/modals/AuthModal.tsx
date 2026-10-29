import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Shield, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { AuthForm } from '../AuthForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onClientAuthSuccess: (user: { name: string; email: string; avatarUrl: string; registered?: boolean; mobile?: string }) => void;
  onAdminAuthSuccess: (token: string, email: string) => void;
  defaultAdminMode?: boolean;
}

export function AuthModal({
  isOpen,
  onClose,
  darkMode,
  onClientAuthSuccess,
  onAdminAuthSuccess,
  defaultAdminMode = false,
}: AuthModalProps) {
  const [tab, setTab] = useState<'client' | 'admin'>(defaultAdminMode ? 'admin' : 'client');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminLoading(true);

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail.trim(),
          password: adminPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid admin credentials');
      }

      // Store verified signed JWT token
      localStorage.setItem('digiworku-admin-token', data.token);
      localStorage.setItem('digiworku-admin-email', data.email);

      onAdminAuthSuccess(data.token, data.email);
      onClose();
    } catch (err: any) {
      console.error('Admin login error:', err);
      setAdminError(err.message || 'Failed to authenticate admin session');
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden my-8 ${
            darkMode ? 'bg-[#18181b] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#00c853]/15 text-[#00c853] flex items-center justify-center font-bold">
                {tab === 'admin' ? <Shield className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <h3 className="font-extrabold text-base">
                {tab === 'admin' ? 'DigiWorku Admin Portal' : 'Client Account Access'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="p-5 pb-0">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <button
                type="button"
                onClick={() => setTab('client')}
                className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  tab === 'client'
                    ? 'bg-white dark:bg-[#202024] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Client Portal
              </button>
              <button
                type="button"
                onClick={() => setTab('admin')}
                className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  tab === 'admin'
                    ? 'bg-[#00c853] text-black shadow-xs font-extrabold'
                    : 'text-slate-500'
                }`}
              >
                Admin Gateway
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {tab === 'client' ? (
              <AuthForm
                authMode="signin"
                darkMode={darkMode}
                onSuccess={(u) => {
                  onClientAuthSuccess(u);
                  onClose();
                }}
              />
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-3.5 text-xs">
                {adminError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{adminError}</span>
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Authorized Admin Email
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter your admin email address"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Passphrase
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#00c853] hover:bg-[#00b04a] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 mt-2"
                >
                  {adminLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Authenticate & Issue Signed JWT</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default AuthModal;
