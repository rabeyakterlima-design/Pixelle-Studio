import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-surface-light min-h-screen py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-navy">Get in Touch with Pixelle Studio</h1>
          <p className="text-sm text-brand-secondary mt-2">
            Have questions about digital files, license terms, or custom orders? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Info Card */}
          <div className="lg:col-span-5 bg-[#17294B] text-white rounded-3xl p-8 shadow-card flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Contact Information</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reach out to our Chittagong support center for rapid assistance regarding your digital purchases and manual payment verification.
              </p>

              <div className="space-y-4 pt-4 text-xs text-slate-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cobalt shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Location:</p>
                    <p>{settings.business_address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-cobalt shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Helpline / WhatsApp:</p>
                    <p>{settings.contact_phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-cobalt shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Support Email:</p>
                    <p>{settings.contact_email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-700/80 text-[11px] text-slate-400">
              Support hours: 9:00 AM – 10:00 PM BST (7 Days a Week)
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-surface-border p-8 shadow-xs">
            <h2 className="text-lg font-bold text-navy mb-4">Send Us a Message</h2>

            {isSent && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been received. Our team will email you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanzir Hassan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                />
              </div>

              <button
                type="submit"
                className="bg-cobalt hover:bg-cobalt-hover text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs flex items-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
