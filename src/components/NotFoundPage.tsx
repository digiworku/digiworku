import React from 'react';
import { motion } from 'motion/react';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
  darkMode?: boolean;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome, darkMode = true }) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-16 transition-colors duration-200 ${
      darkMode ? 'bg-[#0f1115] text-[#f1f5f9]' : 'bg-[#fafafc] text-[#1f2937]'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Visual Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 shadow-xl shadow-red-500/5 mx-auto">
          <ShieldAlert className="w-10 h-10" />
        </div>

        {/* 404 Typography */}
        <div className="space-y-2">
          <span className="text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">
            404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm mx-auto leading-relaxed">
            The requested destination does not exist, has been removed, or is inaccessible from this node.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00c853] hover:bg-[#00af48] text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#00c853]/20 transition-all cursor-pointer active:scale-98"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
          <button
            onClick={() => window.history.back()}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              darkMode
                ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Brand footer note */}
        <div className="pt-8 text-[11px] font-mono text-slate-400 dark:text-slate-600">
          DigiWorku Infrastructure Gateway • Protocol 404
        </div>
      </motion.div>
    </div>
  );
};
export default NotFoundPage;
