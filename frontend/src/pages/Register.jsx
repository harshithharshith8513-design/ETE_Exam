import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, AlertCircle, Lightbulb } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-card rounded-3xl p-8 border border-emerald-200/80 dark:border-slate-800 bg-white dark:bg-[#130924] space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-indigo-600/30 border border-emerald-300 dark:border-indigo-500/40 flex items-center justify-center mx-auto text-emerald-700 dark:text-indigo-400">
            <Lightbulb className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Join the Innovation Hub platform to publish and track concepts.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-300 text-xs flex items-center space-x-2 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Sarah Connor"
                required
                className="w-full bg-white text-slate-900 font-semibold placeholder-slate-400 dark:bg-slate-900 dark:text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-700/80 focus:border-emerald-500 dark:focus:border-indigo-500 focus:outline-none shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@innovation.org"
                required
                className="w-full bg-white text-slate-900 font-semibold placeholder-slate-400 dark:bg-slate-900 dark:text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-700/80 focus:border-emerald-500 dark:focus:border-indigo-500 focus:outline-none shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-300 mb-1">Password (6+ characters)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-white text-slate-900 font-semibold placeholder-slate-400 dark:bg-slate-900 dark:text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-700/80 focus:border-emerald-500 dark:focus:border-indigo-500 focus:outline-none shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-violet-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/30 dark:shadow-indigo-600/30 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Register Account</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-semibold">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-700 dark:text-indigo-400 font-black hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};
