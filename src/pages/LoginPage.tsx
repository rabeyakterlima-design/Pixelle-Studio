import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Shield, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/account/orders');
      }
    } else {
      setError(result.error || 'Invalid email or password.');
    }
  };

  const handleQuickLogin = (role: 'admin' | 'customer') => {
    switchDemoRole(role);
    if (role === 'admin') navigate('/admin');
    else navigate('/account/orders');
  };

  return (
    <div className="bg-surface-light min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-surface-border p-8 sm:p-10 shadow-card">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <img src="/logo.png" alt="Pixelle Studio" className="h-10 mx-auto" />
          </Link>
          <h1 className="text-2xl font-extrabold text-navy">Welcome Back</h1>
          <p className="text-xs text-brand-secondary mt-1">Sign in to your Pixelle Studio customer account</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-brand-text focus:outline-none focus:border-cobalt"
              />
              <Mail className="w-4 h-4 text-brand-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-brand-text">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-cobalt hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-brand-text focus:outline-none focus:border-cobalt"
              />
              <Lock className="w-4 h-4 text-brand-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cobalt hover:bg-cobalt-hover text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="mt-6 pt-6 border-t border-surface-border">
          <p className="text-[11px] text-center font-semibold text-brand-secondary uppercase tracking-wider mb-3">
            Quick Instant Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Login as Admin</span>
            </button>
            <button
              onClick={() => handleQuickLogin('customer')}
              className="p-2.5 rounded-xl bg-blue-50 text-cobalt hover:bg-blue-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
            >
              <User className="w-3.5 h-3.5 text-cobalt" />
              <span>Login as Customer</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-brand-secondary mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-cobalt font-bold hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};
