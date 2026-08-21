import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { WorkflowStatusStepper } from '../components/WorkflowStatusStepper';
import { VoteButton } from '../components/VoteButton';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../hooks/useBookmarks';
import {
  ArrowLeft,
  Calendar,
  User,
  Zap,
  Cpu,
  Bookmark,
  Edit3,
  Trash2,
  Clock
} from 'lucide-react';

export const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIdea = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ideas/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setIdea(data.idea);
      } else {
        setError(data.message || 'Idea not found');
      }
    } catch (err) {
      setError('Failed to load idea details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdea();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="glass-card rounded-3xl p-8 border animate-pulse space-y-6">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="glass-card rounded-3xl p-8 border shadow-lg">
          <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400">Error Loading Idea</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{error || 'Idea not found'}</p>
          <Link
            to="/ideas"
            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 dark:bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Gallery</span>
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && idea.author && (user._id === idea.author._id || user._id === idea.author);
  const bookmarked = isBookmarked(idea._id);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${idea.title}"?`)) {
      const token = localStorage.getItem('ideahub_token');
      try {
        const res = await fetch(`/api/ideas/${idea._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          navigate('/ideas');
        } else {
          alert(data.message || 'Failed to delete idea');
        }
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Back Navigation */}
      <Link
        to="/ideas"
        className="inline-flex items-center space-x-2 text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Ideas Gallery</span>
      </Link>

      {/* Main Idea Details Container */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-200/80 dark:border-purple-500/30 bg-white dark:bg-[#130924] space-y-6 shadow-xl">
        {/* Header Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-500/40">
              {idea.domain}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 capitalize">
              Stage: {idea.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleBookmark(idea._id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                bookmarked
                  ? 'bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:text-slate-900 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700 dark:hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
              <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            {isAuthor && (
              <>
                <Link
                  to={`/ideas/${idea._id}/edit`}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 text-amber-700 hover:bg-amber-50 border border-slate-300 dark:bg-slate-800 dark:text-amber-300 dark:border-slate-700 text-xs font-bold transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-500/40 text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
          {idea.title}
        </h1>

        {/* Author & Timestamp */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
              {idea.author?.name ? idea.author.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-slate-900 dark:text-slate-200 font-bold">{idea.author?.name || 'Anonymous Author'}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Submitted {new Date(idea.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Workflow Progression Stepper */}
        <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Pipeline Progression Workflow
          </h4>
          <WorkflowStatusStepper currentStatus={idea.status} />
        </div>

        {/* Problem Statement Box */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 space-y-2">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-200 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Problem Statement</span>
          </h3>
          <p className="text-sm text-slate-800 dark:text-slate-300 font-medium leading-relaxed">
            {idea.problemStatement}
          </p>
        </div>

        {/* Detailed Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-200">Architecture & Technical Solution</h3>
          <div className="text-sm text-slate-800 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-line bg-slate-50/80 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {idea.description}
          </div>
        </div>

        {/* Technologies Tags */}
        <div className="space-y-2">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-200">Engineered Technologies & Stack</h3>
          <div className="flex flex-wrap gap-2">
            {idea.technologies?.map((tech, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold dark:bg-slate-900 dark:text-indigo-300 dark:border-slate-700/80"
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-indigo-400" />
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Expected Impact Card */}
        <div className="rounded-2xl p-5 border border-emerald-300 bg-emerald-50/80 dark:border-emerald-500/30 dark:bg-purple-950/40 space-y-2">
          <h3 className="text-sm font-black text-emerald-800 dark:text-emerald-400 flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Expected Impact & Measurable Outcome</span>
          </h3>
          <p className="text-sm text-slate-900 dark:text-slate-200 font-semibold leading-relaxed">
            {idea.expectedImpact}
          </p>
        </div>

        {/* Footer Vote Action Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Support this proposal by casting your community vote
          </span>
          <VoteButton
            ideaId={idea._id}
            initialVotes={idea.votes || 0}
            initialVotedBy={idea.votedBy || []}
            onVoteChange={(newVotes) => setIdea({ ...idea, votes: newVotes })}
          />
        </div>
      </div>
    </div>
  );
};
