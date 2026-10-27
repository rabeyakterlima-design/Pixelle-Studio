import React, { useState, useEffect } from 'react';
import { Download, FileText, CheckCircle2, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { DigitalDownload } from '../types/database';
import { storeService } from '../services/storeService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const CustomerDownloadsPage: React.FC = () => {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<DigitalDownload[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDownloads() {
      setIsLoading(true);
      if (user?.email) {
        const list = await storeService.getCustomerDownloads(user.email);
        setDownloads(list);
      } else {
        // Fallback demo files if user is browsing
        const list = await storeService.getCustomerDownloads('samiul@example.com');
        setDownloads(list);
      }
      setIsLoading(false);
    }
    fetchDownloads();
  }, [user]);

  const handleDownloadFile = (dl: DigitalDownload) => {
    // In production this triggers a short-lived signed URL or direct download token
    window.open(dl.download_file_url, '_blank');
  };

  return (
    <div className="bg-surface-light min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Digital Downloads</h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-1">
            Access and download all your purchased Canva templates, GoodNotes planners, and design files
          </p>
        </div>

        {/* Security & Entitlement Notice */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-cobalt shrink-0 mt-0.5" />
          <div className="text-xs text-brand-secondary">
            <p className="font-bold text-navy">Digital Asset Guarantee & Protection</p>
            <p className="mt-0.5">
              Files are securely stored and verified. You have lifetime access to re-download your purchased assets up to 10 times per license.
            </p>
          </div>
        </div>

        {/* Downloads Grid */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center text-cobalt">
              <div className="w-8 h-8 border-3 border-cobalt border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-brand-secondary">Retrieving download entitlements...</p>
            </div>
          ) : downloads.length === 0 ? (
            <div className="py-20 text-center px-4">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-navy">No Digital Downloads Available Yet</h3>
              <p className="text-xs text-brand-secondary max-w-sm mx-auto mt-1 mb-6">
                Downloads appear here as soon as your payment (bKash/Nagad/Rocket) is verified and approved.
              </p>
              <Link to="/shop" className="bg-cobalt text-white text-xs font-semibold px-5 py-2.5 rounded-xl">
                Browse Digital Shop
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-surface-border">
              {downloads.map((dl) => (
                <div key={dl.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cobalt/10 text-cobalt flex items-center justify-center shrink-0 border border-cobalt/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-navy">{dl.product_name}</h4>
                      {dl.variant_name && (
                        <p className="text-xs text-cobalt font-medium mt-0.5">{dl.variant_name}</p>
                      )}
                      <p className="text-[11px] text-brand-secondary mt-1">
                        Order <span className="font-mono font-semibold text-navy">#{dl.order_number}</span> • License Active
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleDownloadFile(dl)}
                      className="flex-1 sm:flex-initial bg-cobalt hover:bg-cobalt-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download File / Link</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
