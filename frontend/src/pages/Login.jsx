import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, Lightbulb } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-card rounded-3xl p-8 border border-emerald-200/80 dark:border-purple-500/30 bg-white dark:bg-[#130924] space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-purple-950/80 border border-emerald-300 dark:border-purple-500/40 flex items-center justify-center mx-auto text-emerald-700 dark:text-purple-300">
            <Lightbulb className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Log in to manage your innovation pipeline & cast community votes.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-300 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Account Fill Pill */}
        <div className="p-3 bg-emerald-50/70 dark:bg-purple-950/50 rounded-2xl border border-emerald-200 dark:border-purple-500/30 text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-slate-200">Demo Accounts (Pre-seeded):</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('elena@innovationhub.org')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-mono text-[11px] font-bold shadow-sm hover:bg-emerald-700"
            >
              Dr. Elena
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('marcus@techlabs.io')}
              className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-mono text-[11px] font-bold shadow-sm hover:bg-slate-300 dark:bg-purple-900 dark:text-purple-200"
            >
              Marcus
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-purple-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-white text-slate-900 font-semibold placeholder-slate-400 dark:bg-[#130924] dark:text-white text-sm rounded-2xl pl-10 pr-4 py-2.5 border border-slate-300 dark:border-purple-500/30 focus:border-emerald-500 dark:focus:border-purple-400 focus:outline-none shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-purple-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white text-slate-900 font-semibold placeholder-slate-400 dark:bg-[#130924] dark:text-white text-sm rounded-2xl pl-10 pr-4 py-2.5 border border-slate-300 dark:border-purple-500/30 focus:border-emerald-500 dark:focus:border-purple-400 focus:outline-none shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/30 dark:shadow-purple-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-semibold">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-emerald-700 dark:text-purple-300 font-black hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
