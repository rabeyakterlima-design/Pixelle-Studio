import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Database, ShieldCheck, UserCheck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemoNoticeBar: React.FC = () => {
  const { user, isAdmin, switchDemoRole } = useAuth();

  return (
    <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 font-semibold text-white">
          <Database className="w-3.5 h-3.5 text-cobalt" />
          Pixelle Studio Engine:
        </span>
        {isSupabaseConfigured ? (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Supabase PostgreSQL Connected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-amber-300 font-medium" title="To connect Supabase, configure VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in .env">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Active Data Engine (Interactive Local + Supabase Ready)
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400">Quick Test Role:</span>
        <div className="flex items-center gap-1 bg-slate-800 rounded p-0.5">
          <button
            onClick={() => switchDemoRole('admin')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              isAdmin ? 'bg-cobalt text-white font-bold' : 'hover:text-white text-slate-300'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => switchDemoRole('customer')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              user && !isAdmin ? 'bg-blue-600 text-white font-bold' : 'hover:text-white text-slate-300'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => switchDemoRole('guest')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              !user ? 'bg-slate-700 text-white font-bold' : 'hover:text-white text-slate-300'
            }`}
          >
            Guest
          </button>
        </div>

        {isAdmin && (
          <Link
            to="/admin"
            className="ml-2 inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-0.5 rounded border border-amber-500/30 font-semibold"
          >
            <Shield className="w-3 h-3" />
            Open Admin
          </Link>
        )}
      </div>
    </div>
  );
};
