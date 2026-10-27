import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { DemoNoticeBar } from '../components/common/DemoNoticeBar';

export const StoreLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <DemoNoticeBar />
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
