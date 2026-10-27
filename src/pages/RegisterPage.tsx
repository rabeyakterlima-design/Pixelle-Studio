import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // BD Phone validation
    const bdPhoneRegex = /^(\+?880|0)?1[3-9]\d{8}$/;
    if (phone && !bdPhoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      setError('Please provide a valid Bangladeshi phone number (e.g. 017XXXXXXXX).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    const result = await register(email, password, fullName, phone);
    setIsLoading(false);

    if (result.success) {
      navigate('/account/orders');
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  return (
    <div className="bg-surface-light min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-surface-border p-8 sm:p-10 shadow-card">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <img src="/logo.png" alt="Pixelle Studio" className="h-10 mx-auto" />
          </Link>
          <h1 className="text-2xl font-extrabold text-navy">Create Account</h1>
          <p className="text-xs text-brand-secondary mt-1">Join Pixelle Studio for instant digital template downloads</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Tanzir Hassan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-brand-text focus:outline-none focus:border-cobalt"
              />
              <User className="w-4 h-4 text-brand-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-brand-text mb-1">Mobile Number (BD)</label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="01712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-brand-text focus:outline-none focus:border-cobalt"
              />
              <Phone className="w-4 h-4 text-brand-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="At least 6 characters"
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
            <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-brand-secondary mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-cobalt font-bold hover:underline">
            Sign In here
          </Link>
        </p>

      </div>
    </div>
  );
};
