import React, { useState } from 'react';
import { Settings, Save, Check, Smartphone, Database, Globe, Share2, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { storeService } from '../../services/storeService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { SiteSettings } from '../../types/database';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshStore } = useStore();
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await storeService.updateSettings(formData);
    await refreshStore();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Store & Site Settings</h1>
          <p className="text-xs text-brand-secondary mt-1">
            Configure business contact info, bKash/Nagad receiving numbers, and social URLs
          </p>
        </div>

        {isSaved && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Supabase Status Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isSupabaseConfigured ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-navy'
      }`}>
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-cobalt shrink-0" />
          <div className="text-xs">
            <p className="font-bold">
              Supabase PostgreSQL Database Engine: {isSupabaseConfigured ? 'Connected & Active' : 'Fallback Local Engine Active'}
            </p>
            <p className="text-brand-secondary mt-0.5">
              {isSupabaseConfigured 
                ? 'Queries and authentication are reading and writing directly to your Supabase PostgreSQL cloud instance.'
                : 'Running in stateful local preview. To connect your live Supabase database, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. General Store Info */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <Globe className="w-4 h-4 text-cobalt" />
            <h2 className="text-sm font-bold text-navy">General Store Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-brand-text mb-1">Store Name</label>
              <input
                type="text"
                value={formData.store_name}
                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-text mb-1">Store Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-text mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-text mb-1">Helpline Phone Number</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-brand-text mb-1">Business Address</label>
              <input
                type="text"
                value={formData.business_address}
                onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-brand-text mb-1">Store Top Announcement</label>
              <input
                type="text"
                value={formData.announcement}
                onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              />
            </div>
          </div>
        </div>

        {/* 2. Manual Mobile Payments Configuration */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <Smartphone className="w-4 h-4 text-cobalt" />
            <h2 className="text-sm font-bold text-navy">Manual Payment Methods (bKash, Nagad, Rocket)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* bKash */}
            <div className="p-4 rounded-xl border border-pink-200 bg-pink-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#E2136E] text-sm">bKash</span>
                <input
                  type="checkbox"
                  checked={formData.payments.bkash.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      bkash: { ...formData.payments.bkash, enabled: e.target.checked }
                    }
                  })}
                  className="rounded text-pink-600 w-4 h-4"
                />
              </div>
              <div>
                <label className="block font-semibold text-brand-text mb-1">Receiving Number</label>
                <input
                  type="text"
                  value={formData.payments.bkash.number}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      bkash: { ...formData.payments.bkash, number: e.target.value }
                    }
                  })}
                  className="w-full bg-white border border-pink-200 rounded-lg px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-brand-text mb-1">Checkout Instructions</label>
                <textarea
                  rows={4}
                  value={formData.payments.bkash.instructions}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      bkash: { ...formData.payments.bkash, instructions: e.target.value }
                    }
                  })}
                  className="w-full bg-white border border-pink-200 rounded-lg p-2 text-[11px] focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Nagad */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#F7941D] text-sm">Nagad</span>
                <input
                  type="checkbox"
                  checked={formData.payments.nagad.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      nagad: { ...formData.payments.nagad, enabled: e.target.checked }
                    }
                  })}
                  className="rounded text-amber-600 w-4 h-4"
                />
              </div>
              <div>
                <label className="block font-semibold text-brand-text mb-1">Receiving Number</label>
                <input
                  type="text"
                  value={formData.payments.nagad.number}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      nagad: { ...formData.payments.nagad, number: e.target.value }
                    }
                  })}
                  className="w-full bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-brand-text mb-1">Checkout Instructions</label>
                <textarea
                  rows={4}
                  value={formData.payments.nagad.instructions}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      nagad: { ...formData.payments.nagad, instructions: e.target.value }
                    }
                  })}
                  className="w-full bg-white border border-amber-200 rounded-lg p-2 text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Rocket */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#8C3494] text-sm">Rocket</span>
                <input
                  type="checkbox"
                  checked={formData.payments.rocket.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      rocket: { ...formData.payments.rocket, enabled: e.target.checked }
                    }
                  })}
                  className="rounded text-purple-600 w-4 h-4"
                />
              </div>
              <div>
                <label className="block font-semibold text-brand-text mb-1">Receiving Number</label>
                <input
                  type="text"
                  value={formData.payments.rocket.number}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      rocket: { ...formData.payments.rocket, number: e.target.value }
                    }
                  })}
                  className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-brand-text mb-1">Checkout Instructions</label>
                <textarea
                  rows={4}
                  value={formData.payments.rocket.instructions}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      rocket: { ...formData.payments.rocket, instructions: e.target.value }
                    }
                  })}
                  className="w-full bg-white border border-purple-200 rounded-lg p-2 text-[11px] focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Social Media Links */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <Share2 className="w-4 h-4 text-cobalt" />
            <h2 className="text-sm font-bold text-navy">Social Media Links (Editable without Code)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-brand-text mb-1">Facebook URL</label>
              <input
                type="url"
                value={formData.social_links.facebook}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, facebook: e.target.value }
                })}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-text mb-1">Instagram URL</label>
              <input
                type="url"
                value={formData.social_links.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, instagram: e.target.value }
                })}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-text mb-1">YouTube URL</label>
              <input
                type="url"
                value={formData.social_links.youtube}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, youtube: e.target.value }
                })}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-text mb-1">Twitter / X URL</label>
              <input
                type="url"
                value={formData.social_links.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, twitter: e.target.value }
                })}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-cobalt hover:bg-cobalt-hover text-white text-xs font-bold px-8 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
