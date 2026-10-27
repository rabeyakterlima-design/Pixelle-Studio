import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, SiteSettings } from '../types/database';
import { INITIAL_SETTINGS } from '../services/mockData';
import { storeService } from '../services/storeService';

interface StoreContextType {
  settings: SiteSettings;
  categories: Category[];
  isLoading: boolean;
  refreshStore: () => Promise<void>;
  formatPrice: (amount: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshStore = async () => {
    try {
      const [fetchedSettings, fetchedCategories] = await Promise.all([
        storeService.getSettings(),
        storeService.getCategories()
      ]);
      setSettings(fetchedSettings);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Error refreshing store state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStore();
  }, []);

  const formatPrice = (amount: number): string => {
    const symbol = settings.currency_symbol || '৳';
    return `${symbol}${Number(amount).toLocaleString('en-US')}`;
  };

  return (
    <StoreContext.Provider value={{
      settings,
      categories,
      isLoading,
      refreshStore,
      formatPrice
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
