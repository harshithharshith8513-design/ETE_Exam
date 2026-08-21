import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Send,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const NAV_TABS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'about', label: 'About', path: '/ideas' },
  { id: 'projects', label: 'Projects', path: '/ideas' },
  { id: 'services', label: 'Services', path: '/ideas' },
  { id: 'experience', label: 'Experience', path: '/ideas' },
  { id: 'contact', label: 'Contact', path: '/ideas/create' }
];

export const FloatingPillNavbar = () => {
  const { themeMode, currentPreset, themePresets, toggleTheme, setThemeByMode, isDark } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('home');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
      <div className="glass-pill-nav rounded-full px-4 py-2.5 flex items-center justify-between shadow-2xl transition-all duration-300">
        {/* LEFT: Profile Avatar & Details */}
        <div className="flex items-center space-x-3 pl-1">
          <div className="relative group cursor-pointer" onClick={() => navigate('/')}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-105 ${
              isDark
                ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white ring-2 ring-purple-400/40'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white ring-2 ring-emerald-400/40'
            }`}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'ER'}
            </div>
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
              isDark ? 'bg-emerald-400 border-purple-950' : 'bg-emerald-500 border-white'
            }`} />
          </div>

          <div className="hidden sm:block text-left leading-tight">
            <h3 className={`text-xs font-bold transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {user?.name || 'Dr. Elena Rostova'}
            </h3>
            <p className={`text-[10px] font-semibold transition-colors ${
              isDark ? 'text-purple-300' : 'text-emerald-700'
            }`}>
              Principal Engineer
            </p>
          </div>
        </div>

        {/* CENTER: Segmented Navigation Pill Bar */}
        <nav className={`hidden lg:flex items-center p-1 rounded-full border shadow-inner ${
          isDark
            ? 'bg-purple-950/70 border-purple-500/30'
            : 'bg-emerald-50 border-emerald-200'
        }`}>
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-600/40'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : isDark
                    ? 'text-purple-200 hover:text-white'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Theme Controls Group */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Interactive Sun/Moon Segment Switch */}
          <div className={`p-1 rounded-full border transition-all duration-300 flex items-center ${
            isDark
              ? 'bg-purple-950/80 border-purple-500/40'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <button
              onClick={() => setThemeByMode('light')}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                !isDark
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="White & Emerald Mint Mode"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setThemeByMode('dark')}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Dark Violet & Lilac Mode"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Preset Selector Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isDark
                  ? 'bg-purple-950/60 border-purple-500/30 text-purple-200 hover:border-purple-400'
                  : 'bg-white border-emerald-200 text-slate-800 hover:border-emerald-400'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-emerald-600'}`} />
              <span className="max-w-[130px] truncate">{currentPreset.name}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75" />
            </button>

            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-2xl p-2 border shadow-2xl z-50 ${
                isDark
                  ? 'bg-purple-950/95 border-purple-500/40 text-purple-100'
                  : 'bg-white border-emerald-200 text-slate-900'
              }`}>
                <p className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 text-slate-400">
                  Select Theme Preset
                </p>
                {themePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setThemeByMode(preset.mode);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      themeMode === preset.mode
                        ? isDark
                          ? 'bg-purple-800/50 text-white font-bold'
                          : 'bg-emerald-100 text-emerald-900 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-purple-900/50'
                    }`}
                  >
                    <span>{preset.name}</span>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.accentPrimary }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA Action Button: "Get in Touch" */}
          <button
            onClick={() => navigate('/ideas/create')}
            className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-1.5 cursor-pointer ${
              isDark
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden mt-2 rounded-3xl p-4 border shadow-2xl space-y-2 transition-all ${
          isDark ? 'bg-purple-950/95 border-purple-500/30 text-white' : 'bg-white border-emerald-200 text-slate-900'
        }`}>
          <div className="grid grid-cols-2 gap-2">
            {NAV_TABS.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-center ${
                  activeTab === tab.id
                    ? isDark
                      ? 'bg-purple-800 text-white'
                      : 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 dark:bg-purple-900/40 text-slate-700 dark:text-purple-200'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/40 flex items-center justify-between">
            <span className="text-xs font-semibold">Active Preset:</span>
            <span className="text-xs font-bold text-emerald-700 dark:text-purple-400">{currentPreset.name}</span>
          </div>
        </div>
      )}
    </header>
  );
};
