import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Clock, TrendingUp, CheckCircle, AlertTriangle, User, Calendar, Trash2 } from 'lucide-react';
import { supabase } from '../../supabase';
import type { CRMProject } from '../../types/crm';

interface KanbanBoardProps {
  darkMode: boolean;
  isAdmin?: boolean;
  triggerToast?: (msg: string) => void;
}

const STAGES: Array<{ id: CRMProject['status']; label: string; color: string; border: string }> = [
  { id: 'ON TRACK', label: 'On Track (Active)', color: 'text-emerald-500 bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'IN REVIEW', label: 'In Review & Testing', color: 'text-amber-500 bg-amber-500/10', border: 'border-amber-500/30' },
  { id: 'STABLE', label: 'Stable (Deploy Ready)', color: 'text-blue-500 bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'OFF TRACK', label: 'Off Track / Blocked', color: 'text-red-500 bg-red-500/10', border: 'border-red-500/30' },
];

export function KanbanBoard({ darkMode, isAdmin = true, triggerToast }: KanbanBoardProps) {
  const [projects, setProjects] = useState<CRMProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newLeadName, setNewLeadName] = useState('');
  const [newBudget, setNewBudget] = useState('₹45,000');

  // Load projects from Supabase crm_projects table (Postgres persistence)
  const fetchCrmProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[CRM Kanban] Load error:', error.message);
        // Fallback to local cache if offline
        const local = localStorage.getItem('digiworku-crm-projects-v2');
        if (local) setProjects(JSON.parse(local));
      } else if (data) {
        const mapped: CRMProject[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          leadName: d.lead_name || 'DigiWorku Client',
          leadAvatar: d.lead_avatar || 'DW',
          status: d.status || 'ON TRACK',
          healthScore: d.health_score ?? 100,
          budget: d.budget || '₹45,000',
          description: d.description || '',
          progress: d.progress ?? 0,
          email: d.email || '',
        }));
        setProjects(mapped);
        localStorage.setItem('digiworku-crm-projects-v2', JSON.stringify(mapped));
      }
    } catch (err: any) {
      console.error('[CRM Kanban] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrmProjects();

    // Realtime channel for crm_projects
    const sub = supabase
      .channel('crm-projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'crm_projects' },
        () => {
          fetchCrmProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  const handleUpdateStatus = async (projectId: string, nextStatus: CRMProject['status']) => {
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: nextStatus } : p))
    );

    try {
      const { error } = await supabase
        .from('crm_projects')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', projectId);

      if (error) {
        console.error('[CRM] Status update failed:', error.message);
      } else if (triggerToast) {
        triggerToast(`Updated project status to "${nextStatus}"`);
      }
    } catch (err: any) {
      console.error('[CRM] Update error:', err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const payload = {
      name: newProjectName.trim(),
      lead_name: newLeadName.trim() || 'Client Lead',
      lead_avatar: (newLeadName.trim() || 'CL').slice(0, 2).toUpperCase(),
      status: 'ON TRACK',
      health_score: 100,
      budget: newBudget,
      description: 'Active client engagement sprint',
      progress: 25,
    };

    try {
      const { data, error } = await supabase
        .from('crm_projects')
        .insert(payload)
        .select()
        .single();

      if (error) {
        alert(`Failed to persist CRM project in Postgres: ${error.message}`);
        return;
      }

      if (data) {
        const created: CRMProject = {
          id: data.id,
          name: data.name,
          leadName: data.lead_name,
          leadAvatar: data.lead_avatar,
          status: data.status,
          healthScore: data.health_score,
          budget: data.budget,
          description: data.description,
          progress: data.progress,
        };
        setProjects((prev) => [created, ...prev]);
        setNewProjectName('');
        setNewLeadName('');
        setIsAdding(false);
        if (triggerToast) triggerToast('🎉 New project created and persisted to database!');
      }
    } catch (err: any) {
      console.error('[CRM] Insert error:', err);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Permanently delete project "${name}"?`)) return;

    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await supabase.from('crm_projects').delete().eq('id', id);
      if (triggerToast) triggerToast(`Deleted project "${name}".`);
    } catch (err: any) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Enterprise CRM Kanban Board</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Realtime multi-tenant project milestones persisted in PostgreSQL
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="py-2.5 px-4 rounded-xl bg-[#00c853] hover:bg-[#00b548] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Cancel' : 'New Project'}</span>
          </button>
        )}
      </div>

      {/* Add Project Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateProject}
          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] space-y-3"
        >
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Initialize Client Sprint</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project Name (e.g. Next.js SaaS Platform)"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#00c853]"
              required
            />
            <input
              type="text"
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
              placeholder="Client / Lead Name"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#00c853]"
            />
            <input
              type="text"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder="Budget (e.g. ₹65,000)"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#00c853]"
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 rounded-xl bg-[#00c853] text-black font-extrabold text-xs cursor-pointer"
          >
            Create & Save to Database
          </button>
        </form>
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const colProjects = projects.filter((p) => p.status === stage.id);

          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-[#18181b]/50 p-3 min-h-[450px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${stage.color}`}>
                  {stage.label}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {colProjects.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#202024] shadow-xs hover:shadow-md transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug">
                        {project.name}
                      </h4>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{project.leadName}</span>
                      </div>
                      <span className="font-mono font-bold text-[#00c853]">{project.budget}</span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                        <span>Sprint Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-[#00c853] rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Status Cycler (Admin quick-change) */}
                    {isAdmin && (
                      <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60">
                        <span className="text-[10px] font-bold text-slate-400">Move to:</span>
                        <div className="flex gap-1">
                          {STAGES.filter((s) => s.id !== project.status).map((s) => (
                            <button
                              key={s.id}
                              onClick={() => handleUpdateStatus(project.id, s.id)}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-[#00c853] hover:text-black transition-colors cursor-pointer"
                              title={`Move to ${s.label}`}
                            >
                              {s.id.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {colProjects.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No projects in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default KanbanBoard;
