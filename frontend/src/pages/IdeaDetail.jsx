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
      <div className="glass-card rounded-3xl p-6 sm:p-8 border space-y-6 shadow-xl">
        {/* Header Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold theme-badge">
              {idea.domain}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold theme-badge capitalize">
              Stage: {idea.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleBookmark(idea._id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                bookmarked
                  ? 'bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
                  : 'theme-badge hover:opacity-80'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
              <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            {isAuthor && (
              <>
                <Link
                  to={`/ideas/${idea._id}/edit`}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-amber-600 hover:bg-amber-500/10 border border-amber-300 dark:border-amber-500/40 text-xs font-bold transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-500/10 border border-rose-300 dark:border-rose-500/40 text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black theme-text-main leading-tight">
          {idea.title}
        </h1>

        {/* Author & Timestamp */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold theme-text-muted pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-[10px]"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              {idea.author?.name ? idea.author.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="theme-text-main font-bold">{idea.author?.name || 'Anonymous Author'}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 opacity-70" />
            <span>Submitted {new Date(idea.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Workflow Progression Stepper */}
        <div className="theme-badge rounded-2xl p-5 border space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider theme-text-muted mb-2">
            Pipeline Progression Workflow
          </h4>
          <WorkflowStatusStepper currentStatus={idea.status} />
        </div>

        {/* Problem Statement Box */}
        <div className="theme-badge rounded-2xl p-5 border space-y-2">
          <h3 className="text-sm font-black theme-text-main flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Problem Statement</span>
          </h3>
          <p className="text-sm theme-text-main font-medium leading-relaxed opacity-90">
            {idea.problemStatement}
          </p>
        </div>

        {/* Detailed Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-black theme-text-main">Architecture & Technical Solution</h3>
          <div className="text-sm theme-text-main font-medium leading-relaxed whitespace-pre-line theme-badge p-5 rounded-2xl border">
            {idea.description}
          </div>
        </div>

        {/* Technologies Tags */}
        <div className="space-y-2">
          <h3 className="text-sm font-black theme-text-main">Engineered Technologies & Stack</h3>
          <div className="flex flex-wrap gap-2">
            {idea.technologies?.map((tech, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl theme-badge text-xs font-bold border"
              >
                <Cpu className="w-3.5 h-3.5 opacity-80" />
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Expected Impact Card */}
        <div className="rounded-2xl p-5 border theme-badge space-y-2">
          <h3 className="text-sm font-black theme-text-main flex items-center space-x-2">
            <Zap className="w-4 h-4 opacity-90" />
            <span>Expected Impact & Measurable Outcome</span>
          </h3>
          <p className="text-sm theme-text-main font-semibold leading-relaxed opacity-90">
            {idea.expectedImpact}
          </p>
        </div>

        {/* Footer Vote Action Bar */}
        <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs font-semibold theme-text-muted">
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
