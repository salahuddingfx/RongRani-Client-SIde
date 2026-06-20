import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import SocketProvider from './contexts/SocketContext.jsx';
import AppInitializer from './components/AppInitializer';
import AppLayout from './components/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import CustomCursor from './components/CustomCursor';

import './App.css';

// Loading Component
const PageLoading = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 border-4 border-maroon border-t-transparent rounded-full animate-spin" />
    <p className="text-slate-500 font-medium animate-pulse">Loading perfection...</p>
  </div>
);

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PaymentStatus = lazy(() => import('./pages/PaymentStatus'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const QuickOrderLookup = lazy(() => import('./pages/QuickOrderLookup'));
const Orders = lazy(() => import('./pages/Orders'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Reviews = lazy(() => import('./pages/Reviews'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const Developer = lazy(() => import('./pages/Developer'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <SocketProvider>
              <AppInitializer>
                <CartProvider>
                  <WishlistProvider>
                    <HelmetProvider>
                      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                        <Toaster
                          position="top-center"
                          containerStyle={{ zIndex: 99999 }}
                          toastOptions={{
                            duration: 2500,
                            style: {
                              background: '#1e293b',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '500',
                              borderRadius: '12px',
                              padding: '10px 16px',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            },
                            success: {
                              duration: 2500,
                              iconTheme: {
                                primary: '#16a34a',
                                secondary: '#fff',
                              },
                            },
                            error: {
                              duration: 3500,
                              iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                              },
                            },
                          }}
                        />
                        <ScrollToTop />
                        <CustomCursor />

                        <Suspense fallback={<PageLoading />}>
                          <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<AppLayout />}>
                              <Route index element={<Home />} />
                              <Route path="shop" element={<Shop />} />
                              <Route path="product/:id" element={<ProductDetail />} />
                              <Route path="login" element={
                                <PublicRoute>
                                  <Login />
                                </PublicRoute>
                              } />
                              <Route path="register" element={
                                <PublicRoute>
                                  <Register />
                                </PublicRoute>
                              } />
                              <Route path="forgot-password" element={
                                <PublicRoute>
                                  <ForgotPassword />
                                </PublicRoute>
                              } />
                              <Route path="reset-password/:token" element={
                                <PublicRoute>
                                  <ResetPassword />
                                </PublicRoute>
                              } />

                              {/* Cart and Checkout - Public (Guest checkout allowed) */}
                              <Route path="cart" element={<Cart />} />
                              <Route path="checkout" element={<Checkout />} />
                              <Route path="reviews" element={<Reviews />} />
                              <Route path="user/reviews" element={<Reviews />} />
                              <Route path="my-reviews" element={<Reviews />} />


                              {/* Private Routes */}
                              <Route path="dashboard" element={
                                <PrivateRoute>
                                  <Dashboard />
                                </PrivateRoute>
                              } />

                              {/* Orders - Allow guest access for order tracking */}
                              <Route path="orders" element={<Orders />} />
                              <Route path="my-orders" element={<Orders />} />

                              <Route path="wishlist" element={
                                <PrivateRoute>
                                  <Wishlist />
                                </PrivateRoute>
                              } />
                              <Route path="contact" element={<ContactUs />} />
                              <Route path="help" element={<HelpCenter />} />
                              <Route path="about" element={<AboutUs />} />
                              <Route path="terms" element={<TermsConditions />} />
                              <Route path="privacy-policy" element={<PrivacyPolicy />} />
                              <Route path="cookie-policy" element={<CookiePolicy />} />
                              <Route path="refund-policy" element={<RefundPolicy />} />
                              <Route path="shipping-policy" element={<ShippingPolicy />} />
                              <Route path="developer" element={<Developer />} />
                              <Route path="quick-track" element={<QuickOrderLookup />} />
                              <Route path="track/:orderId" element={<OrderTracking />} />
                              <Route path="track" element={<OrderTracking />} />
                              <Route path="payment/:status/:orderId" element={<PaymentStatus />} />
                              <Route path="payment/:status" element={<PaymentStatus />} />

                              {/* 404 Route */}
                              <Route path="*" element={<NotFound />} />
                            </Route>
                          </Routes>
                        </Suspense>
                      </Router>
                    </HelmetProvider>
                  </WishlistProvider>
                </CartProvider>
              </AppInitializer>
            </SocketProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
