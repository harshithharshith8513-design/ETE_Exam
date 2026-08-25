import React from 'react';
import { Search, Filter, ArrowUpDown, RotateCcw } from 'lucide-react';

const DOMAIN_OPTIONS = [
  'All',
  'AI/ML',
  'HealthTech',
  'FinTech',
  'CleanTech',
  'EdTech',
  'Cybersecurity',
  'IoT / Robotics',
  'Other'
];

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'prototype', label: 'Prototype' },
  { value: 'implemented', label: 'Implemented' }
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most_voted', label: 'Most Voted 🔥' }
];

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedDomain,
  setSelectedDomain,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  onReset
}) => {
  return (
    <div className="glass-card rounded-3xl p-4 space-y-3 md:space-y-0 md:flex md:items-center md:space-x-3 justify-between shadow-lg border border-emerald-200/80 dark:border-purple-500/30">
      {/* Real-time Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-emerald-700 dark:text-purple-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Title, Problem, or Tech tag (e.g. PyTorch, IoT)..."
          className="w-full bg-white text-slate-900 placeholder-slate-500 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400 rounded-2xl pl-10 pr-4 py-2.5 border border-slate-300 dark:border-purple-500/30 focus:outline-none focus:border-emerald-500 dark:focus:border-purple-400 transition-all text-sm font-semibold shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filters Group */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Domain Filter */}
        <div className="relative flex-1 min-w-[130px]">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white rounded-2xl px-3 py-2.5 border border-slate-300 dark:border-purple-500/30 text-xs font-bold focus:outline-none focus:border-emerald-500 dark:focus:border-purple-400 cursor-pointer shadow-sm"
          >
            <option value="All" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">All Domains</option>
            {DOMAIN_OPTIONS.filter((d) => d !== 'All').map((d) => (
              <option key={d} value={d} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative flex-1 min-w-[130px]">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white rounded-2xl px-3 py-2.5 border border-slate-300 dark:border-purple-500/30 text-xs font-bold focus:outline-none focus:border-emerald-500 dark:focus:border-purple-400 cursor-pointer shadow-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="relative min-w-[140px]">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-emerald-50 text-emerald-950 border-emerald-300 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-500/40 rounded-2xl px-3 py-2.5 border text-xs font-extrabold focus:outline-none cursor-pointer shadow-sm"
          >
            {SORT_OPTIONS.map((so) => (
              <option key={so.value} value={so.value} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                {so.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters Button */}
        {(searchQuery || selectedDomain !== 'All' || selectedStatus !== 'All' || sortBy !== 'newest') && (
          <button
            onClick={onReset}
            className="p-2.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-purple-950/60 dark:hover:bg-purple-900/60 rounded-2xl border border-slate-300 dark:border-purple-500/30 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
