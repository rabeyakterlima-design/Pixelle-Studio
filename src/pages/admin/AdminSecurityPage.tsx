import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Lock, CheckCircle, AlertTriangle, Key } from 'lucide-react';
import { AuditLog } from '../../types/database';
import { storeService } from '../../services/storeService';

export const AdminSecurityPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [preventFakeOrders, setPreventFakeOrders] = useState(true);
  const [phoneValidation, setPhoneValidation] = useState(true);
  const [emailValidation, setEmailValidation] = useState(true);
  const [requireAddress, setRequireAddress] = useState(false);
  const [rateLimiting, setRateLimiting] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function loadLogs() {
      const audit = await storeService.getAuditLogs();
      setLogs(audit);
    }
    loadLogs();
  }, []);

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Security & Audit Logs</h1>
        <p className="text-xs text-brand-secondary mt-1">
          Anti-abuse protection, fake order filters, and immutable administrative audit trails
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Security Toggles matching Mockup */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <ShieldAlert className="w-5 h-5 text-cobalt" />
            <h2 className="text-sm font-bold text-navy">Security & Validation Settings</h2>
          </div>

          {isSaved && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Security rules updated!</span>
            </div>
          )}

          <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-light border border-surface-border">
              <div>
                <p className="font-bold text-navy">Prevent Fake Orders</p>
                <p className="text-[11px] text-brand-secondary">Idempotency checks & duplicate TrxID filter</p>
              </div>
              <input
                type="checkbox"
                checked={preventFakeOrders}
                onChange={(e) => setPreventFakeOrders(e.target.checked)}
                className="w-4 h-4 rounded text-cobalt"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-light border border-surface-border">
              <div>
                <p className="font-bold text-navy">Phone Number Regex Validation</p>
                <p className="text-[11px] text-brand-secondary">Enforces valid 11-digit Bangladeshi mobile format</p>
              </div>
              <input
                type="checkbox"
                checked={phoneValidation}
                onChange={(e) => setPhoneValidation(e.target.checked)}
                className="w-4 h-4 rounded text-cobalt"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-light border border-surface-border">
              <div>
                <p className="font-bold text-navy">Email Deliverability Check</p>
                <p className="text-[11px] text-brand-secondary">Ensures customer email exists for digital delivery</p>
              </div>
              <input
                type="checkbox"
                checked={emailValidation}
                onChange={(e) => setEmailValidation(e.target.checked)}
                className="w-4 h-4 rounded text-cobalt"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-light border border-surface-border">
              <div>
                <p className="font-bold text-navy">Checkout Rate Limiting</p>
                <p className="text-[11px] text-brand-secondary">Blocks repeated automated order bursts</p>
              </div>
              <input
                type="checkbox"
                checked={rateLimiting}
                onChange={(e) => setRateLimiting(e.target.checked)}
                className="w-4 h-4 rounded text-cobalt"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cobalt hover:bg-cobalt-hover text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all"
            >
              Save Security Rules
            </button>
          </form>
        </div>

        {/* Right: Audit Logs Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
          <div className="p-6 border-b border-surface-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy">Audit Trail</h2>
              <p className="text-xs text-brand-secondary">System events and admin modifications</p>
            </div>
            <span className="text-xs font-semibold text-brand-secondary">
              Logs: {logs.length}
            </span>
          </div>

          <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-light border-b border-surface-border text-brand-secondary uppercase font-semibold sticky top-0">
                <tr>
                  <th className="py-3 px-6">Timestamp</th>
                  <th className="py-3 px-4">Admin</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-6">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-light/40 transition-colors">
                    <td className="py-3 px-6 text-brand-secondary whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-navy max-w-[120px] truncate">
                      {log.user_email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-50 text-cobalt font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-brand-secondary">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
