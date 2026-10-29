import React from 'react';
import { CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';
import type { CRMProject } from '../../types/crm';

interface ProjectTimelineProps {
  projects: CRMProject[];
  darkMode: boolean;
}

export function ProjectTimeline({ projects, darkMode }: ProjectTimelineProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">Active Milestone Deliverables</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Weekly sprint velocity & SLA checkpoints</p>
      </div>

      <div className="space-y-4">
        {projects.map((proj) => {
          const isDone = proj.progress === 100;
          return (
            <div
              key={proj.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{proj.name}</h4>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isDone
                        ? 'bg-emerald-500/15 text-[#00c853]'
                        : 'bg-blue-500/15 text-blue-500'
                    }`}
                  >
                    {isDone ? 'COMPLETED' : `${proj.progress}% COMPLETE`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Client: {proj.leadName} • Allocated Budget: {proj.budget}
                </p>
              </div>

              {/* Milestones steps */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                {['Scope & Architecture', 'Design & Prototype', 'Core Engineering', 'QA & Delivery'].map(
                  (stepName, idx) => {
                    const stepThreshold = (idx + 1) * 25;
                    const isStepComplete = proj.progress >= stepThreshold;
                    const isCurrent = proj.progress >= stepThreshold - 25 && proj.progress < stepThreshold;

                    return (
                      <div
                        key={stepName}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold shrink-0 ${
                          isStepComplete
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-[#00c853]'
                            : isCurrent
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        {isStepComplete ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{stepName}</span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No projects in active timeline.
          </div>
        )}
      </div>
    </div>
  );
}
export default ProjectTimeline;
