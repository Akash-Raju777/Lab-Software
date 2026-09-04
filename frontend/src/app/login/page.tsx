'use client';

import React, { useState } from 'react';
import { FlaskConical, Eye, EyeOff, ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@labtrack.com');
  const [password, setPassword] = useState('labpassword123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your laboratory email.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Lab Header Brand */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-slate-900 rounded flex items-center justify-center text-white shadow-sm mb-3">
            <FlaskConical className="w-6 h-6 text-sky-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            LabTrack
          </h2>
          <p className="mt-1 text-xs text-slate-600 uppercase tracking-widest font-semibold">
            Microbiology Laboratory Inventory System
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-white py-8 px-6 sm:px-10 border border-slate-200 rounded shadow-card">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Staff Authentication
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your authorized laboratory credentials to access inventory.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Laboratory Email Address
              </label>
              <div className="relative rounded">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@labtrack.com"
                  className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Password
              </label>
              <div className="relative rounded">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2 text-xs sm:text-sm border border-slate-300 rounded bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-900 transition-colors disabled:opacity-60 shadow-subtle"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Access Laboratory Portal</span>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-8 p-4 rounded-b text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Standard Staff Credentials</span>
            </div>
            <div className="space-y-0.5 text-slate-500 font-mono">
              <p>Email: <span className="text-slate-800">admin@labtrack.com</span></p>
              <p>Password: <span className="text-slate-800">labpassword123</span></p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-500">
          LabTrack Reagent Expiry & Inventory System &bull; Version 1.0
        </p>
      </div>
    </div>
  );
}
