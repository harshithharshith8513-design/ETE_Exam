import React from 'react';
import { Lightbulb, TrendingUp, Layers, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StatsDashboard = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-5 border animate-pulse space-y-4">
        <div className="h-6 bg-white/10 rounded w-1/2"></div>
        <div className="h-20 bg-white/10 rounded-xl"></div>
        <div className="h-32 bg-white/10 rounded-xl"></div>
      </div>
    );
  }

  if (!stats) return null;

  const { totalIdeas = 0, statusCounts = {}, topDomains = [], topVotedIdea = null } = stats;

  const STATUS_CONFIG = [
    { key: 'submitted', label: 'Submitted', color: 'bg-slate-500' },
    { key: 'under_review', label: 'Under Review', color: 'bg-amber-500' },
    { key: 'approved', label: 'Approved', color: 'bg-blue-500' },
    { key: 'prototype', label: 'Prototype', color: 'bg-purple-500' },
    { key: 'implemented', label: 'Implemented', color: 'bg-emerald-500' }
  ];

  return (
    <div className="space-y-4">
      {/* Total Ideas Stat Banner */}
      <div className="glass-card rounded-3xl p-5 border shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider theme-text-muted">
            Total Pipeline Ideas
          </span>
          <div className="w-8 h-8 rounded-xl theme-badge flex items-center justify-center">
            <Lightbulb className="w-4 h-4 opacity-90" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-black theme-text-main">{totalIdeas}</span>
          <span className="text-xs font-bold theme-text-muted">active submissions</span>
        </div>
      </div>

      {/* Status Breakdown Box */}
      <div className="glass-card rounded-3xl p-5 border shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-black theme-text-main flex items-center space-x-2">
            <Layers className="w-4 h-4 opacity-90" />
            <span>Workflow Statuses</span>
          </h4>
        </div>

        <div className="space-y-3">
          {STATUS_CONFIG.map((status) => {
            const count = statusCounts[status.key] || 0;
            const pct = totalIdeas > 0 ? Math.round((count / totalIdeas) * 100) : 0;
            return (
              <div key={status.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="theme-text-main">{status.label}</span>
                  <span className="theme-text-muted">{count} ({pct}%)</span>
                </div>
                <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${status.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Domains Breakdown */}
      <div className="glass-card rounded-3xl p-5 border shadow-lg">
        <h4 className="text-sm font-black theme-text-main flex items-center space-x-2 mb-3">
          <TrendingUp className="w-4 h-4 opacity-90" />
          <span>Top Innovation Domains</span>
        </h4>
        <div className="space-y-2">
          {topDomains.slice(0, 4).map((d, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-2xl theme-badge text-xs"
            >
              <span className="font-bold theme-text-main">{d.domain}</span>
              <div className="flex items-center space-x-2">
                <span className="font-black theme-text-main">{d.count} ideas</span>
                <span className="text-[10px] theme-text-main font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                  {d.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Voted Idea Highlight */}
      {topVotedIdea && (
        <div className="glass-card rounded-3xl p-4 border theme-badge shadow-lg">
          <div className="flex items-center space-x-1.5 text-xs font-black mb-2 opacity-90">
            <Award className="w-4 h-4" />
            <span>Community Choice #1</span>
          </div>
          <Link
            to={`/ideas/${topVotedIdea._id}`}
            className="text-sm font-black theme-text-main hover:opacity-80 line-clamp-2 transition-colors"
          >
            {topVotedIdea.title}
          </Link>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10 dark:border-white/10 text-xs theme-text-muted">
            <span className="font-bold">{topVotedIdea.domain}</span>
            <span className="font-black">{topVotedIdea.votes} Votes</span>
          </div>
        </div>
      )}
    </div>
  );
};
