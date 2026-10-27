import React from 'react';
import { Shield, FileCheck, RefreshCw } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-surface-light min-h-screen py-14">
      <div className="max-w-3xl mx-auto px-4 bg-white rounded-3xl border border-surface-border p-8 sm:p-12 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-cobalt" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Privacy Policy</h1>
        </div>
        <div className="prose prose-slate text-xs sm:text-sm text-brand-secondary leading-relaxed space-y-4">
          <p>
            At Pixelle Studio, accessible from pixellestudio.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of personal data that is collected and recorded by Pixelle Studio and how we use it.
          </p>
          <h3 className="font-bold text-navy text-base mt-4">1. Information We Collect</h3>
          <p>
            When you place an order for digital products on Pixelle Studio, we collect necessary customer details including your name, email address (to deliver digital downloads and receipts), and Bangladeshi mobile phone number (to verify manual bKash, Nagad, and Rocket payments).
          </p>
          <h3 className="font-bold text-navy text-base mt-4">2. Payment Data Security</h3>
          <p>
            Pixelle Studio operates with manual bKash, Nagad, and Rocket payments. We do NOT ask for or store your sensitive financial PINs or OTPs. Customers provide only their Transaction ID (TrxID) and sender number for audit verification.
          </p>
          <h3 className="font-bold text-navy text-base mt-4">3. Data Protection</h3>
          <p>
            All digital file downloads and account credentials are encrypted and protected by Supabase Row Level Security (RLS). We never sell or distribute your private contact details to third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-surface-light min-h-screen py-14">
      <div className="max-w-3xl mx-auto px-4 bg-white rounded-3xl border border-surface-border p-8 sm:p-12 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <FileCheck className="w-8 h-8 text-cobalt" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Terms & Conditions</h1>
        </div>
        <div className="prose prose-slate text-xs sm:text-sm text-brand-secondary leading-relaxed space-y-4">
          <p>
            Welcome to Pixelle Studio. By purchasing our digital templates, planners, or design assets, you agree to comply with and be bound by the following terms of use.
          </p>
          <h3 className="font-bold text-navy text-base mt-4">1. License & Usage</h3>
          <p>
            Unless explicitly designated as a "Commercial License" or "Extended Commercial License", all digital products are licensed for personal productivity and individual branding. You may not re-distribute, sub-license, share the raw template link, or resell our designs on marketplace websites.
          </p>
          <h3 className="font-bold text-navy text-base mt-4">2. Digital Delivery</h3>
          <p>
            Products on Pixelle Studio are non-tangible, irrevocable digital goods delivered via cloud download links and Canva access links once payment is verified.
          </p>
        </div>
      </div>
    </div>
  );
};

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="bg-surface-light min-h-screen py-14">
      <div className="max-w-3xl mx-auto px-4 bg-white rounded-3xl border border-surface-border p-8 sm:p-12 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <RefreshCw className="w-8 h-8 text-cobalt" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Refund & Return Policy</h1>
        </div>
        <div className="prose prose-slate text-xs sm:text-sm text-brand-secondary leading-relaxed space-y-4">
          <p>
            Because our store sells digital products (such as Canva templates, downloadable PDF planners, ebooks, and vector graphics) that are delivered immediately upon manual payment confirmation, all sales are generally final.
          </p>
          <h3 className="font-bold text-navy text-base mt-4">Exceptions & Assistance</h3>
          <p>
            If you encounter an issue where a download link is corrupted, a Canva link is broken, or you were accidentally double-charged due to network delay, our support team will promptly investigate and either re-issue the files or initiate a refund via bKash/Nagad within 24 to 48 hours.
          </p>
          <p>
            Contact us at <strong className="text-navy">hello@pixellestudio.com</strong> or WhatsApp <strong className="text-navy">+8801 2345 6789</strong> with your Order Number for refund requests.
          </p>
        </div>
      </div>
    </div>
  );
};
