import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IdeaForm } from '../components/IdeaForm';
import { Edit3, ArrowLeft, AlertCircle } from 'lucide-react';

export const EditIdea = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIdea = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ideas/${id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setInitialData(data.idea);
        } else {
          setError(data.message || 'Idea not found');
        }
      } catch (err) {
        setError('Failed to fetch idea for editing');
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  const handleEditSubmit = async (formData) => {
    const token = localStorage.getItem('ideahub_token');

    const res = await fetch(`/api/ideas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update innovation idea');
    }

    navigate(`/ideas/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="glass-card rounded-3xl p-8 border border-emerald-200/80 dark:border-slate-800 bg-white dark:bg-[#130924] animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="glass-card rounded-3xl p-8 border border-emerald-200/80 dark:border-slate-800 bg-white dark:bg-[#130924] shadow-xl">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">Edit Error</h2>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{error || 'Idea not found'}</p>
          <Link
            to="/ideas"
            className="mt-4 inline-block px-4 py-2 bg-emerald-600 dark:bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 dark:hover:bg-indigo-700 shadow-md"
          >
            Return to Ideas Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <Link
        to={`/ideas/${id}`}
        className="inline-flex items-center space-x-2 text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Idea Details</span>
      </Link>

      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-200/80 dark:border-purple-500/30 bg-white dark:bg-[#130924] space-y-6 shadow-2xl">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-600/30 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <Edit3 className="w-5 h-5" />
            </div>
            <span>Edit Innovation Proposal</span>
          </h1>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
            Update specifications, domain tags, or progress status for "{initialData.title}".
          </p>
        </div>

        <IdeaForm
          initialValues={initialData}
          onSubmit={handleEditSubmit}
          submitLabel="Save & Update Idea"
          isEditing={true}
        />
      </div>
    </div>
  );
};
