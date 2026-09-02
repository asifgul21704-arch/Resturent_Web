import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  ShoppingBag, 
  User, 
  UtensilsCrossed, 
  ShieldAlert, 
  LogOut, 
  Heart, 
  Compass, 
  MapPin, 
  ChefHat, 
  LayoutDashboard, 
  Utensils, 
  Bike, 
  Tag, 
  BarChart3, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    adminActiveTab,
    setAdminActiveTab,
    openAdminTab,
    cartCount,
    setIsCartDrawerOpen,
    currentUser,
    setIsAuthModalOpen,
    logoutUser,
    switchDemoUser,
    foodItems,
    orders,
    favorites,
    setSelectedFoodDetail,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Customer account stats
  const userOrders = orders.filter(
    o => o.userId === currentUser?.id || o.customerId === currentUser?.id || o.customerEmail === currentUser?.email
  );
  const userFavoritesCount = favorites?.length || 0;
  const userAddressesCount = currentUser?.addresses?.length || 0;

  // Instant search results
  const searchResults = searchQuery.trim().length > 0
    ? foodItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    // Smooth scroll to top or section if on home
    if (view === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F4EFE6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo matching screenshot */}
          <div 
            id="foody-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-full bg-[#E85B43] flex items-center justify-center shadow-md shadow-[#E85B43]/20 group-hover:scale-105 transition-transform">
              {/* Burger icon */}
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 10.5C4 7.46 6.46 5 9.5 5h5c3.04 0 5.5 2.46 5.5 5.5v.5H4v-.5zM3 13h18v1.5c0 .83-.67 1.5-1.5 1.5H4.5A1.5 1.5 0 0 1 3 14.5V13zm1 5h16v.5c0 1.93-1.57 3.5-3.5 3.5h-9A3.5 3.5 0 0 1 4 18.5V18z"/>
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-[#E85B43] font-display">
              Foody
            </span>
          </div>

          {/* Desktop Navigation Links matching screenshot: Home, Menu, Offers, Foods, Services, Restaurants */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-9 font-medium text-[15px]">
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className={`transition-all duration-200 relative py-1 ${
                currentView === 'home'
                  ? 'text-[#2C2724] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#E85B43] after:rounded-full'
                  : 'text-[#6B655F] hover:text-[#E85B43]'
              }`}
            >
              Home
            </button>
            <button
              id="nav-menu"
              onClick={() => handleNavClick('menu')}
              className={`transition-all duration-200 relative py-1 ${
                currentView === 'menu'
                  ? 'text-[#E85B43] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#E85B43] after:rounded-full'
                  : 'text-[#6B655F] hover:text-[#E85B43]'
              }`}
            >
              Menu
            </button>
            <button
              id="nav-offers"
              onClick={() => handleNavClick('offers')}
              className={`transition-all duration-200 relative py-1 ${
                currentView === 'offers'
                  ? 'text-[#E85B43] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#E85B43] after:rounded-full'
                  : 'text-[#6B655F] hover:text-[#E85B43]'
              }`}
            >
              Offers
            </button>
            <button
              id="nav-foods"
              onClick={() => handleNavClick('foods')}
              className={`transition-all duration-200 relative py-1 ${
                currentView === 'foods'
                  ? 'text-[#E85B43] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#E85B43] after:rounded-full'
                  : 'text-[#6B655F] hover:text-[#E85B43]'
              }`}
            >
              Foods
            </button>
            <button
              id="nav-services"
              onClick={() => handleNavClick('services')}
              className={`transition-all duration-200 relative py-1 ${
                currentView === 'services'
                  ? 'text-[#E85B43] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#E85B43] after:rounded-full'
                  : 'text-[#6B655F] hover:text-[#E85B43]'
              }`}
            >
              Services
            </button>
            <button
              id="nav-restaurants"
              onClick={() => handleNavClick('restaurants')}
              className={`transition-all duration-200 relative py-1 ${
                currentView === 'restaurants'
                  ? 'text-[#E85B43] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#E85B43] after:rounded-full'
                  : 'text-[#6B655F] hover:text-[#E85B43]'
              }`}
            >
              Restaurants
            </button>
            {currentUser?.role === 'admin' && (
              <button
                id="nav-admin-dashboard"
                onClick={() => openAdminTab('menu_crud')}
                className={`transition-all duration-200 relative py-1 flex items-center gap-1.5 ${
                  currentView === 'admin_dashboard' || currentView === 'admin-dashboard'
                    ? 'text-[#E85B43] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#E85B43] after:rounded-full'
                    : 'text-[#6B655F] hover:text-[#E85B43]'
                }`}
              >
                <span>Dashboard</span>
                <span className="text-[10px] bg-[#E85B43]/10 text-[#E85B43] font-black px-1.5 py-0.5 rounded-full">
                  Admin
                </span>
              </button>
            )}
          </nav>

          {/* Right Action Icons: Search, Cart, Sign In / Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Search Trigger Button */}
            <div className="relative">
              <button
                id="search-btn-toggle"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#2C2724] hover:bg-[#F5EFE6] transition-colors"
                title="Search foods, dishes, cuisines"
              >
                <Search className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Search Dropdown Popup */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#EDE7DD] p-4 z-50"
                  >
                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-[#8C847A] absolute left-3" />
                      <input
                        type="text"
                        placeholder="Search salad, pizza, burger..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full pl-9 pr-8 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 text-xs text-[#8C847A] hover:text-black"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Results list */}
                    {searchResults.length > 0 && (
                      <div className="mt-3 divide-y divide-[#F5EFE6] max-h-60 overflow-y-auto">
                        {searchResults.map(item => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSelectedFoodDetail(item);
                              setIsSearchOpen(false);
                            }}
                            className="py-2.5 px-2 flex items-center gap-3 hover:bg-[#FAF7F2] rounded-lg cursor-pointer transition-colors"
                          >
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#2C2724] truncate">{item.name}</p>
                              <p className="text-xs text-[#8C847A]">{item.category} • ${item.price.toFixed(2)}</p>
                            </div>
                            <span className="text-xs font-bold text-[#E85B43]">View</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchQuery && searchResults.length === 0 && (
                      <p className="mt-3 text-center text-xs text-[#8C847A] py-2">
                        No dishes found matching "{searchQuery}"
                      </p>
                    )}

                    <div className="mt-2 pt-2 border-t border-[#F5EFE6] flex items-center justify-between text-xs text-[#8C847A]">
                      <span>Press enter to view all</span>
                      <button
                        onClick={() => {
                          setCurrentView('menu');
                          setIsSearchOpen(false);
                        }}
                        className="text-[#E85B43] font-semibold hover:underline"
                      >
                        Explore Menu →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shopping Cart Button with live count */}
            <button
              id="cart-drawer-toggle"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#2C2724] hover:bg-[#F5EFE6] transition-colors"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E85B43] text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Sign In button matching screenshot */}
            {currentUser ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  id="user-profile-menu-toggle"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition-all ${
                    isProfileMenuOpen 
                      ? 'bg-white border-[#E85B43] shadow-md ring-2 ring-[#E85B43]/20' 
                      : 'bg-[#FAF7F2] border-[#EAE3D5] hover:border-[#E85B43]/50'
                  }`}
                  title="User Profile & Admin Command Center"
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#E85B43]"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  </div>
                  <span className="text-xs font-bold text-[#2C2724] hidden sm:inline max-w-[90px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  {currentUser.role === 'admin' && (
                    <span className="text-[10px] bg-[#E85B43] text-white font-black px-1.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </button>

                {/* Profile dropdown menu */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      id="header-user-profile-dropdown"
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.16)] border border-[#EAE3D5] p-3.5 z-50 overflow-hidden text-[#2C2724]"
                    >
                      {/* 1. Header: User Info Card */}
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DD] mb-3">
                        <div className="relative shrink-0">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-[#E85B43] shadow-xs"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-[#2C2724] truncate">{currentUser.name}</p>
                            <span className="text-[10px] font-bold bg-[#E85B43]/10 text-[#E85B43] px-2 py-0.5 rounded-full">
                              {currentUser.role === 'admin' ? 'Admin' : 'Member'}
                            </span>
                          </div>
                          <p className="text-xs text-[#8C847A] truncate">{currentUser.email}</p>
                        </div>
                      </div>

                      {/* 2. Customer Navigation Items */}
                      <div className="space-y-1">
                        <button
                          id="menu-user-orders"
                          onClick={() => {
                            setCurrentView('user_dashboard');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#FAF7F2] flex items-center justify-between text-xs font-bold text-[#2C2724] transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#E85B43] flex items-center justify-center">
                              <ShoppingBag className="w-4 h-4" />
                            </div>
                            <span>My Orders & Live Tracking</span>
                          </div>
                          {userOrders.length > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#E85B43] text-[10px] font-black">
                              {userOrders.length}
                            </span>
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[#8C847A] group-hover:translate-x-0.5 transition-transform" />
                          )}
                        </button>

                        <button
                          id="menu-user-favorites"
                          onClick={() => {
                            setCurrentView('user_dashboard');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#FAF7F2] flex items-center justify-between text-xs font-bold text-[#2C2724] transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                              <Heart className="w-4 h-4" />
                            </div>
                            <span>Wishlist & Favorites</span>
                          </div>
                          {userFavoritesCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-black">
                              {userFavoritesCount}
                            </span>
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[#8C847A] group-hover:translate-x-0.5 transition-transform" />
                          )}
                        </button>

                        <button
                          id="menu-user-addresses"
                          onClick={() => {
                            setCurrentView('user_dashboard');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#FAF7F2] flex items-center justify-between text-xs font-bold text-[#2C2724] transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span>Saved Delivery Addresses</span>
                          </div>
                          {userAddressesCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">
                              {userAddressesCount}
                            </span>
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[#8C847A] group-hover:translate-x-0.5 transition-transform" />
                          )}
                        </button>

                        <button
                          id="menu-user-profile-settings"
                          onClick={() => {
                            setCurrentView('user_dashboard');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#FAF7F2] flex items-center justify-between text-xs font-bold text-[#2C2724] transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                            <span>Account Profile Settings</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#8C847A] group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>

                      {/* 3. Role switch / Admin portal only if admin */}
                      {currentUser.role === 'admin' && (
                        <div className="pt-2 mt-2 border-t border-[#F2ECE3]">
                          <button
                            id="menu-admin-portal-link"
                            onClick={() => {
                              openAdminTab('menu_crud');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-[#E85B43] bg-orange-50/60 hover:bg-orange-50 flex items-center justify-between text-xs font-bold transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <ChefHat className="w-4 h-4 text-[#E85B43]" />
                              <span>Open Admin Command Center</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#E85B43]" />
                          </button>
                        </div>
                      )}

                      {/* 4. Sign Out */}
                      <div className="pt-2 mt-2 border-t border-[#F2ECE3]">
                        <button
                          id="menu-logout-button"
                          onClick={() => {
                            logoutUser();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 flex items-center justify-between text-xs font-bold transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                id="header-sign-in-btn"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#EAE3D5] text-[#2C2724] font-bold text-sm bg-white hover:bg-[#FAF7F2] hover:border-[#E85B43] transition-all shadow-sm"
              >
                <User className="w-4 h-4 stroke-[2.5]" />
                <span>Sign in</span>
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#2C2724] hover:bg-[#F5EFE6]"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#F4EFE6] space-y-2">
            {['home', 'menu', 'offers', 'foods', 'services', 'restaurants'].map(item => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold capitalize text-sm ${
                  currentView === item ? 'bg-[#E85B43] text-white' : 'text-[#2C2724] hover:bg-[#FAF7F2]'
                }`}
              >
                {item}
              </button>
            ))}
            <div className="pt-2 border-t border-[#F4EFE6] flex gap-2 px-2">
              <button
                onClick={() => {
                  setCurrentView('user_dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-[#FAF7F2] text-xs font-bold text-[#2C2724]"
              >
                User Profile
              </button>
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => {
                    openAdminTab('menu_crud');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#E85B43] text-white text-xs font-bold text-center shadow-xs"
                >
                  👑 Admin Panel
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
