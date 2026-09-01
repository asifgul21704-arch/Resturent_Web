import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SaladCarousel } from './components/SaladCarousel';
import { CategoriesSection } from './components/CategoriesSection';
import { PizzaDeliveryBanner } from './components/PizzaDeliveryBanner';
import { TopFoods } from './components/TopFoods';
import { TeamSection } from './components/TeamSection';
import { AppDownloadBanner } from './components/AppDownloadBanner';
import { Footer } from './components/Footer';

// Views
import { MenuCatalog } from './components/MenuCatalog';
import { OffersView } from './components/OffersView';
import { RestaurantsView } from './components/RestaurantsView';
import { ServicesView } from './components/ServicesView';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';

// Modals & Drawers
import { FoodDetailModal } from './components/FoodDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveTrackingModal } from './components/LiveTrackingModal';
import { OrderInvoiceModal } from './components/OrderInvoiceModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AuthModal } from './components/AuthModal';

import { Sparkles, Bike, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MainContent: React.FC = () => {
  const {
    currentView,
    activeLiveOrder,
    setTrackingModalOrder,
    setIsAIAssistantOpen
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#2C2724] selection:bg-[#E85B43] selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. Hero Section matching screenshot */}
            <Hero />

            {/* 2. Four Color Salads Carousel matching screenshot */}
            <SaladCarousel />

            {/* 3. Promo Mosaic Grid & Categories matching screenshot */}
            <CategoriesSection />

            {/* 4. Pizza Delivery / Get Started Today Banner matching screenshot */}
            <PizzaDeliveryBanner />

            {/* 5. TOP FOODS 4-category row matching screenshot */}
            <TopFoods />

            {/* 6. Meet Our Best Team Chefs matching screenshot */}
            <TeamSection />

            {/* 7. App Download 20% Discount Banner matching screenshot */}
            <AppDownloadBanner />
          </motion.div>
        )}

        {currentView === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MenuCatalog />
          </motion.div>
        )}

        {currentView === 'offers' && (
          <motion.div
            key="offers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OffersView />
          </motion.div>
        )}

        {currentView === 'restaurants' && (
          <motion.div
            key="restaurants"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RestaurantsView />
          </motion.div>
        )}

        {currentView === 'services' && (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ServicesView />
          </motion.div>
        )}

        {currentView === 'user_dashboard' && (
          <motion.div
            key="user_dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <UserDashboard />
          </motion.div>
        )}

        {currentView === 'admin_dashboard' && (
          <motion.div
            key="admin_dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminDashboard />
          </motion.div>
        )}
      </main>

      {/* Global Footer matching screenshot */}
      <Footer />

      {/* Floating Widget: Active Live Delivery GPS Tracking Pill */}
      {activeLiveOrder && activeLiveOrder.status !== 'delivered' && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-6 z-40"
        >
          <button
            onClick={() => setTrackingModalOrder(activeLiveOrder)}
            className="px-4 py-3 bg-[#2C2724] text-white rounded-full shadow-2xl border-2 border-[#E85B43] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-[#E85B43] flex items-center justify-center text-white animate-bounce">
              <Bike className="w-4 h-4" />
            </div>
            <div className="text-left pr-2">
              <p className="text-[10px] font-bold text-neutral-400 uppercase leading-none">
                Live Delivery #{activeLiveOrder.id}
              </p>
              <p className="text-xs font-black text-white leading-tight mt-0.5">
                {activeLiveOrder.status.replace('_', ' ').toUpperCase()} • {activeLiveOrder.courier?.etaMinutes || 25}m ETA
              </p>
            </div>
            <Navigation className="w-4 h-4 text-[#E85B43] group-hover:rotate-45 transition-transform" />
          </button>
        </motion.div>
      )}

      {/* Floating Widget: AI Concierge Trigger */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
        className="fixed bottom-6 right-6 z-40"
      >
        <button
          id="floating-ai-agent-btn"
          onClick={() => setIsAIAssistantOpen(true)}
          className="px-4 py-3.5 bg-gradient-to-r from-[#E85B43] to-[#FA9538] text-white rounded-full shadow-2xl shadow-[#E85B43]/30 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all group border-2 border-white"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="text-xs font-black tracking-wide pr-1">
            Ask AI Chef
          </span>
        </button>
      </motion.div>

      {/* All Overlay Modals & Drawers */}
      <FoodDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <LiveTrackingModal />
      <OrderInvoiceModal />
      <AIAssistantModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
