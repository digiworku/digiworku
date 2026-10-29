import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Search, MessageSquare, Phone, Mail, CheckCircle2 } from 'lucide-react';
import type { ChatThread } from '../types/crm';

interface ClientPortalPageProps {
  clients: ChatThread[];
  darkMode: boolean;
  onOpenClientChat: (clientId: string, clientName: string) => void;
  triggerToast?: (msg: string) => void;
}

export function ClientPortalPage({
  clients,
  darkMode,
  onOpenClientChat,
  triggerToast,
}: ClientPortalPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      key="tab-clients"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5.5 h-5.5 text-emerald-500" />
            <span>Corporate Client Directory & Portal</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Directory of enterprise partners with live progress tracking and direct communication lines.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-56 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#00c853] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((client) => (
          <div
            key={client.id}
            className={`p-5 rounded-2xl border transition-all ${
              darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="relative inline-block">
                  <img
                    src={client.avatarUrl}
                    alt={client.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                      client.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    {client.name}
                  </h3>
                  <p className="text-[11px] text-[#00c853] font-bold mt-0.5">{client.companyName}</p>
                </div>
              </div>

              <button
                onClick={() => onOpenClientChat(client.id, client.name)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-[#00c853] transition-all cursor-pointer"
                title="Open Client Channel"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span className="font-medium">Direct Line:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{client.phone || '+91 95212 07156'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Work Email:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[160px]">{client.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Active Contract:</span>
                <span className="font-bold text-[#00c853]">{client.activeProjectName}</span>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-[11px] mb-1 font-bold">
                <span className="text-slate-400 uppercase tracking-widest text-[9.5px]">Contract Progress</span>
                <span className="text-[#00c853]">{client.activeProjectProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#00c853] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${client.activeProjectProgress}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
            No clients found matching query.
          </div>
        )}
      </div>
    </motion.div>
  );
}
export default ClientPortalPage;
