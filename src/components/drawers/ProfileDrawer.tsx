import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  X,
  Check,
  Shield,
  Lock,
  Zap,
  Clock,
  UserCheck,
  Mail,
  Phone,
  UserPlus,
  LogIn,
  LogOut
} from 'lucide-react';
import { supabase } from '../../supabase';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  panelMode: 'user' | 'admin';
  adminEmailInput: string;
  currentUser: any;
  setCurrentUser: (u: any) => void;
  setIsAdmin: (b: boolean) => void;
  setPanelMode: (mode: 'user' | 'admin') => void;
  setIsAuthModalOpen: (b: boolean) => void;
  setAuthMode: (mode: 'signin' | 'signup') => void;
  triggerToast: (msg: string) => void;
  editProfileName: string;
  setEditProfileName: (val: string) => void;
  editProfileEmail: string;
  setEditProfileEmail: (val: string) => void;
  editProfileMobile: string;
  setEditProfileMobile: (val: string) => void;
  editProfileAvatar: string;
  setEditProfileAvatar: (val: string) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  darkMode,
  panelMode,
  adminEmailInput,
  currentUser,
  setCurrentUser,
  setIsAdmin,
  setPanelMode,
  setIsAuthModalOpen,
  setAuthMode,
  triggerToast,
  editProfileName,
  setEditProfileName,
  editProfileEmail,
  setEditProfileEmail,
  editProfileMobile,
  setEditProfileMobile,
  editProfileAvatar,
  setEditProfileAvatar
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`w-full max-w-md h-full shadow-2xl flex flex-col relative z-10 ${
              darkMode ? 'bg-[#182025] text-white border-l border-slate-800' : 'bg-white text-slate-800 border-l border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#00c853]/10 text-[#00c853] rounded-lg">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">
                    {panelMode === 'admin' ? "Operator Command Console" : "Profile"}
                  </h3>
                  {(!currentUser || panelMode === 'admin') && (
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {panelMode === 'admin' ? "Active Administrator" : "Guest Client Session"}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {panelMode === 'admin' ? (
                /* Admin Operator Panel */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminEmailInput ? adminEmailInput.split('@')[0] : 'Admin')}&background=00c853&color=fff&bold=true&size=256`}
                        alt="Admin Avatar"
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#00c853] shadow-md"
                      />
                      <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#00c853] rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {adminEmailInput
                          ? adminEmailInput.split('@')[0].replace(/[._]/g, ' ').replace(/ \w/g, (l: string) => l.toUpperCase())
                          : 'Administrator'}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{adminEmailInput || 'admin@digiworku.in'}</p>
                      <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-[#00c853]/10 text-[#00c853] font-bold uppercase tracking-wider mt-2">
                        Admin Console — Full Access
                      </span>
                    </div>
                  </div>

                  {/* Operational Details Card */}
                  <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 space-y-3">
                    <h5 className="text-xs font-black uppercase tracking-wider text-slate-400">System Permissions</h5>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" /> Full Access
                      </div>
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Lock className="w-3.5 h-3.5 text-emerald-500" /> Decryption Key
                      </div>
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Zap className="w-3.5 h-3.5 text-emerald-500" /> Fast Routing
                      </div>
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" /> Server Node
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentUser ? (
                /* Logged-In Client Profile */
                <div className="space-y-6">
                  {/* Avatar Card */}
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center text-center space-y-3">
                    <div
                      className="relative group cursor-pointer"
                      title="Click to upload custom photo"
                      onClick={() => document.getElementById('profile-avatar-file-input')?.click()}
                    >
                      <img
                        src={editProfileAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=00c853&color=fff&bold=true`}
                        alt={currentUser.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#00c853] shadow-md transition-all group-hover:scale-105 group-hover:opacity-90"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black">
                        UPLOAD
                      </div>
                      <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#00c853] rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <UserCheck className="w-3 h-3 text-white" />
                      </span>
                    </div>

                    <input
                      type="file"
                      id="profile-avatar-file-input"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            triggerToast("⚠️ Image size should be less than 5MB.");
                            return;
                          }
                          triggerToast("⏳ Uploading avatar...");
                          try {
                            const ext = file.name.split('.').pop() || 'jpg';
                            const filename = `avatars/${Date.now()}.${ext}`;
                            const { data, error } = await supabase.storage
                              .from('digiworku-uploads')
                              .upload(filename, file, { contentType: file.type, upsert: true });
                            if (error) throw error;
                            const { data: urlData } = supabase.storage.from('digiworku-uploads').getPublicUrl(data.path);
                            setEditProfileAvatar(urlData.publicUrl);
                            triggerToast("📸 Avatar uploaded! Click Save to apply.");
                          } catch (err: any) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setEditProfileAvatar(event.target.result as string);
                                triggerToast("📸 Avatar loaded locally. Configure Supabase Storage for cloud upload.");
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                    />

                    <div className="w-full">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Workspace Avatar Themes</span>
                      <div className="flex items-center justify-center gap-2">
                        {[
                          `https://unavatar.io/${encodeURIComponent(editProfileEmail.trim().toLowerCase())}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent(editProfileName)}&background=00c853&color=fff&bold=true&size=256`,
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(editProfileName)}&background=00c853&color=fff&bold=true&size=256`,
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(editProfileName)}&background=1e293b&color=fff&bold=true&size=256`,
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(editProfileName)}&background=3b82f6&color=fff&bold=true&size=256`
                        ].map((av, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setEditProfileAvatar(av);
                              triggerToast(`Selected Avatar Preset #${idx + 1}`);
                            }}
                            className={`w-9 h-9 rounded-full overflow-hidden border-2 cursor-pointer transition-all hover:scale-110 ${
                              editProfileAvatar === av ? 'border-[#00c853] ring-2 ring-[#00c853]/20 scale-105' : 'border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <img src={av} alt={`Preset ${idx}`} className="w-full h-full object-cover animate-fade-in" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Editable Input Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={editProfileName}
                          onChange={(e) => setEditProfileName(e.target.value)}
                          placeholder="Guest Client"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold focus:outline-none focus:border-[#00c853] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={editProfileEmail}
                          onChange={(e) => setEditProfileEmail(e.target.value)}
                          placeholder="alex.rivera@gmail.com"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold focus:outline-none focus:border-[#00c853] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={editProfileMobile}
                          onChange={(e) => setEditProfileMobile(e.target.value)}
                          placeholder="+1 555-0199"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold focus:outline-none focus:border-[#00c853] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={async () => {
                        if (!editProfileName.trim() || !editProfileEmail.trim()) {
                          triggerToast("⚠️ Name and Email cannot be empty.");
                          return;
                        }
                        const cleanEmail = editProfileEmail.trim().toLowerCase();
                        const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(editProfileName)}&background=00c853&color=fff&bold=true&size=256`;
                        const updatedUser = {
                          ...currentUser,
                          name: editProfileName,
                          email: cleanEmail,
                          mobile: editProfileMobile,
                          avatarUrl: editProfileAvatar || fallbackAvatarUrl
                        };
                        setCurrentUser(updatedUser);
                        localStorage.setItem('digiworku-user-session', JSON.stringify(updatedUser));

                        const { data: { session } } = await supabase.auth.getSession();
                        if (session?.user?.id) {
                          await supabase.from('user_profiles').upsert({
                            id: session.user.id,
                            name: editProfileName,
                            mobile: editProfileMobile,
                            avatar_url: editProfileAvatar || fallbackAvatarUrl,
                            updated_at: new Date().toISOString()
                          });
                          await supabase.auth.updateUser({ data: { name: editProfileName } });
                        }

                        triggerToast("✨ Profile updated successfully!");
                      }}
                      className="w-full py-3 rounded-xl bg-[#00c853] hover:bg-[#00b54b] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#00c853]/10 active:scale-98"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Workspace Profile</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Guest Client Profile Panel */
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col items-center text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">Guest Client Account</h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xs">
                        You are currently exploring DigiWorku in public preview mode. Registering locks in premium client workspace matrices.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        onClose();
                        setIsAuthModalOpen(true);
                        setAuthMode('signup');
                        triggerToast("🚀 Loading Client Registration Portal...");
                      }}
                      className="w-full py-3.5 rounded-xl bg-[#00c853] hover:bg-[#00af48] text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#00c853]/15 active:scale-98"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>CREATE CLIENT ACCOUNT</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        setIsAuthModalOpen(true);
                        setAuthMode('signin');
                        triggerToast("🔑 Loading Secure Client Login...");
                      }}
                      className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>SIGN IN TO MY WORKSPACE</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Log Out Block */}
              {panelMode === 'admin' ? (
                <div className="border-t border-slate-200/60 dark:border-slate-800/80 pt-5">
                  <button
                    onClick={() => {
                      setIsAdmin(false);
                      setPanelMode('user');
                      localStorage.removeItem('digiworku-is-admin');
                      localStorage.removeItem('digiworku-panel-mode');
                      localStorage.removeItem('digiworku-admin-token');
                      onClose();
                      triggerToast("🔒 Signed out of Admin Console. Returned to client mode.");
                    }}
                    className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>EXIT OPERATOR CONSOLE</span>
                  </button>
                </div>
              ) : currentUser ? (
                <div className="border-t border-slate-200/60 dark:border-slate-800/80 pt-5">
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      localStorage.removeItem('digiworku-user-session');
                      setCurrentUser(null);
                      onClose();
                      triggerToast("🔒 Logged out securely. Session ended.");
                    }}
                    className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>SECURE LOG OUT SESSION</span>
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
