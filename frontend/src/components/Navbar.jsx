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
  Palette,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { activeThemeId, currentPreset, themePresets, setThemeById, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isAdmin = user && user.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 glass-pill-nav border-b transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
              style={{ backgroundColor: currentPreset.accentPrimary }}
            >
              <Lightbulb className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-500 dark:from-white dark:to-purple-300 bg-clip-text text-transparent">
                IdeaHub
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full border opacity-90" style={{ borderColor: currentPreset.accentPrimary, color: currentPreset.textMain }}>
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
                  ? 'shadow-md text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: isActive('/') ? currentPreset.accentPrimary : 'transparent',
                color: isActive('/') ? '#FFFFFF' : currentPreset.textMain
              }}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/ideas"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/ideas')
                  ? 'shadow-md text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: isActive('/ideas') ? currentPreset.accentPrimary : 'transparent',
                color: isActive('/ideas') ? '#FFFFFF' : currentPreset.textMain
              }}
            >
              <Grid className="w-4 h-4" />
              <span>Ideas Feed</span>
            </Link>
          </div>

          {/* Controls & Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Cycle Theme Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border flex items-center space-x-1.5 text-xs font-bold transition-transform hover:scale-105 shadow-sm"
              style={{ borderColor: currentPreset.accentPrimary, color: currentPreset.textMain }}
              title="Click to Cycle Theme Presets"
            >
              <Palette className="w-4 h-4" style={{ color: currentPreset.accentPrimary }} />
              <span className="hidden sm:inline font-extrabold">{currentPreset.badgeText}</span>
            </button>

            {/* 6 Theme Combos Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm"
                style={{ borderColor: currentPreset.accentPrimary, color: currentPreset.textMain }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: currentPreset.accentPrimary }} />
                <span className="max-w-[140px] truncate">{currentPreset.name}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl p-2.5 border shadow-2xl z-50 glass-card space-y-1"
                  style={{ backgroundColor: currentPreset.bgCard, borderColor: currentPreset.accentPrimary }}
                >
                  <p className="text-[10px] font-black uppercase tracking-wider px-3 py-1 opacity-70">
                    Select Palette Combo (6 Options)
                  </p>
                  {themePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setThemeById(preset.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all ${
                        activeThemeId === preset.id
                          ? 'shadow-sm text-white'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: activeThemeId === preset.id ? preset.accentPrimary : 'transparent',
                        color: activeThemeId === preset.id ? '#FFFFFF' : currentPreset.textMain
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: preset.accentPrimary }} />
                        <span>{preset.name}</span>
                      </div>
                      <span className="text-[10px] opacity-80">{preset.mode === 'dark' ? '🌙' : '☀️'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Idea CTA */}
            <Link
              to="/ideas/create"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black text-white shadow-lg transition-all transform hover:-translate-y-0.5"
              style={{ backgroundColor: currentPreset.accentPrimary }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Idea</span>
            </Link>

            {/* Auth Profile / Login Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 border-l pl-3" style={{ borderColor: currentPreset.accentPrimary }}>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full font-black flex items-center justify-center text-xs text-white shadow-md"
                    style={{ backgroundColor: currentPreset.accentPrimary }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left leading-tight">
                    <div className="flex items-center space-x-1">
                      <p className="text-xs font-black max-w-[110px] truncate" style={{ color: currentPreset.textMain }}>
                        {user?.name}
                      </p>
                      {isAdmin && (
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" title="System Admin" />
                      )}
                    </div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider opacity-80" style={{ color: currentPreset.accentPrimary }}>
                      {isAdmin ? 'System Admin' : 'Author'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l pl-3" style={{ borderColor: currentPreset.accentPrimary }}>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 transition-colors"
                  style={{ color: currentPreset.textMain }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: currentPreset.accentPrimary }}
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
              className="p-2 rounded-xl hover:opacity-80"
              style={{ color: currentPreset.textMain }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden mt-2 rounded-3xl p-4 border shadow-2xl space-y-3 transition-all glass-card"
          style={{ backgroundColor: currentPreset.bgCard, borderColor: currentPreset.accentPrimary }}
        >
          <div className="grid grid-cols-2 gap-2">
            {NAV_TABS.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-center"
                style={{
                  backgroundColor: isActive(tab.path) ? currentPreset.accentPrimary : 'transparent',
                  color: isActive(tab.path) ? '#FFFFFF' : currentPreset.textMain
                }}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: currentPreset.accentPrimary }}>
            <span className="text-xs font-bold" style={{ color: currentPreset.textMain }}>Theme Combo:</span>
            <span className="text-xs font-extrabold" style={{ color: currentPreset.accentPrimary }}>{currentPreset.name}</span>
          </div>
        </div>
      )}
    </nav>
  );
};
