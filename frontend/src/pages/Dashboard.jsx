import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import { IdeaCard } from '../components/IdeaCard';
import { StatsDashboard } from '../components/StatsDashboard';
import { Pagination } from '../components/Pagination';
import { PlusCircle, Sparkles, Rocket, Lightbulb } from 'lucide-react';

export const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalIdeasCount, setTotalIdeasCount] = useState(0);

  const fetchIdeas = useCallback(async () => {
    setLoadingIdeas(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 6,
        sort: sortBy
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedDomain !== 'All') params.append('domain', selectedDomain);
      if (selectedStatus !== 'All') params.append('status', selectedStatus);

      const res = await fetch(`/api/ideas?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setIdeas(data.ideas);
        setTotalPages(data.totalPages);
        setTotalIdeasCount(data.totalIdeas);
      }
    } catch (err) {
      console.error('Error fetching ideas:', err);
    } finally {
      setLoadingIdeas(false);
    }
  }, [currentPage, searchQuery, selectedDomain, selectedStatus, sortBy]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/ideas/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDomain('All');
    setSelectedStatus('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleDeleteIdea = async (id) => {
    const token = localStorage.getItem('ideahub_token');
    try {
      const res = await fetch(`/api/ideas/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchIdeas();
        fetchStats();
      } else {
        alert(data.message || 'Failed to delete idea');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden glass-card rounded-3xl p-8 border shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full theme-badge text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 opacity-90" />
            <span>MERN Stack Innovation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black theme-text-main tracking-tight leading-tight">
            Turn Breakthrough Concepts into{' '}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
              Deployed Realities
            </span>
          </h1>
          <p className="theme-text-muted text-sm sm:text-base leading-relaxed font-semibold">
            Collaborate, propose, and vote on cutting-edge technological ideas across AI, HealthTech, CleanTech, and FinTech. Track progression live from submission to implementation.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/ideas/create"
              className="px-5 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-all flex items-center space-x-2 hover:scale-105"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Innovation Idea</span>
            </Link>
            <Link
              to="/ideas"
              className="px-5 py-3 rounded-2xl font-bold text-sm theme-badge hover:opacity-80 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Rocket className="w-4 h-4 opacity-90" />
              <span>Explore Gallery</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Filter & Search Header Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleResetFilters}
      />

      {/* Main Grid: Ideas Feed (Left) & Side Stats Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black theme-text-main flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 opacity-90" />
              <span>Innovation Feed</span>
            </h2>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full theme-badge">
              {totalIdeasCount} {totalIdeasCount === 1 ? 'Idea' : 'Ideas'} Found
            </span>
          </div>

          {loadingIdeas ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="glass-card rounded-3xl p-5 border animate-pulse space-y-4 h-64"
                >
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : ideas.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center space-y-4 border shadow-lg">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-purple-950/80 border border-emerald-300 dark:border-purple-500/40 flex items-center justify-center mx-auto text-emerald-600 dark:text-purple-400">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Innovation Ideas Found</h3>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-400 max-w-md mx-auto">
                No ideas match your current search query or active filter selections. Try resetting filters or submit a new idea!
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-emerald-600 dark:bg-purple-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea._id}
                  idea={idea}
                  onDelete={handleDeleteIdea}
                  onVoteChange={() => fetchStats()}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>

        {/* Side Statistics Panel Column */}
        <div className="lg:col-span-4 sticky top-24">
          <StatsDashboard stats={stats} loading={loadingStats} />
        </div>
      </div>
    </div>
  );
};
