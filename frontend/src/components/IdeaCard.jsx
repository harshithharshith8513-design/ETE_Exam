import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Eye, Edit3, Trash2, Zap, Cpu, User, ShieldCheck } from 'lucide-react';
import { VoteButton } from './VoteButton';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../hooks/useBookmarks';

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', style: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700' },
  under_review: { label: 'Under Review', style: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/30' },
  approved: { label: 'Approved', style: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-500/30' },
  prototype: { label: 'Prototype', style: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-500/30' },
  implemented: { label: 'Implemented', style: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30' }
};

const DOMAIN_COLORS = {
  'AI/ML': 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-500/30',
  'HealthTech': 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-500/30',
  'FinTech': 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-500/30',
  'CleanTech': 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/70 dark:text-teal-300 dark:border-teal-500/30',
  'EdTech': 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-500/30',
  'Cybersecurity': 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-500/30',
  'IoT / Robotics': 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-500/30',
  'Other': 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
};

export const IdeaCard = ({ idea, onDelete, onVoteChange }) => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const navigate = useNavigate();

  if (!idea) return null;

  const isAuthor = user && idea.author && (user._id === idea.author._id || user._id === idea.author);
  const isAdmin = user && user.role === 'admin';
  const canManage = isAuthor || isAdmin;
  const bookmarked = isBookmarked(idea._id);

  const statusStyle = STATUS_CONFIG[idea.status] || STATUS_CONFIG.submitted;
  const domainStyle = DOMAIN_COLORS[idea.domain] || DOMAIN_COLORS.Other;

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`[Admin/Author] Are you sure you want to delete "${idea.title}"?`)) {
      if (onDelete) onDelete(idea._id);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between group hover:shadow-xl dark:hover:border-purple-500/50 hover:border-emerald-500/40 relative">
      <div>
        {/* Top Header Row: Domain Badge & Status Badge & Bookmark Button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${domainStyle}`}>
              {idea.domain}
            </span>
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${statusStyle.style}`}>
              {statusStyle.label}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(idea._id);
            }}
            className={`p-1.5 rounded-xl border transition-colors ${
              bookmarked
                ? 'bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-900 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700 dark:hover:text-white'
            }`}
            title={bookmarked ? 'Remove Bookmark' : 'Bookmark Idea'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <Link to={`/ideas/${idea._id}`} className="block group-hover:text-emerald-700 dark:group-hover:text-purple-300 transition-colors">
          <h3 className="text-lg font-black text-slate-900 dark:text-white line-clamp-2 leading-snug mb-2">
            {idea.title}
          </h3>
        </Link>

        {/* Problem Statement Snippet */}
        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed font-semibold">
          {idea.problemStatement}
        </p>

        {/* Technology Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {idea.technologies && idea.technologies.slice(0, 4).map((tech, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-500/30"
            >
              <Cpu className="w-3 h-3 text-emerald-600 dark:text-purple-400" />
              <span>{tech}</span>
            </span>
          ))}
          {idea.technologies && idea.technologies.length > 4 && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 self-center font-bold">
              +{idea.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* Expected Impact Highlight */}
        <div className="rounded-2xl p-3.5 border mb-4 bg-emerald-50/70 border-emerald-200 text-slate-900 dark:bg-purple-950/40 dark:border-purple-500/30 dark:text-slate-200">
          <div className="flex items-center space-x-1.5 text-xs font-black text-emerald-800 dark:text-emerald-400 mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Expected Impact</span>
          </div>
          <p className="text-xs text-slate-800 dark:text-purple-200 line-clamp-2 font-bold">
            {idea.expectedImpact}
          </p>
        </div>
      </div>

      {/* Footer Row: Author, Vote Button, Action triggers */}
      <div className="pt-3 border-t border-slate-200 dark:border-purple-500/20 flex items-center justify-between">
        {/* Author info */}
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-400">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="max-w-[100px] truncate">
            {idea.author?.name || 'Anonymous'}
          </span>
        </div>

        {/* Vote & Actions */}
        <div className="flex items-center space-x-2">
          <VoteButton
            ideaId={idea._id}
            initialVotes={idea.votes || 0}
            initialVotedBy={idea.votedBy || []}
            onVoteChange={onVoteChange}
          />

          <div className="flex items-center space-x-1 border-l border-slate-200 dark:border-slate-800 pl-2">
            <Link
              to={`/ideas/${idea._id}`}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-purple-900/40 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>

            {canManage && (
              <>
                <Link
                  to={`/ideas/${idea._id}/edit`}
                  className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-purple-900/40 rounded-lg transition-colors"
                  title={isAdmin ? "Admin Edit" : "Edit Idea"}
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-100 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  title={isAdmin ? "Admin Delete" : "Delete Idea"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
