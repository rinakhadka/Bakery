import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Context Providers
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import KhaltiCallbackPage from './pages/KhaltiCallbackPage';

import { testApiConnection } from './services/api';
import { Cake } from 'lucide-react';

/**
 * 404 Not Found Page Component
 */
function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-[#F8D2D7] text-[#9F5F2B] flex items-center justify-center mx-auto">
        <Cake className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-[#2C1810]">
        404 - Page Not Found
      </h1>
      <p className="text-xs text-[#6B5347]">
        Looks like this crumb got lost! The page you were looking for doesn't exist.
      </p>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#9F5F2B] hover:bg-[#834C1F] transition-colors"
        >
          Return to Sweet Crumbs Bakery
        </Link>
      </div>
    </div>
  );
}

/**
 * Main Application Component with complete multi-page routing
 */
export default function App() {
  const [apiConnected, setApiConnected] = useState(false);
  const [apiStatusData, setApiStatusData] = useState(null);

  // Initial API health check
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const data = await testApiConnection();
      setApiStatusData(data);
      setApiConnected(true);
    } catch (error) {
      setApiConnected(false);
    }
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#FCF9F2] text-[#2C1810] selection:bg-[#F8D2D7] selection:text-[#2C1810]">
            {/* Global Bakery Header */}
            <Navbar apiConnected={apiConnected} />

            {/* Dynamic Routed Pages */}
            <main className="flex-1">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <HomePage 
                      apiStatus={apiStatusData}
                      onRefreshApiStatus={(status) => setApiConnected(status)}
                    />
                  } 
                />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment/khalti/callback" element={<KhaltiCallbackPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected Customer Routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/order/:id" element={<OrderDetailsPage />} />

                {/* Information Pages */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* 404 Catch-All Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Global Bakery Footer */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
