import React from 'react';
import { CheckCircle2, Circle, Clock, Check, Wrench, Sparkles } from 'lucide-react';

const STATUS_STEPS = [
  { id: 'submitted', label: 'Submitted', color: 'slate', icon: Clock },
  { id: 'under_review', label: 'Under Review', color: 'amber', icon: Circle },
  { id: 'approved', label: 'Approved', color: 'blue', icon: CheckCircle2 },
  { id: 'prototype', label: 'Prototype', color: 'purple', icon: Wrench },
  { id: 'implemented', label: 'Implemented', color: 'emerald', icon: Sparkles }
];

export const WorkflowStatusStepper = ({ currentStatus = 'submitted' }) => {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.id === currentStatus);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Background Connector Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-300 dark:bg-slate-800 -translate-y-1/2 z-0" />
        
        {/* Active Connector Progress Line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{
            width: `${(Math.max(0, currentIndex) / (STATUS_STEPS.length - 1)) * 100}%`
          }}
        />

        {STATUS_STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white dark:text-slate-950 ring-4 ring-emerald-500/20 shadow-md shadow-emerald-500/30'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30 shadow-lg shadow-indigo-500/40 animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-300 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                    : isCompleted
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
