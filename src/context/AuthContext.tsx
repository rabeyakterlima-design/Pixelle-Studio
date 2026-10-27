import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/database';
import { DEMO_ADMIN, DEMO_CUSTOMER } from '../services/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password?: string, fullName?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: 'admin' | 'customer' | 'guest') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('pixelle_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile and role from Supabase
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();

            const role = (roleData?.role as UserRole) || 'customer';

            const userProfile: UserProfile = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              phone: profile?.phone,
              address: profile?.address,
              city: profile?.city,
              role: role,
              created_at: session.user.created_at
            };

            setUser(userProfile);
            localStorage.setItem('pixelle_current_user', JSON.stringify(userProfile));
          }
        } catch (e) {
          console.warn('Supabase auth session check failed:', e);
        }
      }
      setIsLoading(false);
    }

    checkAuth();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id).single();
          const userProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
            role: (roleData?.role as UserRole) || 'customer',
            created_at: data.user.created_at
          };
          setUser(userProfile);
          localStorage.setItem('pixelle_current_user', JSON.stringify(userProfile));
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Authentication error' };
      }
    }

    // Local / Demo mode fallback
    const lower = email.toLowerCase().trim();
    if (lower === DEMO_ADMIN.email.toLowerCase() || lower.includes('admin')) {
      setUser(DEMO_ADMIN);
      localStorage.setItem('pixelle_current_user', JSON.stringify(DEMO_ADMIN));
      setIsLoading(false);
      return { success: true };
    }

    const customerUser: UserProfile = {
      ...DEMO_CUSTOMER,
      email: lower,
      full_name: lower.split('@')[0].toUpperCase(),
      role: 'customer'
    };
    setUser(customerUser);
    localStorage.setItem('pixelle_current_user', JSON.stringify(customerUser));
    setIsLoading(false);
    return { success: true };
  };

  const register = async (email: string, password?: string, fullName?: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone }
          }
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const userProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName || email.split('@')[0],
            phone: phone,
            role: 'customer',
            created_at: new Date().toISOString()
          };
          setUser(userProfile);
          localStorage.setItem('pixelle_current_user', JSON.stringify(userProfile));
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Registration failed' };
      }
    }

    // Local mode registration
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: email.trim(),
      full_name: fullName?.trim() || email.split('@')[0],
      phone: phone?.trim(),
      role: 'customer',
      created_at: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('pixelle_current_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out error:', e);
      }
    }
    setUser(null);
    localStorage.removeItem('pixelle_current_user');
  };

  const switchDemoRole = (roleType: 'admin' | 'customer' | 'guest') => {
    if (roleType === 'admin') {
      setUser(DEMO_ADMIN);
      localStorage.setItem('pixelle_current_user', JSON.stringify(DEMO_ADMIN));
    } else if (roleType === 'customer') {
      setUser(DEMO_CUSTOMER);
      localStorage.setItem('pixelle_current_user', JSON.stringify(DEMO_CUSTOMER));
    } else {
      setUser(null);
      localStorage.removeItem('pixelle_current_user');
    }
  };

  const role = user?.role || null;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, role, isAdmin, isLoading, login, register, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
