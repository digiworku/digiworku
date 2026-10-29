import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, UserCheck, Plus, Trash2, Ban, ShieldCheck, Mail } from 'lucide-react';
import type { TeamMember } from '../types/crm';
import { supabase } from '../supabase';

interface TeamPageProps {
  members: TeamMember[];
  isAdmin: boolean;
  darkMode: boolean;
  onRefresh?: () => void;
  triggerToast?: (msg: string) => void;
}

export function TeamPage({ members, isAdmin, darkMode, onRefresh, triggerToast }: TeamPageProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Full Stack Engineer');
  const [newAvatar, setNewAvatar] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const payload = {
        name: newName.trim(),
        role: newRole.trim(),
        avatar_url: newAvatar.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newName)}`,
        status: 'ONLINE',
        blocked: false,
      };

      const { error } = await supabase.from('team').insert(payload);
      if (error) {
        alert(`Error adding member: ${error.message}`);
        return;
      }

      setNewName('');
      setNewRole('Full Stack Engineer');
      setNewAvatar('');
      setIsAdding(false);
      if (onRefresh) onRefresh();
      if (triggerToast) triggerToast('🎉 New team member added to directory!');
    } catch (err: any) {
      console.error('Add team member error:', err);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    try {
      await supabase.from('team').delete().eq('id', id);
      setDeleteConfirmId(null);
      if (onRefresh) onRefresh();
      if (triggerToast) triggerToast(`Erased team member: ${name}`);
    } catch (err: any) {
      console.error('Delete member error:', err);
    }
  };

  const handleToggleBlock = async (member: TeamMember) => {
    try {
      await supabase
        .from('team')
        .update({ blocked: !member.blocked })
        .eq('id', member.id);
      if (onRefresh) onRefresh();
      if (triggerToast) triggerToast(`Updated status for ${member.name}`);
    } catch (err: any) {
      console.error('Toggle block error:', err);
    }
  };

  // For public visitors, hide blocked members
  const displayMembers = isAdmin ? members : members.filter((m) => !m.blocked);

  return (
    <motion.div
      key="tab-team"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#00c853]" />
            <span>DigiWorku Specialized Workforce</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            India's top 1% vetted engineering, UI/UX, video production, and AI automation talent.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-[#00c853] hover:bg-[#00b04a] text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Cancel' : 'New Member'}</span>
          </button>
        )}
      </div>

      {/* Add Member Form */}
      {isAdmin && isAdding && (
        <form
          onSubmit={handleAddMember}
          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] space-y-3"
        >
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Add Team Member</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Full Name (e.g. Ananya Sen)"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
              required
            />
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Role (e.g. Lead UI/UX Designer)"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
              required
            />
            <input
              type="text"
              value={newAvatar}
              onChange={(e) => setNewAvatar(e.target.value)}
              placeholder="Avatar URL (Optional)"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 rounded-xl bg-[#00c853] text-black font-extrabold text-xs cursor-pointer"
          >
            Save to Directory
          </button>
        </form>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayMembers.map((member) => {
          const isBlocked = !!member.blocked;
          return (
            <div
              key={member.id}
              className={`relative p-5 rounded-2xl border text-center transition-all duration-300 group space-y-3 overflow-hidden ${
                isBlocked
                  ? 'bg-red-500/5 dark:bg-red-950/10 border-red-500/20'
                  : darkMode
                  ? 'bg-[#202020]/50 border-slate-800 hover:border-slate-700 shadow-xs'
                  : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
              }`}
            >
              {deleteConfirmId === member.id && (
                <div className="absolute inset-0 bg-slate-950/95 p-4 flex flex-col justify-center items-center text-center z-30 space-y-3">
                  <p className="text-xs font-bold text-white">Delete {member.name}?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id, member.name)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Avatar */}
              <div className="relative w-16 h-16 mx-auto">
                <img
                  src={member.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`}
                  alt={member.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-xs"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-[#18181b] ${
                    member.status === 'ONLINE' ? 'bg-[#00c853]' : 'bg-slate-400'
                  }`}
                />
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  {member.name}
                </h4>
                <p className="text-xs text-[#00c853] font-semibold mt-1">{member.role}</p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c853]" />
                <span>{member.status || 'ONLINE'}</span>
              </div>

              {isAdmin && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleToggleBlock(member)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 rounded"
                    title={member.blocked ? 'Unblock Member' : 'Suspend Member'}
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(member.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                    title="Delete Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {displayMembers.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
            No workforce members registered in the directory.
          </div>
        )}
      </div>
    </motion.div>
  );
}
export default TeamPage;
