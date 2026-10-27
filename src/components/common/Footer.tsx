import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, ShieldCheck 
} from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon } from './SocialIcons';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="bg-[#17294B] text-slate-300 pt-16 pb-8 border-t border-[#2C4372]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2C4372]/80">
          
          {/* Col 1: Brand Info & Socials */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/logo.png" 
                alt="Pixelle Studio" 
                className="h-12 w-auto object-contain brightness-0 invert" 
              />
            </Link>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              {settings.tagline || 'Digital Products for Creative Minds'} — Premium digital products for creatives, entrepreneurs, and dreamers. Make your ideas come to life with our templates, planners, and design resources.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings.social_links.facebook && (
                <a href={settings.social_links.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-[#223A69] hover:bg-cobalt flex items-center justify-center text-white transition-colors" aria-label="Facebook">
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
              {settings.social_links.instagram && (
                <a href={settings.social_links.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-[#223A69] hover:bg-cobalt flex items-center justify-center text-white transition-colors" aria-label="Instagram">
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {settings.social_links.youtube && (
                <a href={settings.social_links.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-[#223A69] hover:bg-cobalt flex items-center justify-center text-white transition-colors" aria-label="YouTube">
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
              {settings.social_links.twitter && (
                <a href={settings.social_links.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-[#223A69] hover:bg-cobalt flex items-center justify-center text-white transition-colors" aria-label="Twitter">
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Customer Support</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/account/downloads" className="hover:text-white transition-colors">Instant Downloads</Link></li>
              <li><Link to="/account/orders" className="hover:text-white transition-colors">Track Order Status</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact Us & Payment Methods */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact & Payments</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cobalt shrink-0 mt-0.5" />
                <span>{settings.business_address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cobalt shrink-0" />
                <span>{settings.contact_phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cobalt shrink-0" />
                <span>{settings.contact_email}</span>
              </p>
            </div>

            <div className="pt-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Supported Payments</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-[#E2136E] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">bKash</span>
                <span className="bg-[#F7941D] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">Nagad</span>
                <span className="bg-[#8C3494] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">Rocket</span>
                <span className="bg-[#223A69] text-white text-[10px] font-medium px-2 py-0.5 rounded border border-[#2C4372]">Manual Trx</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {settings.store_name}. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure SSL Encrypted Checkout • BDT Currency</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
