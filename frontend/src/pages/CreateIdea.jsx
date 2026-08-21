import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IdeaForm } from '../components/IdeaForm';
import { useAuth } from '../context/AuthContext';
import { Lightbulb, ArrowLeft, Lock } from 'lucide-react';

export const CreateIdea = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCreateSubmit = async (formData) => {
    const token = localStorage.getItem('ideahub_token');

    const res = await fetch('/api/ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create innovation idea');
    }

    // On success navigate to detailed view
    navigate(`/ideas/${data.idea._id}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16">
        <div className="glass-card rounded-3xl p-8 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Authentication Required</h2>
          <p className="text-sm text-slate-400">
            Please log in or register an account to submit your innovation proposal to the platform feed.
          </p>
          <div className="pt-2 flex justify-center space-x-3">
            <Link
              to="/login"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors"
            >
              Login Now
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm border border-slate-700 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <Link
        to="/ideas"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Ideas</span>
      </Link>

      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span>Submit New Innovation Proposal</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Propose a new technological breakthrough. All fields marked with * are validated dynamically.
          </p>
        </div>

        <IdeaForm onSubmit={handleCreateSubmit} submitLabel="Submit Innovation Proposal" />
      </div>
    </div>
  );
};
