import React, { useState, useEffect, useCallback } from 'react';
import { FilterBar } from '../components/FilterBar';
import { IdeaCard } from '../components/IdeaCard';
import { Pagination } from '../components/Pagination';
import { Grid, Sparkles } from 'lucide-react';

export const IdeasGallery = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalIdeasCount, setTotalIdeasCount] = useState(0);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9,
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
      console.error('Error fetching gallery ideas:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedDomain, selectedStatus, sortBy]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

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
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchIdeas();
      } else {
        alert(data.message || 'Failed to delete idea');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card rounded-3xl p-6 border shadow-lg">
        <div>
          <h1 className="text-2xl font-black theme-text-main flex items-center space-x-2">
            <Grid className="w-6 h-6 opacity-90" />
            <span>Innovation Gallery Feed</span>
          </h1>
          <p className="text-sm font-medium theme-text-muted mt-1">
            Browse all user-submitted ideas, sort by community votes, or filter by engineering domain.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full theme-badge">
            {totalIdeasCount} Total Proposals
          </span>
        </div>
      </div>

      {/* Filter Bar */}
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

      {/* Ideas Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-card rounded-3xl p-5 border animate-pulse h-64"></div>
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Ideas Found</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Try adjusting your filters or search keywords.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-orange-500 dark:bg-purple-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-orange-600 dark:hover:bg-purple-500"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} onDelete={handleDeleteIdea} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  );
};
