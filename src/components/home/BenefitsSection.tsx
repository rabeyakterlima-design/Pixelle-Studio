import React from 'react';
import { DownloadCloud, ShieldCheck, Headphones, Palette } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: DownloadCloud,
      title: 'Instant Download',
      desc: 'Get your files right away upon order confirmation.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      desc: 'Safe manual bKash, Nagad & Rocket verification.'
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      desc: "Fast assistance for template customization & help."
    },
    {
      icon: Palette,
      title: 'Made for Creatives',
      desc: 'Aesthetic designs ready to customize & launch.'
    }
  ];

  return (
    <section className="py-12 bg-white border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-light transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-cobalt flex items-center justify-center shrink-0 border border-blue-100">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy">{b.title}</h4>
                  <p className="text-xs text-brand-secondary mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
