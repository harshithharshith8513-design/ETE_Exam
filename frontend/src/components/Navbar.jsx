import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Lightbulb,
  PlusCircle,
  LayoutDashboard,
  Grid,
  LogOut,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { themeMode, currentPreset, themePresets, setThemeByMode, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isAdmin = user && user.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 glass-pill-nav border-b border-emerald-200/60 dark:border-purple-500/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
              isDark
                ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-purple-600/30'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-600/30'
            }`}>
              <Lightbulb className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 dark:from-white dark:via-purple-200 dark:to-purple-400 bg-clip-text text-transparent">
                IdeaHub
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-500/40">
                MERN Enterprise
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/')
                  ? isDark
                    ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : isDark
                  ? 'text-purple-200 hover:text-white hover:bg-purple-950/40'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-purple-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/ideas"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/ideas')
                  ? isDark
                    ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : isDark
                  ? 'text-purple-200 hover:text-white hover:bg-purple-950/40'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Grid className="w-4 h-4 text-emerald-600 dark:text-purple-400" />
              <span>Ideas Feed</span>
            </Link>
          </div>

          {/* Controls & Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Sun/Moon Toggle Switch */}
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
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isDark
                    ? 'bg-purple-950/60 border-purple-500/30 text-purple-200 hover:border-purple-400'
                    : 'bg-white border-emerald-300 text-slate-900 hover:border-emerald-500'
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
                    : 'bg-white border-emerald-300 text-slate-900'
                }`}>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 text-slate-400">
                    Select Theme Preset
                  </p>
                  {themePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setThemeByMode(preset.mode);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
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

            {/* Submit Idea CTA */}
            <Link
              to="/ideas/create"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Idea</span>
            </Link>

            {/* Auth Profile / Login Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 border-l border-slate-300 dark:border-purple-500/30 pl-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs shadow-md ${
                    isAdmin ? 'bg-purple-600 text-white ring-2 ring-amber-400' : 'bg-emerald-600 text-white'
                  }`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left leading-tight">
                    <div className="flex items-center space-x-1">
                      <p className="text-xs font-black text-slate-900 dark:text-slate-100 max-w-[110px] truncate">
                        {user?.name}
                      </p>
                      {isAdmin && (
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" title="System Admin" />
                      )}
                    </div>
                    <p className={`text-[10px] font-extrabold ${
                      isAdmin ? 'text-amber-600 dark:text-amber-400 uppercase tracking-wider' : 'text-slate-500 dark:text-purple-300'
                    }`}>
                      {isAdmin ? 'System Admin' : 'Author'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-slate-300 dark:border-purple-500/30 pl-3">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-purple-200 dark:hover:text-white dark:hover:bg-purple-950/40 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-500/40 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-purple-900/40"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden mt-2 rounded-3xl p-4 border shadow-2xl space-y-3 transition-all ${
          isDark ? 'bg-purple-950/95 border-purple-500/40 text-white' : 'bg-white border-emerald-300 text-slate-900'
        }`}>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-purple-900/40"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-purple-400" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/ideas"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-purple-900/40"
          >
            <Grid className="w-4 h-4 text-emerald-600 dark:text-purple-400" />
            <span>Ideas Feed</span>
          </Link>
          <Link
            to="/ideas/create"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit New Idea</span>
          </Link>
        </div>
      )}
    </nav>
  );
};
