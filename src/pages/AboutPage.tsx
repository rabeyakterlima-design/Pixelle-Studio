import React from 'react';
import { Sparkles, Heart, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-surface-light min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-surface-border p-8 sm:p-14 shadow-card text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-cobalt/10 text-cobalt px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Story</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight mb-4">
            Digital Products for Creative Minds
          </h1>
          <p className="text-base text-brand-secondary max-w-2xl mx-auto leading-relaxed">
            Pixelle Studio was founded with a singular mission: to empower content creators, social media managers, digital entrepreneurs, and small business owners with world-class, aesthetic, and ready-to-use digital templates.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-cobalt flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-navy text-sm mb-2">Instant Efficiency</h3>
            <p className="text-xs text-brand-secondary leading-relaxed">
              Save hundreds of hours with pre-crafted Canva templates, GoodNotes daily planners, and ebook covers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs text-center">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-navy text-sm mb-2">Aesthetic Craftsmanship</h3>
            <p className="text-xs text-brand-secondary leading-relaxed">
              Every font pairing, color palette, and layout is meticulously tuned to make your brand stand out.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-navy text-sm mb-2">Verified Local Payments</h3>
            <p className="text-xs text-brand-secondary leading-relaxed">
              Seamlessly checkout in Bangladeshi Taka (BDT) via bKash, Nagad, and Rocket with human-verified assurance.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#17294B] text-white rounded-3xl p-8 sm:p-12 text-center shadow-lg">
          <h2 className="text-2xl font-bold mb-3">Ready to transform your creative workflow?</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6">
            Browse our catalog today and get instant download access right to your dashboard.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-cobalt hover:bg-cobalt-hover text-white text-xs font-bold px-7 py-3.5 rounded-xl shadow-md transition-all"
          >
            Explore Catalog
          </Link>
        </div>

      </div>
    </div>
  );
};
