import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, User, Menu, X, ChevronDown, 
  Download, Package, Shield, LogOut, LayoutGrid, Sparkles 
} from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon } from './SocialIcons';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { settings, categories } = useStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-border shadow-xs">
      {/* Top Bar with Announcement & Social Icons */}
      <div className="bg-[#17294B] text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-blue-100 font-medium text-center sm:text-left flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {settings.announcement || 'Instant download on all digital products • Secure bKash, Nagad & Rocket payments'}
          </p>
          <div className="flex items-center gap-4 text-blue-200">
            <span className="hidden md:inline text-blue-300">BD Helpline: {settings.contact_phone}</span>
            <div className="flex items-center gap-2.5">
              {settings.social_links.facebook && (
                <a href={settings.social_links.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white transition-colors">
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.social_links.instagram && (
                <a href={settings.social_links.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.social_links.youtube && (
                <a href={settings.social_links.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-white transition-colors">
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.social_links.twitter && (
                <a href={settings.social_links.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-white transition-colors">
                  <TwitterIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img 
              src="/logo.png" 
              alt="Pixelle Studio" 
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-102" 
            />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="Search for templates, planners, ebooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-light border border-surface-border text-brand-text placeholder-brand-secondary text-sm rounded-full pl-4 pr-11 py-2 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all"
            />
            <button 
              type="submit" 
              aria-label="Search"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cobalt text-white flex items-center justify-center hover:bg-cobalt-hover transition-colors shadow-xs"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Navigation & Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* User Account / Auth */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-brand-text hover:text-cobalt py-1 px-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-cobalt/10 text-cobalt flex items-center justify-center font-bold text-xs uppercase border border-cobalt/20">
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden lg:inline max-w-[120px] truncate">{user.full_name || 'My Account'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-secondary" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-dropdown border border-surface-border py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-surface-border">
                      <p className="text-xs text-brand-secondary">Signed in as</p>
                      <p className="text-sm font-semibold text-brand-text truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-cobalt font-semibold hover:bg-blue-50 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link 
                      to="/account/orders" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-brand-text hover:bg-surface-light hover:text-cobalt transition-colors"
                    >
                      <Package className="w-4 h-4 text-brand-secondary" />
                      My Orders
                    </Link>
                    <Link 
                      to="/account/downloads" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-brand-text hover:bg-surface-light hover:text-cobalt transition-colors"
                    >
                      <Download className="w-4 h-4 text-brand-secondary" />
                      Digital Downloads
                    </Link>
                    <Link 
                      to="/account" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-brand-text hover:bg-surface-light hover:text-cobalt transition-colors"
                    >
                      <User className="w-4 h-4 text-brand-secondary" />
                      Profile Settings
                    </Link>
                    <div className="border-t border-surface-border my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Link to="/login" className="flex items-center gap-1.5 text-brand-text hover:text-cobalt font-medium py-1 px-2.5 rounded-md hover:bg-surface-light transition-colors">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <span className="text-surface-border">|</span>
                <Link to="/register" className="text-cobalt hover:text-cobalt-hover font-medium py-1 px-2.5 rounded-md hover:bg-blue-50 transition-colors">
                  Register
                </Link>
              </div>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-brand-text hover:text-cobalt transition-colors rounded-full hover:bg-surface-light"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cobalt text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-brand-text hover:text-cobalt transition-colors"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden relative">
          <input
            type="text"
            placeholder="Search templates, planners, ebooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-light border border-surface-border text-brand-text text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none focus:border-cobalt"
          />
          <button type="submit" aria-label="Search" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-cobalt text-white rounded-full flex items-center justify-center">
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Sub Header: All Categories Dropdown + Navigation Links */}
      <div className="hidden md:block bg-surface-light border-t border-surface-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-8">
          
          {/* All Categories Dropdown Button */}
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-3 bg-cobalt text-white px-5 py-2.5 text-sm font-semibold rounded-t-lg hover:bg-cobalt-hover transition-colors shadow-xs"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div className="absolute left-0 top-full w-64 bg-white shadow-dropdown border border-surface-border rounded-b-xl py-2 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.slug}`}
                    onClick={() => setIsCategoryOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-brand-text hover:bg-blue-50 hover:text-cobalt transition-colors group"
                  >
                    <span>{cat.name}</span>
                    {typeof cat.product_count === 'number' && (
                      <span className="text-xs text-brand-secondary bg-surface-light px-2 py-0.5 rounded-full group-hover:bg-cobalt/10 group-hover:text-cobalt">
                        {cat.product_count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Main Navigation Links */}
          <nav className="flex items-center gap-8 text-sm font-medium text-brand-text py-2.5">
            <Link to="/" className="hover:text-cobalt transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-cobalt transition-colors">Shop</Link>
            <Link to="/about" className="hover:text-cobalt transition-colors">About</Link>
            <Link to="/contact" className="hover:text-cobalt transition-colors">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="text-cobalt font-semibold hover:text-cobalt-hover flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
          </nav>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-surface-border px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded hover:bg-surface-light">Home</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded hover:bg-surface-light">Shop All Products</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded hover:bg-surface-light">About Us</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded hover:bg-surface-light">Contact</Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded bg-blue-50 text-cobalt font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
          </nav>

          <div className="border-t border-surface-border pt-3">
            <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/shop?category=${c.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded bg-surface-light hover:bg-blue-50 hover:text-cobalt"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
