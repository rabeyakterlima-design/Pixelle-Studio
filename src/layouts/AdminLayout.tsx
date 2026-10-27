import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, FolderTree, Sliders, 
  Layers, ShoppingCart, Users, CreditCard, Ticket, 
  Image as ImageIcon, Star, BarChart3, Settings, 
  ShieldAlert, LogOut, Menu, X, ArrowLeft, ExternalLink 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Attributes & Variations', path: '/admin/attributes', icon: Sliders },
    { label: 'Inventory', path: '/admin/inventory', icon: Layers },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { label: 'Homepage Carousel', path: '/admin/slides', icon: ImageIcon },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
    { label: 'Security & Audit Logs', path: '/admin/security', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#F3F6FB] flex text-[#24324A]">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-navy-dark/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar matching Mockup (Dark Navy #17294B) */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#17294B] text-slate-300 flex flex-col z-50 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Brand / Logo */}
        <div className="p-5 border-b border-[#2C4372] flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Pixelle Studio" className="h-8 brightness-0 invert" />
            <div>
              <span className="text-sm font-extrabold text-white block leading-none">Pixelle Studio</span>
              <span className="text-[10px] text-blue-300 font-semibold tracking-wider uppercase">Admin Control</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-cobalt text-white shadow-xs font-bold'
                      : 'hover:bg-[#223A69] text-slate-300 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#2C4372] space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-[#223A69] hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Store</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar matching mockup */}
        <header className="sticky top-0 z-30 bg-white border-b border-surface-border px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-brand-text hover:bg-surface-light"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-navy">
              Pixelle Studio Admin Portal
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-navy">{user?.full_name || 'Admin User'}</p>
              <p className="text-[10px] text-brand-secondary">{user?.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-cobalt text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
