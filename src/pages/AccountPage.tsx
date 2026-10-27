import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Mail, Package, Download, ShieldCheck, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountPage: React.FC = () => {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Dhaka');
  const [address, setAddress] = useState(user?.address || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated = { ...user, full_name: fullName, phone, city, address };
      localStorage.setItem('pixelle_current_user', JSON.stringify(updated));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="bg-surface-light min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Account Settings</h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-1">
            Manage your personal profile and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Quick links */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-surface-border p-5 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-cobalt/10 text-cobalt flex items-center justify-center font-bold text-xl mx-auto mb-3 border border-cobalt/20">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <h3 className="font-bold text-navy text-sm">{user?.full_name || 'My Account'}</h3>
              <p className="text-xs text-brand-secondary truncate">{user?.email}</p>
              <span className="inline-block mt-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-cobalt">
                {user?.role || 'Customer'}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-surface-border p-2 space-y-1 shadow-xs text-xs font-semibold">
              <Link to="/account/orders" className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-surface-light text-brand-text transition-colors">
                <Package className="w-4 h-4 text-cobalt" />
                <span>My Orders</span>
              </Link>
              <Link to="/account/downloads" className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-surface-light text-brand-text transition-colors">
                <Download className="w-4 h-4 text-cobalt" />
                <span>Digital Downloads</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Edit Profile */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-bold text-navy border-b border-surface-border pb-3 mb-6">
                Profile Information
              </h2>

              {isSaved && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-slate-100 border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-brand-secondary">Email cannot be changed directly for security.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-text mb-1">Mobile Number (BD)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-text mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">Billing Address</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-cobalt text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-cobalt-hover transition-colors shadow-xs"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
