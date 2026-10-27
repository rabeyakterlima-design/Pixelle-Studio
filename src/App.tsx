import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';

// Layouts
import { StoreLayout } from './layouts/StoreLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute, AdminRoute } from './components/auth/RouteGuards';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentStatusPage } from './pages/PaymentStatusPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { CustomerOrdersPage } from './pages/CustomerOrdersPage';
import { CustomerDownloadsPage } from './pages/CustomerDownloadsPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage, TermsPage, RefundPolicyPage } from './pages/PolicyPages';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminAttributesPage } from './pages/admin/AdminAttributesPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminSlidesPage } from './pages/admin/AdminSlidesPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminSecurityPage } from './pages/admin/AdminSecurityPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <Routes>
              
              {/* Storefront Layout */}
              <Route element={<StoreLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/category/:slug" element={<ShopPage />} />
                <Route path="/search" element={<ShopPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-instructions" element={<CheckoutPage />} />
                <Route path="/payment-status" element={<PaymentStatusPage />} />
                
                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<LoginPage />} />
                
                {/* Info & Legal */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/refund-policy" element={<RefundPolicyPage />} />

                {/* Customer Account (Protected) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/account/orders" element={<CustomerOrdersPage />} />
                  <Route path="/account/orders/:id" element={<OrderDetailPage />} />
                  <Route path="/account/downloads" element={<CustomerDownloadsPage />} />
                </Route>
              </Route>

              {/* Admin Portal (Protected by Admin Role) */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="attributes" element={<AdminAttributesPage />} />
                  <Route path="variations" element={<AdminAttributesPage />} />
                  <Route path="inventory" element={<AdminInventoryPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="payments" element={<AdminPaymentsPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="coupons" element={<AdminCouponsPage />} />
                  <Route path="slides" element={<AdminSlidesPage />} />
                  <Route path="reports" element={<AdminReportsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="security" element={<AdminSecurityPage />} />
                </Route>
              </Route>

              {/* 404 Handler */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />

            </Routes>
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
