import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-surface-light min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-surface-border p-10 text-center shadow-card">
        <span className="text-6xl font-black text-cobalt block mb-3">404</span>
        <h1 className="text-2xl font-bold text-navy mb-2">Page Not Found</h1>
        <p className="text-xs text-brand-secondary mb-6 leading-relaxed">
          The page or digital product route you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="bg-cobalt text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-cobalt-hover transition-colors flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/shop"
            className="bg-surface-light border border-surface-border text-brand-text text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
};
