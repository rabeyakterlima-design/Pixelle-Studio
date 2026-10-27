import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Order, UserProfile } from '../../types/database';
import { storeService } from '../../services/storeService';
import { useStore } from '../../context/StoreContext';

export const AdminCustomersPage: React.FC = () => {
  const { formatPrice } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      const data = await storeService.getOrders();
      setOrders(data);
    }
    load();
  }, []);

  // Aggregate unique customers from orders & registered users
  const customerMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    city: string;
    orderCount: number;
    totalSpent: number;
    lastOrder: string;
  }>();

  // Add default demo customers
  customerMap.set('customer@pixellestudio.com', {
    name: 'Tanzir Hassan',
    email: 'customer@pixellestudio.com',
    phone: '+8801712987654',
    city: 'Dhaka',
    orderCount: 3,
    totalSpent: 3600,
    lastOrder: new Date().toISOString()
  });

  customerMap.set('samiul@example.com', {
    name: 'Samiul Islam',
    email: 'samiul@example.com',
    phone: '+8801812345678',
    city: 'Chittagong',
    orderCount: 1,
    totalSpent: 800,
    lastOrder: new Date(Date.now() - 3600000 * 10).toISOString()
  });

  customerMap.set('rahima@example.com', {
    name: 'Rahima Akter',
    email: 'rahima@example.com',
    phone: '+8801712345678',
    city: 'Dhaka',
    orderCount: 1,
    totalSpent: 1200,
    lastOrder: new Date(Date.now() - 3600000 * 2).toISOString()
  });

  orders.forEach(o => {
    const key = o.customer_email.toLowerCase();
    const existing = customerMap.get(key);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += (o.payment_status === 'paid' ? o.total_amount : 0);
    } else {
      customerMap.set(key, {
        name: o.customer_name,
        email: o.customer_email,
        phone: o.customer_phone,
        city: o.billing_city,
        orderCount: 1,
        totalSpent: o.payment_status === 'paid' ? o.total_amount : 0,
        lastOrder: o.created_at
      });
    }
  });

  const customerList = Array.from(customerMap.values()).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Customer Management</h1>
        <p className="text-xs text-brand-secondary mt-1">
          View registered customer accounts, total spend, order frequency, and contact details
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-xs max-w-sm relative">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cobalt"
        />
        <Search className="w-4 h-4 text-brand-secondary absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Customers Table matching mockup "User Management" */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-light border-b border-surface-border text-brand-secondary uppercase font-semibold">
              <tr>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {customerList.map((c, idx) => (
                <tr key={idx} className="hover:bg-surface-light/40 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cobalt/10 text-cobalt flex items-center justify-center font-bold text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-navy">{c.name}</p>
                        <p className="text-[10px] text-brand-secondary">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-brand-text">
                    {c.phone}
                  </td>
                  <td className="py-3.5 px-4 text-brand-secondary">
                    {c.city}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-navy">
                    {c.orderCount} order(s)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cobalt">
                    {formatPrice(c.totalSpent)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
