import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const VoteButton = ({ ideaId, initialVotes = 0, initialVotedBy = [], onVoteChange }) => {
  const { user, token } = useAuth();

  const getSessionVoterId = () => {
    let sessionKey = sessionStorage.getItem('ideahub_voter_id');
    if (!sessionKey) {
      sessionKey = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem('ideahub_voter_id', sessionKey);
    }
    return sessionKey;
  };

  const voterId = user ? user._id : getSessionVoterId();

  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(() => {
    if (initialVotedBy && Array.isArray(initialVotedBy)) {
      return initialVotedBy.includes(voterId);
    }
    const votedList = JSON.parse(sessionStorage.getItem('voted_ideas') || '[]');
    return votedList.includes(ideaId);
  });
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setVotes(initialVotes);
    if (initialVotedBy && Array.isArray(initialVotedBy)) {
      setHasVoted(initialVotedBy.includes(voterId));
    }
  }, [initialVotes, initialVotedBy, voterId]);

  const handleVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    setAnimating(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/ideas/${ideaId}/vote`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ voterId })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setVotes(data.votes);
        setHasVoted(data.hasVoted);

        const votedList = JSON.parse(sessionStorage.getItem('voted_ideas') || '[]');
        let updatedList;
        if (data.hasVoted) {
          updatedList = [...new Set([...votedList, ideaId])];
        } else {
          updatedList = votedList.filter((id) => id !== ideaId);
        }
        sessionStorage.setItem('voted_ideas', JSON.stringify(updatedList));

        if (onVoteChange) {
          onVoteChange(data.votes, data.hasVoted);
        }
      }
    } catch (err) {
      console.error('Failed to register vote:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
        hasVoted
          ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/30 dark:bg-purple-600 dark:border-purple-500 dark:shadow-purple-600/30'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700'
      } ${animating ? 'scale-110' : 'scale-100'}`}
      title={hasVoted ? 'Click to remove vote' : 'Vote for this idea'}
    >
      <ThumbsUp
        className={`w-3.5 h-3.5 transition-transform ${
          hasVoted ? 'fill-white text-white' : 'text-slate-400'
        } ${animating ? 'rotate-[-12deg]' : ''}`}
      />
      <span>{votes}</span>
      <span className="font-semibold opacity-90">{votes === 1 ? 'Vote' : 'Votes'}</span>
    </button>
  );
};
