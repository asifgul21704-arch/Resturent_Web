import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Bike,
  Sparkles,
  Filter,
  Search,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Eye,
  Tag,
  Users,
  Settings,
  Copy,
  AlertTriangle,
  ChevronDown,
  CheckSquare,
  Square,
  Flame,
  Clock,
  Award,
  Phone,
  Truck,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Percent,
  Layers,
  Save,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem, Order, OrderStatus, FoodAddon, PromoCode } from '../types';
import { DEFAULT_USERS } from '../data/mockData';

// High-resolution culinary photo presets for quick-filling dish images
const PRESET_IMAGE_SUGGESTIONS = [
  { label: 'Salad', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80' },
  { label: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
  { label: 'Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80' },
  { label: 'Shake', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80' },
  { label: 'Dessert', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80' },
  { label: 'Healthy Bowl', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fresh Drink', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80' }
];

const AVAILABLE_COURIERS = [
  { name: 'Marco Rossi', phone: '+1 (555) 890-1234', vehicle: 'Electric Vespa Scooter (Red)', rating: 4.98 },
  { name: 'Sofia Bianchi', phone: '+1 (555) 234-5678', vehicle: 'Priority Delivery E-Bike', rating: 4.95 },
  { name: 'Luca Ferri', phone: '+1 (555) 456-7890', vehicle: 'Eco Cargo Van', rating: 4.89 },
  { name: 'Matteo Bruno', phone: '+1 (555) 789-0123', vehicle: 'Turbo Sprint Scooter', rating: 4.92 }
];

export const AdminDashboard: React.FC = () => {
  const {
    foodItems,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    bulkDeleteFoodItems,
    bulkToggleStock,
    resetMenuToDefault,
    orders,
    updateOrderStatus,
    advanceOrderStatus,
    deleteOrder,
    assignCourier,
    promoCodes,
    addPromoCode,
    deletePromoCode,
    togglePromoCodeStatus,
    setInvoiceModalOrder,
    setTrackingModalOrder,
    currentUser,
    updateUserProfile,
    switchDemoUser,
    showToast,
    adminActiveTab,
    setAdminActiveTab
  } = useApp();

  // Navigation tabs synced with global context
  const activeTab = adminActiveTab || 'menu_crud';
  const setActiveTab = setAdminActiveTab;

  // Menu Search, Filter, Sort & View Mode
  const [menuSearch, setMenuSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStockStatus, setFilterStockStatus] = useState<'all' | 'in_stock' | 'sold_out' | 'on_sale' | 'best_seller'>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'prep_time' | 'name'>('rating');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Bulk Selection
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Add / Edit Modal State
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Add/Edit Form Fields
  const [dishName, setDishName] = useState('');
  const [dishTagline, setDishTagline] = useState('');
  const [dishCategory, setDishCategory] = useState<'Salads' | 'Burgers' | 'Pizza' | 'Pasta' | 'Shakes' | 'Desserts' | 'Healthy' | 'Drinks'>('Salads');
  const [dishPrice, setDishPrice] = useState<number>(8.50);
  const [dishDiscountPrice, setDishDiscountPrice] = useState<number | undefined>(undefined);
  const [dishDescription, setDishDescription] = useState('');
  const [dishImage, setDishImage] = useState('');
  const [dishCalories, setDishCalories] = useState<number>(340);
  const [dishPrepTime, setDishPrepTime] = useState<number>(15);
  const [dishIsVegan, setDishIsVegan] = useState(false);
  const [dishIsGlutenFree, setDishIsGlutenFree] = useState(false);
  const [dishIsSpicy, setDishIsSpicy] = useState(false);
  const [dishIsBestSeller, setDishIsBestSeller] = useState(false);
  const [dishInStock, setDishInStock] = useState(true);
  const [dishAddons, setDishAddons] = useState<FoodAddon[]>([]);
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState<number>(1.50);

  // Single Delete Confirmation Modal
  const [itemToDelete, setItemToDelete] = useState<FoodItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Bulk Delete Confirmation Modal
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Reset Menu Catalog Confirmation Modal
  const [isResetCatalogModalOpen, setIsResetCatalogModalOpen] = useState(false);

  // Orders Management state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Promo Vouchers state
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscountType, setNewPromoDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [newPromoDiscountValue, setNewPromoDiscountValue] = useState<number>(20);
  const [newPromoMinOrder, setNewPromoMinOrder] = useState<number>(25);
  const [newPromoFreeShipping, setNewPromoFreeShipping] = useState(false);
  const [newPromoDescription, setNewPromoDescription] = useState('Limited time promotional voucher discount');

  // Kitchen Operating Status & Store Settings
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [storeName, setStoreName] = useState('Foody Central Trastevere');
  const [storePhone, setStorePhone] = useState('+1 (555) 890-FOODY');
  const [deliveryBaseFee, setDeliveryBaseFee] = useState(2.50);
  const [taxRatePercent, setTaxRatePercent] = useState(8.0);
  const [broadcastBanner, setBroadcastBanner] = useState('Fresh organic ingredients freshly sourced every morning.');
  const [adminName, setAdminName] = useState(currentUser?.name || 'Chef Alessandro');
  const [adminEmail, setAdminEmail] = useState(currentUser?.email || 'admin@thefoody.com');

  // --- Calculations for Analytics ---
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const activeDeliveriesCount = orders.filter(o => o.status === 'on_the_way' || o.status === 'preparing' || o.status === 'placed').length;
  const completedOrdersCount = orders.filter(o => o.status === 'delivered').length;

  // Filter and sort dishes
  const filteredAndSortedDishes = useMemo(() => {
    let result = foodItems.filter(item => {
      // Category filter
      if (filterCategory !== 'All' && item.category !== filterCategory) return false;

      // Stock status filter
      if (filterStockStatus === 'in_stock' && !item.inStock) return false;
      if (filterStockStatus === 'sold_out' && item.inStock) return false;
      if (filterStockStatus === 'on_sale' && (!item.discountPrice || item.discountPrice >= item.price)) return false;
      if (filterStockStatus === 'best_seller' && !item.isBestSeller) return false;

      // Text search
      if (menuSearch.trim()) {
        const query = menuSearch.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesTags = item.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesCategory && !matchesDesc && !matchesTags) return false;
      }
      return true;
    });

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'price_asc') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sortBy === 'price_desc') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      if (sortBy === 'prep_time') return a.prepTimeMinutes - b.prepTimeMinutes;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [foodItems, filterCategory, filterStockStatus, menuSearch, sortBy]);

  // Orders filtered
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q) || order.orderNumber.toLowerCase().includes(q);
        const matchesCustomer = order.customerName.toLowerCase().includes(q) || order.customerEmail.toLowerCase().includes(q);
        const matchesCourier = (order.courier?.name || '').toLowerCase().includes(q);
        if (!matchesId && !matchesCustomer && !matchesCourier) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Open modal for adding a new dish
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setDishName('');
    setDishTagline('Handcrafted artisan recipe made with organic produce');
    setDishCategory('Salads');
    setDishPrice(8.50);
    setDishDiscountPrice(undefined);
    setDishDescription('Freshly harvested organic ingredients served with homemade dressing.');
    setDishImage('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
    setDishCalories(340);
    setDishPrepTime(15);
    setDishIsVegan(false);
    setDishIsGlutenFree(false);
    setDishIsSpicy(false);
    setDishIsBestSeller(false);
    setDishInStock(true);
    setDishAddons([
      { id: 'addon-1', name: 'Extra Dressing', price: 0.80 },
      { id: 'addon-2', name: 'Avocado Slices', price: 1.50 }
    ]);
    setIsFoodModalOpen(true);
  };

  // Open modal for editing an existing dish
  const handleOpenEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setDishName(item.name);
    setDishTagline(item.tagline || '');
    setDishCategory(item.category);
    setDishPrice(item.price);
    setDishDiscountPrice(item.discountPrice);
    setDishDescription(item.description);
    setDishImage(item.image);
    setDishCalories(item.calories);
    setDishPrepTime(item.prepTimeMinutes);
    setDishIsVegan(!!item.isVegan);
    setDishIsGlutenFree(!!item.isGlutenFree);
    setDishIsSpicy(!!item.isSpicy);
    setDishIsBestSeller(!!item.isBestSeller);
    setDishInStock(item.inStock);
    setDishAddons(item.availableAddons ? [...item.availableAddons] : []);
    setIsFoodModalOpen(true);
  };

  // Duplicate / Clone a dish
  const handleCloneDish = (item: FoodItem) => {
    addFoodItem({
      ...item,
      name: `${item.name} (Copy)`,
      rating: 5.0,
      reviewCount: 1,
      availableAddons: item.availableAddons ? [...item.availableAddons] : []
    });
    showToast(`Cloned "${item.name}" as a new menu item`, 'success');
  };

  // Save Dish (Add or Update)
  const handleSaveFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) {
      showToast('Please enter a dish name', 'warning');
      return;
    }

    const payload = {
      name: dishName.trim(),
      tagline: dishTagline.trim(),
      category: dishCategory,
      price: Number(dishPrice),
      discountPrice: dishDiscountPrice ? Number(dishDiscountPrice) : undefined,
      description: dishDescription.trim(),
      image: dishImage.trim() || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      calories: Number(dishCalories) || 300,
      prepTimeMinutes: Number(dishPrepTime) || 15,
      isVegan: dishIsVegan,
      isGlutenFree: dishIsGlutenFree,
      isSpicy: dishIsSpicy,
      isBestSeller: dishIsBestSeller,
      inStock: dishInStock,
      availableAddons: dishAddons,
      tags: [dishCategory.toLowerCase(), 'artisan', dishIsVegan ? 'vegan' : 'gourmet']
    };

    if (editingItem) {
      updateFoodItem(editingItem.id, payload);
    } else {
      addFoodItem({
        ...payload,
        rating: 5.0,
        reviewCount: 1
      });
    }

    setIsFoodModalOpen(false);
  };

  // Add customized addon row
  const handleAddAddon = () => {
    if (!newAddonName.trim()) return;
    setDishAddons(prev => [
      ...prev,
      {
        id: `add-${Date.now()}`,
        name: newAddonName.trim(),
        price: Number(newAddonPrice) || 1.00
      }
    ]);
    setNewAddonName('');
    setNewAddonPrice(1.50);
  };

  const handleRemoveAddon = (id: string) => {
    setDishAddons(prev => prev.filter(a => a.id !== id));
  };

  // Confirm Single Delete
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteFoodItem(itemToDelete.id);
      setItemToDelete(null);
      setIsDeleteModalOpen(false);
      setSelectedItemIds(prev => prev.filter(id => id !== itemToDelete.id));
    }
  };

  // Bulk Selection Toggles
  const handleToggleSelectAll = () => {
    if (selectedItemIds.length === filteredAndSortedDishes.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filteredAndSortedDishes.map(d => d.id));
    }
  };

  const handleToggleSelectItem = (id: string) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    bulkDeleteFoodItems(selectedItemIds);
    setSelectedItemIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  const handleBulkStockToggle = (inStock: boolean) => {
    bulkToggleStock(selectedItemIds, inStock);
    setSelectedItemIds([]);
  };

  // Create Promo Code
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) {
      showToast('Please enter a voucher code name', 'warning');
      return;
    }

    const promo: PromoCode = {
      code: newPromoCode.trim().toUpperCase(),
      discountPercentage: newPromoDiscountType === 'percentage' ? Number(newPromoDiscountValue) : undefined,
      discountFixed: newPromoDiscountType === 'fixed' ? Number(newPromoDiscountValue) : undefined,
      minOrder: Number(newPromoMinOrder) || 0,
      freeShipping: newPromoFreeShipping,
      description: newPromoDescription.trim(),
      isActive: true
    };

    addPromoCode(promo);
    setIsPromoModalOpen(false);
    setNewPromoCode('');
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* ========================================================================= */}
      {/* Top Header & Store Control Bar */}
      {/* ========================================================================= */}
      <div className="bg-[#2C2724] text-white rounded-[32px] p-6 sm:p-8 shadow-xl mb-8 border border-neutral-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-[#E85B43] text-white text-[11px] font-black rounded-full uppercase tracking-wider">
                EXECUTIVE CONTROL CENTER
              </span>
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#E85B43]" />
                {storeName}
              </span>
              <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-neutral-300">
                {foodItems.length} Total Menu Dishes
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-display mt-2.5 tracking-tight">
              Kitchen Operations & Catalog Manager
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl">
              Add new gourmet dishes, update recipe parameters, manage flash sale discounts, dispatch live GPS couriers, and supervise customer orders.
            </p>
          </div>

          {/* Quick Actions & Kitchen Status */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Kitchen Status Toggle */}
            <div className="flex items-center gap-2.5 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-xs border border-white/10">
              <span className={`w-3 h-3 rounded-full ${isKitchenOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <div className="text-left">
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Kitchen Status</p>
                <p className="text-xs font-black">{isKitchenOpen ? 'Accepting Orders' : 'Kitchen Paused'}</p>
              </div>
              <button
                id="admin-toggle-kitchen-status"
                onClick={() => {
                  const next = !isKitchenOpen;
                  setIsKitchenOpen(next);
                  showToast(`Kitchen status switched to ${next ? 'Active' : 'Paused'}`, 'info');
                }}
                className="ml-2 text-[10px] font-bold px-2.5 py-1 bg-white/20 hover:bg-white text-[#2C2724] hover:text-black rounded-xl transition-all"
              >
                Switch
              </button>
            </div>

            {/* Quick Add Dish Button */}
            <button
              id="admin-quick-add-dish"
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 bg-[#E85B43] text-white text-xs font-bold rounded-2xl hover:bg-[#D44730] transition-all flex items-center gap-2 shadow-lg shadow-[#E85B43]/30"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Dish</span>
            </button>

            {/* Demo Account Switcher */}
            <button
              id="admin-switch-to-customer"
              onClick={() => switchDemoUser('customer')}
              className="px-3.5 py-2.5 bg-white/10 text-neutral-200 hover:text-white hover:bg-white/20 text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5"
              title="Test user perspective"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View as Sarah</span>
            </button>
          </div>
        </div>

        {/* Emergency Announcement Banner Preview */}
        {broadcastBanner && (
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-4 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-semibold text-white">Live Broadcast:</span>
              <span className="line-clamp-1">{broadcastBanner}</span>
            </div>
            <span className="text-[11px] text-neutral-400">Syncs instantly with store</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* Navigation Sub-Tabs Bar */}
      {/* ========================================================================= */}
      <div className="flex gap-2 border-b border-[#EDE7DD] pb-4 mb-8 overflow-x-auto scrollbar-none">
        {[
          { id: 'menu_crud', label: '🥗 Food Catalog & CRUD', count: foodItems.length },
          { id: 'orders_dispatch', label: '🛵 Orders & GPS Dispatch', count: orders.length },
          { id: 'promos', label: '🏷️ Promo Vouchers', count: promoCodes.length },
          { id: 'analytics', label: '📊 Revenue & Analytics' },
          { id: 'customers', label: '👥 Customer Directory', count: DEFAULT_USERS.length },
          { id: 'settings', label: '⚙️ Kitchen & Store Settings' }
        ].map(tab => (
          <button
            key={tab.id}
            id={`admin-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#E85B43] text-white shadow-md shadow-[#E85B43]/25'
                : 'bg-white border border-[#EDE7DD] text-[#6B655F] hover:bg-[#FAF7F2]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#57514B]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FOOD CATALOG & CRUD (Complete Add, Update, Delete, Clone, Bulk) */}
      {/* ========================================================================= */}
      {activeTab === 'menu_crud' && (
        <div className="space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#2C2724] font-display">
                Menu Inventory & Culinary Dishes
              </h2>
              <p className="text-xs text-[#78716A] mt-0.5">
                Manage recipes, prices, promotional flash sales, dietary tags, in-stock availability, and custom add-ons.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="admin-reset-menu-catalog"
                onClick={() => setIsResetCatalogModalOpen(true)}
                className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#EDE7DD] text-[#6B655F] hover:text-[#2C2724] text-xs font-bold rounded-2xl transition-colors flex items-center gap-1.5"
                title="Reset all dishes to default seed data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                id="admin-open-add-dish-btn"
                onClick={handleOpenAddModal}
                className="px-5 py-2 bg-[#E85B43] text-white text-xs font-bold rounded-2xl hover:bg-[#D44730] transition-colors flex items-center gap-1.5 shadow-md shadow-[#E85B43]/20"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Dish</span>
              </button>
            </div>
          </div>

          {/* Search, Filters, Sorters & View Switcher Bar */}
          <div className="bg-white p-4 rounded-3xl border border-[#EDE7DD] shadow-xs space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-[#8C847A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-menu-search-input"
                  type="text"
                  placeholder="Search dishes by name, ingredients, or tags..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-[#FAF7F2] border border-[#EDE7DD] rounded-2xl text-xs font-medium focus:outline-hidden focus:border-[#E85B43]"
                />
                {menuSearch && (
                  <button
                    onClick={() => setMenuSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-black"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#8C847A]">Status:</span>
                <select
                  value={filterStockStatus}
                  onChange={(e) => setFilterStockStatus(e.target.value as any)}
                  className="px-3 py-2 bg-[#FAF7F2] border border-[#EDE7DD] rounded-2xl text-xs font-bold text-[#2C2724] focus:outline-hidden"
                >
                  <option value="all">All Dishes</option>
                  <option value="in_stock">✓ In Stock Only</option>
                  <option value="sold_out">✕ Sold Out</option>
                  <option value="on_sale">🔥 On Sale / Discounted</option>
                  <option value="best_seller">★ Best Sellers</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#8C847A]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-[#FAF7F2] border border-[#EDE7DD] rounded-2xl text-xs font-bold text-[#2C2724] focus:outline-hidden"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="prep_time">Prep Time (Fastest)</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>

              {/* View Switcher: Table vs Cards */}
              <div className="flex items-center border border-[#EDE7DD] rounded-2xl p-0.5 bg-[#FAF7F2]">
                <button
                  id="admin-view-table-btn"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-xl text-xs flex items-center gap-1 transition-all ${
                    viewMode === 'table' ? 'bg-white text-[#2C2724] font-bold shadow-xs' : 'text-[#8C847A]'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  id="admin-view-cards-btn"
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-xl text-xs flex items-center gap-1 transition-all ${
                    viewMode === 'cards' ? 'bg-white text-[#2C2724] font-bold shadow-xs' : 'text-[#8C847A]'
                  }`}
                  title="Grid Cards View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
              <span className="text-[11px] font-bold text-[#8C847A] whitespace-nowrap mr-1">Category:</span>
              {['All', 'Salads', 'Burgers', 'Pizza', 'Pasta', 'Shakes', 'Desserts', 'Healthy', 'Drinks'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    filterCategory === cat
                      ? 'bg-[#2C2724] text-white'
                      : 'bg-[#FAF7F2] text-[#6B655F] hover:bg-[#F0EAE1]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Action Floating Bar (when items are checked) */}
          <AnimatePresence>
            {selectedItemIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-[#2C2724] text-white px-5 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <CheckSquare className="w-4 h-4 text-[#E85B43]" />
                  <span>{selectedItemIds.length} dishes selected</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => handleBulkStockToggle(true)}
                    className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl font-bold transition-colors"
                  >
                    Mark In Stock
                  </button>
                  <button
                    onClick={() => handleBulkStockToggle(false)}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl font-bold transition-colors"
                  >
                    Mark Sold Out
                  </button>
                  <button
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="px-3 py-1.5 bg-red-500 text-white hover:bg-red-600 rounded-xl font-bold transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedItemIds.length})</span>
                  </button>
                  <button
                    onClick={() => setSelectedItemIds([])}
                    className="text-neutral-400 hover:text-white px-2 py-1 text-xs"
                  >
                    Deselect All
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Zero Search State */}
          {filteredAndSortedDishes.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#EDE7DD] shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#FAF7F2] text-[#8C847A] flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#2C2724]">No dishes found</h3>
              <p className="text-xs text-[#8C847A] mt-1 max-w-sm mx-auto">
                No menu items match your current search or filter criteria. Try clearing filters or adding a new recipe.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setMenuSearch('');
                    setFilterCategory('All');
                    setFilterStockStatus('all');
                  }}
                  className="px-4 py-2 bg-[#FAF7F2] text-xs font-bold text-[#2C2724] rounded-full hover:bg-[#EDE7DD]"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730]"
                >
                  Add New Dish
                </button>
              </div>
            </div>
          )}

          {/* VIEW MODE: Table View */}
          {viewMode === 'table' && filteredAndSortedDishes.length > 0 && (
            <div className="bg-white rounded-3xl border border-[#EDE7DD] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF7F2] border-b border-[#EDE7DD] text-[#2C2724] font-bold">
                    <tr>
                      <th className="py-3.5 px-4 w-10">
                        <button
                          onClick={handleToggleSelectAll}
                          className="text-[#8C847A] hover:text-[#2C2724]"
                          title="Select all"
                        >
                          {selectedItemIds.length === filteredAndSortedDishes.length ? (
                            <CheckSquare className="w-4 h-4 text-[#E85B43]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="py-3.5 px-4">Dish & Recipe</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price / Promo</th>
                      <th className="py-3.5 px-4">Nutritional & Tags</th>
                      <th className="py-3.5 px-4">Stock Availability</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE1]">
                    {filteredAndSortedDishes.map(item => {
                      const isSelected = selectedItemIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-[#FAF7F2]/60 transition-colors ${
                            isSelected ? 'bg-[#E85B43]/5' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleSelectItem(item.id)}
                              className="text-[#8C847A] hover:text-[#2C2724]"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-[#E85B43]" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>

                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-2xl object-cover border border-[#EDE7DD] shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-[#2C2724] text-sm hover:text-[#E85B43] cursor-pointer" onClick={() => handleOpenEditModal(item)}>
                                    {item.name}
                                  </p>
                                  {item.isBestSeller && (
                                    <span className="text-[9px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                                      ★ Star
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-[#78716A] line-clamp-1 max-w-xs mt-0.5">
                                  {item.tagline || item.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 font-semibold text-[#2C2724]">
                            <span className="px-2.5 py-1 bg-[#FAF7F2] rounded-lg text-xs font-bold text-[#57514B]">
                              {item.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4">
                            <div className="font-black text-[#2C2724] text-sm">
                              ${item.price.toFixed(2)}
                            </div>
                            {item.discountPrice && (
                              <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                <Percent className="w-2.5 h-2.5" />
                                <span>Sale: ${item.discountPrice.toFixed(2)}</span>
                              </div>
                            )}
                          </td>

                          {/* Tags */}
                          <td className="py-3 px-4 text-[#6B655F]">
                            <div className="flex items-center gap-2">
                              <span>{item.calories} kcal</span>
                              <span>•</span>
                              <span>{item.prepTimeMinutes}m</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.isVegan && <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">Vegan</span>}
                              {item.isGlutenFree && <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded">GF</span>}
                              {item.isSpicy && <span className="text-[9px] bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded">🌶️ Spicy</span>}
                              {item.availableAddons && item.availableAddons.length > 0 && (
                                <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                                  +{item.availableAddons.length} Add-ons
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Stock Toggle Button */}
                          <td className="py-3 px-4">
                            <button
                              id={`admin-stock-toggle-${item.id}`}
                              onClick={() => updateFoodItem(item.id, { inStock: !item.inStock })}
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-1 ${
                                item.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                              title="Click to toggle availability"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${item.inStock ? 'bg-emerald-600' : 'bg-red-600'}`} />
                              <span>{item.inStock ? 'In Stock' : 'Sold Out'}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit */}
                              <button
                                id={`admin-edit-dish-${item.id}`}
                                onClick={() => handleOpenEditModal(item)}
                                className="p-1.5 rounded-xl bg-[#FAF7F2] text-[#2C2724] hover:bg-[#EDE7DD] transition-colors"
                                title="Edit dish details"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Clone */}
                              <button
                                id={`admin-clone-dish-${item.id}`}
                                onClick={() => handleCloneDish(item)}
                                className="p-1.5 rounded-xl bg-[#FAF7F2] text-[#2C2724] hover:bg-[#EDE7DD] transition-colors"
                                title="Duplicate dish"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                id={`admin-delete-dish-${item.id}`}
                                onClick={() => {
                                  setItemToDelete(item);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Delete dish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW MODE: Cards View */}
          {viewMode === 'cards' && filteredAndSortedDishes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredAndSortedDishes.map(item => {
                const isSelected = selectedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl p-4 border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#E85B43] shadow-md ring-2 ring-[#E85B43]/20'
                        : 'border-[#EDE7DD] hover:border-[#E85B43]/40 shadow-xs'
                    }`}
                  >
                    {/* Top image & badges */}
                    <div>
                      <div className="relative rounded-2xl overflow-hidden aspect-4/3 mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Select checkbox badge */}
                        <button
                          onClick={() => handleToggleSelectItem(item.id)}
                          className="absolute top-2 left-2 p-1.5 rounded-xl bg-white/90 backdrop-blur-xs text-[#2C2724] shadow-xs"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#E85B43]" />
                          ) : (
                            <Square className="w-4 h-4 text-neutral-400" />
                          )}
                        </button>

                        {/* Category badge */}
                        <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-xs text-white">
                          {item.category}
                        </span>

                        {/* Sold out overlay */}
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                            <span className="px-3 py-1 bg-red-600 text-white text-xs font-black rounded-full uppercase">
                              Sold Out
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-[#2C2724] text-sm line-clamp-1">
                          {item.name}
                        </h3>
                        <div className="text-right shrink-0">
                          <p className="font-black text-[#2C2724] text-sm">
                            ${item.price.toFixed(2)}
                          </p>
                          {item.discountPrice && (
                            <p className="text-[10px] text-emerald-600 font-bold">
                              Sale: ${item.discountPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-[#78716A] line-clamp-2 mt-1">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] text-[#8C847A] mt-2.5 font-semibold">
                        <span>{item.calories} kcal</span>
                        <span>•</span>
                        <span>{item.prepTimeMinutes}m cook</span>
                        <span>•</span>
                        <span>★ {item.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Action buttons footer */}
                    <div className="pt-3 mt-3 border-t border-[#F0EAE1] flex items-center justify-between gap-2">
                      <button
                        onClick={() => updateFoodItem(item.id, { inStock: !item.inStock })}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.inStock
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {item.inStock ? '✓ In Stock' : '✕ Sold Out'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-xl bg-[#FAF7F2] text-[#2C2724] hover:bg-[#EDE7DD]"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCloneDish(item)}
                          className="p-1.5 rounded-xl bg-[#FAF7F2] text-[#2C2724] hover:bg-[#EDE7DD]"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ORDERS & GPS DISPATCH MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'orders_dispatch' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#2C2724] font-display">
                Live Kitchen Dispatch & Courier Tracking
              </h2>
              <p className="text-xs text-[#78716A]">
                Advance cooking stages, assign couriers, inspect itemized customer orders, and launch live GPS maps.
              </p>
            </div>
          </div>

          {/* Orders Filter Pipeline */}
          <div className="bg-white p-4 rounded-3xl border border-[#EDE7DD] shadow-xs space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-[#8C847A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders by order ID, customer name, or courier..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#EDE7DD] rounded-2xl text-xs font-medium focus:outline-hidden"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                {(['all', 'placed', 'preparing', 'on_the_way', 'delivered', 'cancelled'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-[#2C2724] text-white'
                        : 'bg-[#FAF7F2] text-[#6B655F] hover:bg-[#EDE7DD]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-[#EDE7DD] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF7F2] border-b border-[#EDE7DD] text-[#2C2724] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Order ID & Time</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items Summary</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Status & Pipeline</th>
                    <th className="py-3.5 px-4">Courier Assignment</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-[#8C847A]">
                        No orders match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        {/* Order ID */}
                        <td className="py-3 px-4 font-mono font-bold text-[#2C2724]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">{order.orderNumber}</span>
                          </div>
                          <span className="block text-[10px] font-normal text-[#8C847A]">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-3 px-4">
                          <p className="font-bold text-[#2C2724]">{order.customerName}</p>
                          <p className="text-[10px] text-[#8C847A]">{order.customerEmail}</p>
                          <p className="text-[10px] text-[#8C847A] truncate max-w-[150px]">
                            {order.deliveryAddress?.street || '742 Evergreen Terrace'}
                          </p>
                        </td>

                        {/* Items */}
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-[11px] text-[#57514B]">
                                <span className="font-bold">{item.quantity}x</span> {item.foodItem.name}
                                {item.selectedAddons && item.selectedAddons.length > 0 && (
                                  <span className="text-[10px] text-neutral-400 block pl-3">
                                    + {item.selectedAddons.map(a => a.name).join(', ')}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-3 px-4 font-black text-[#2C2724]">
                          ${(order.total || order.totalAmount || 0).toFixed(2)}
                          <span className="block text-[10px] font-semibold text-emerald-700">
                            {order.paymentMethod.toUpperCase()}
                          </span>
                        </td>

                        {/* Status Pipeline */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border-0 focus:outline-hidden cursor-pointer ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'on_the_way'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'preparing'
                                  ? 'bg-purple-100 text-purple-800'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              <option value="placed">Placed</option>
                              <option value="preparing">Preparing</option>
                              <option value="on_the_way">On The Way</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                              <button
                                onClick={() => advanceOrderStatus(order.id)}
                                className="px-2 py-0.5 bg-[#2C2724] text-white text-[10px] font-bold rounded-md hover:bg-black"
                                title="Advance to next status"
                              >
                                ⚡ Next
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Courier Assignment */}
                        <td className="py-3 px-4 text-[#6B655F]">
                          <select
                            value={order.courier?.name || order.courierName || 'Marco Rossi'}
                            onChange={(e) => {
                              const selected = AVAILABLE_COURIERS.find(c => c.name === e.target.value);
                              if (selected) {
                                assignCourier(order.id, selected.name, selected.phone, selected.vehicle);
                              }
                            }}
                            className="bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl px-2 py-1 text-xs font-semibold text-[#2C2724]"
                          >
                            {AVAILABLE_COURIERS.map(c => (
                              <option key={c.name} value={c.name}>
                                {c.name} ({c.vehicle.split(' ')[0]})
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Live Tracking */}
                            <button
                              onClick={() => setTrackingModalOrder(order)}
                              className="p-1.5 bg-[#FAF7F2] text-[#E85B43] hover:bg-[#EDE7DD] rounded-xl transition-colors"
                              title="Open Live GPS Map Tracking"
                            >
                              <Bike className="w-4 h-4" />
                            </button>

                            {/* View PDF Invoice */}
                            <button
                              onClick={() => setInvoiceModalOrder(order)}
                              className="p-1.5 bg-[#FAF7F2] text-[#2C2724] hover:bg-[#EDE7DD] rounded-xl transition-colors"
                              title="Print / View PDF Invoice"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Delete Order */}
                            <button
                              onClick={() => {
                                setOrderToDelete(order);
                              }}
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                              title="Delete order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PROMO VOUCHERS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#2C2724] font-display">
                Discount Coupons & Promo Vouchers
              </h2>
              <p className="text-xs text-[#78716A]">
                Create and manage customer promotional codes, flash sale percentages, and free shipping vouchers.
              </p>
            </div>

            <button
              onClick={() => setIsPromoModalOpen(true)}
              className="px-5 py-2 bg-[#E85B43] text-white text-xs font-bold rounded-2xl hover:bg-[#D44730] transition-colors flex items-center gap-1.5 shadow-md shadow-[#E85B43]/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Voucher</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {promoCodes.map(promo => (
              <div
                key={promo.code}
                className="bg-white rounded-3xl p-5 border border-[#EDE7DD] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black px-3 py-1 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-[#2C2724]">
                        {promo.code}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(promo.code);
                          showToast(`Copied "${promo.code}" to clipboard!`, 'success');
                        }}
                        className="text-[#8C847A] hover:text-[#2C2724]"
                        title="Copy code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      promo.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {promo.isActive !== false ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  <p className="text-xs text-[#57514B] font-medium mb-3">
                    {promo.description}
                  </p>

                  <div className="space-y-1 text-xs text-[#78716A] bg-[#FAF7F2] p-3 rounded-2xl">
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span className="font-bold text-[#2C2724]">
                        {promo.discountPercentage
                          ? `${promo.discountPercentage}% OFF`
                          : promo.discountFixed
                          ? `$${promo.discountFixed.toFixed(2)} OFF`
                          : promo.freeShipping
                          ? 'FREE SHIPPING'
                          : 'Special Deal'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Order:</span>
                      <span className="font-bold text-[#2C2724]">
                        ${promo.minOrder.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                  <button
                    onClick={() => togglePromoCodeStatus(promo.code)}
                    className="text-xs font-bold text-[#57514B] hover:text-[#2C2724]"
                  >
                    {promo.isActive !== false ? 'Pause Voucher' : 'Activate'}
                  </button>

                  <button
                    onClick={() => deletePromoCode(promo.code)}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STORE ANALYTICS & REVENUE */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-xs">
              <div className="flex items-center justify-between text-[#8C847A] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#2C2724] font-display">
                ${totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +24.8% vs last week
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-xs">
              <div className="flex items-center justify-between text-[#8C847A] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#E85B43] flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#2C2724] font-display">
                {totalOrdersCount}
              </p>
              <p className="text-xs text-[#78716A] mt-1">
                {completedOrdersCount} delivered successfully
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-xs">
              <div className="flex items-center justify-between text-[#8C847A] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#2C2724] font-display">
                ${averageOrderValue.toFixed(2)}
              </p>
              <p className="text-xs text-blue-600 font-bold mt-1">
                Optimized with add-ons
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-xs">
              <div className="flex items-center justify-between text-[#8C847A] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Deliveries</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Bike className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#2C2724] font-display">
                {activeDeliveriesCount}
              </p>
              <p className="text-xs text-purple-600 font-bold mt-1">
                GPS telemetry online
              </p>
            </div>
          </div>

          {/* Category Distribution & Top Selling Dishes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Performance */}
            <div className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-xs">
              <h3 className="text-base font-black text-[#2C2724] font-display mb-4">
                Menu Category Distribution
              </h3>
              <div className="space-y-3">
                {['Salads', 'Burgers', 'Pizza', 'Pasta', 'Healthy', 'Shakes', 'Desserts', 'Drinks'].map(category => {
                  const count = foodItems.filter(i => i.category === category).length;
                  const percent = foodItems.length > 0 ? (count / foodItems.length) * 100 : 0;
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-[#2C2724]">{category}</span>
                        <span className="text-[#8C847A]">{count} dishes ({percent.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#E85B43] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Rated Star Dishes */}
            <div className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-xs">
              <h3 className="text-base font-black text-[#2C2724] font-display mb-4">
                Top Rated Culinary Star Dishes
              </h3>
              <div className="divide-y divide-[#F0EAE1]">
                {foodItems.slice(0, 5).map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-xs text-[#2C2724]">{item.name}</p>
                        <p className="text-[10px] text-[#8C847A]">{item.category} • ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-amber-600">★ {item.rating.toFixed(1)}</span>
                      <p className="text-[10px] text-[#8C847A]">{item.reviewCount} reviews</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CUSTOMER DIRECTORY & CRM */}
      {/* ========================================================================= */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#2C2724] font-display">
              Customer Accounts & Client CRM
            </h2>
            <p className="text-xs text-[#78716A]">
              View registered patrons, contact credentials, saved address books, and dietary preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DEFAULT_USERS.map(user => (
              <div
                key={user.id}
                className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#E85B43]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#2C2724]">{user.name}</h3>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          user.role === 'admin' ? 'bg-[#E85B43] text-white' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-[#8C847A]">{user.email}</p>
                      <p className="text-xs text-[#8C847A]">{user.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl text-xs">
                    <p className="font-bold text-[#2C2724]">Saved Addresses:</p>
                    {user.addresses.map(addr => (
                      <p key={addr.id} className="text-[#57514B]">
                        • <span className="font-semibold">{addr.label}:</span> {addr.street}, {addr.city} {addr.zipCode}
                      </p>
                    ))}

                    <div className="pt-2 border-t border-[#EDE7DD] flex flex-wrap gap-1">
                      {user.dietaryPreferences.map((pref, i) => (
                        <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded-md font-semibold text-[#57514B]">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                  <span className="text-[11px] text-[#8C847A]">Client since {user.createdAt}</span>
                  <button
                    onClick={() => {
                      switchDemoUser(user.role === 'admin' ? 'admin' : 'customer');
                      showToast(`Switched active session to ${user.name}`, 'info');
                    }}
                    className="text-xs font-bold text-[#E85B43] hover:underline"
                  >
                    Log In as this User →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: KITCHEN & STORE SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE7DD] shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#2C2724] font-display">
              Kitchen & Store Operational Parameters
            </h2>
            <p className="text-xs text-[#78716A]">
              Configure delivery radius, sales tax rates, base courier fees, emergency broadcasts, and admin profile.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUserProfile({ name: adminName, email: adminEmail });
              showToast('Updated store settings and admin profile successfully!', 'success');
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Restaurant Branch Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Direct Kitchen Dispatch Phone</label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Base Delivery Fee ($)</label>
                <input
                  type="number"
                  step="0.5"
                  value={deliveryBaseFee}
                  onChange={(e) => setDeliveryBaseFee(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Tax Rate Percentage (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={taxRatePercent}
                  onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#57514B] block mb-1">Storewide Broadcast Announcement Banner</label>
              <input
                type="text"
                value={broadcastBanner}
                onChange={(e) => setBroadcastBanner(e.target.value)}
                placeholder="e.g. Free shipping today on all gourmet orders above $35!"
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
              />
            </div>

            <div className="pt-4 border-t border-[#EDE7DD]">
              <h3 className="text-sm font-bold text-[#2C2724] mb-3">Admin Executive Credentials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Executive Name</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Admin Email</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#E85B43] text-white text-xs font-bold rounded-2xl hover:bg-[#D44730] transition-colors shadow-md"
              >
                Save All Operational Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT CULINARY DISH (With Image Presets & Addons Creator) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isFoodModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#EDE7DD] relative my-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                id="admin-close-food-modal"
                onClick={() => setIsFoodModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EDE7DD] flex items-center justify-center text-[#2C2724] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-black uppercase text-[#E85B43] tracking-wider">
                  {editingItem ? 'MENU UPDATER' : 'NEW RECIPE ENTRY'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#2C2724] font-display">
                  {editingItem ? `Edit Recipe "${editingItem.name}"` : 'Add New Culinary Masterpiece'}
                </h3>
              </div>

              <form onSubmit={handleSaveFoodItem} className="space-y-4">
                {/* Dish Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Dish Name *</label>
                    <input
                      id="food-input-name"
                      type="text"
                      required
                      placeholder="e.g. Tuscan Wild Fig Pizza"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Tagline / Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Prosciutto di Parma & White Truffle Glaze"
                      value={dishTagline}
                      onChange={(e) => setDishTagline(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Category & Pricing */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Category *</label>
                    <select
                      id="food-input-category"
                      value={dishCategory}
                      onChange={(e) => setDishCategory(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-bold"
                    >
                      <option value="Salads">Salads</option>
                      <option value="Burgers">Burgers</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Pasta">Pasta</option>
                      <option value="Shakes">Shakes</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Healthy">Healthy</option>
                      <option value="Drinks">Drinks</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Base Price ($) *</label>
                    <input
                      id="food-input-price"
                      type="number"
                      step="0.1"
                      required
                      value={dishPrice}
                      onChange={(e) => setDishPrice(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Discount Price ($)</label>
                    <input
                      id="food-input-discount"
                      type="number"
                      step="0.1"
                      placeholder="Optional"
                      value={dishDiscountPrice || ''}
                      onChange={(e) => setDishDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-bold text-emerald-600"
                    />
                  </div>
                </div>

                {/* Calories & Cook Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      value={dishCalories}
                      onChange={(e) => setDishCalories(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Cook / Prep Time (Mins)</label>
                    <input
                      type="number"
                      value={dishPrepTime}
                      onChange={(e) => setDishPrepTime(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Image URL with 1-click Preset Selector */}
                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Dish Image URL *</label>
                  <input
                    id="food-input-image"
                    type="url"
                    required
                    value={dishImage}
                    onChange={(e) => setDishImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />

                  {/* 1-Click Preset Photo Chips */}
                  <div className="mt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                    <span className="text-[10px] text-[#8C847A] font-bold whitespace-nowrap">Presets:</span>
                    {PRESET_IMAGE_SUGGESTIONS.map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setDishImage(preset.url)}
                        className="px-2 py-0.5 bg-[#FAF7F2] hover:bg-[#EDE7DD] border border-[#EDE7DD] text-[10px] font-bold rounded-lg whitespace-nowrap transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Recipe Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={dishDescription}
                    onChange={(e) => setDishDescription(e.target.value)}
                    placeholder="Detail the ingredients, texture, flavor profile and artisan methods..."
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>

                {/* Custom Add-ons Manager */}
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE7DD] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2C2724]">Customizable Add-ons & Sides</span>
                    <span className="text-[10px] text-[#8C847A]">{dishAddons.length} added</span>
                  </div>

                  {dishAddons.length > 0 && (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {dishAddons.map(addon => (
                        <div key={addon.id} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl text-xs border border-[#EDE7DD]">
                          <span className="font-semibold text-[#2C2724]">{addon.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#E85B43]">+${addon.price.toFixed(2)}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAddon(addon.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new addon inputs */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add-on (e.g. Extra Truffle Oil)"
                      value={newAddonName}
                      onChange={(e) => setNewAddonName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#EDE7DD] rounded-xl text-xs"
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="$1.50"
                      value={newAddonPrice}
                      onChange={(e) => setNewAddonPrice(Number(e.target.value))}
                      className="w-20 px-2 py-1.5 bg-white border border-[#EDE7DD] rounded-xl text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleAddAddon}
                      className="px-3 py-1.5 bg-[#2C2724] text-white text-xs font-bold rounded-xl hover:bg-black"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Dietary & Badge Toggles */}
                <div className="flex flex-wrap gap-4 pt-1 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsVegan}
                      onChange={(e) => setDishIsVegan(e.target.checked)}
                      className="accent-[#E85B43]"
                    />
                    <span className="font-bold text-emerald-700">🌱 Vegan</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsGlutenFree}
                      onChange={(e) => setDishIsGlutenFree(e.target.checked)}
                      className="accent-[#E85B43]"
                    />
                    <span className="font-bold text-amber-700">🌾 Gluten-Free</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsSpicy}
                      onChange={(e) => setDishIsSpicy(e.target.checked)}
                      className="accent-[#E85B43]"
                    />
                    <span className="font-bold text-red-700">🌶️ Spicy</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsBestSeller}
                      onChange={(e) => setDishIsBestSeller(e.target.checked)}
                      className="accent-[#E85B43]"
                    />
                    <span className="font-bold text-[#E85B43]">★ Best Seller</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-700 ml-auto">
                    <input
                      type="checkbox"
                      checked={dishInStock}
                      onChange={(e) => setDishInStock(e.target.checked)}
                      className="accent-emerald-600"
                    />
                    <span>✓ In Stock</span>
                  </label>
                </div>

                {/* Submit & Cancel */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE7DD]">
                  <button
                    type="button"
                    onClick={() => setIsFoodModalOpen(false)}
                    className="px-5 py-2.5 bg-[#FAF7F2] text-xs font-bold text-[#6B655F] rounded-full hover:bg-[#EDE7DD]"
                  >
                    Cancel
                  </button>
                  <button
                    id="admin-submit-dish-form"
                    type="submit"
                    className="px-6 py-2.5 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730] transition-colors shadow-md"
                  >
                    {editingItem ? 'Save Updates' : 'Publish Dish to Menu'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: CONFIRM SINGLE DISH DELETION (Custom safety modal) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isDeleteModalOpen && itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-red-100 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-black text-[#2C2724] font-display">
                Delete "{itemToDelete.name}"?
              </h3>
              <p className="text-xs text-[#78716A] mt-1.5 max-w-xs mx-auto">
                This will permanently remove this dish from the active customer menu. You can re-add it or reset defaults anytime.
              </p>

              {/* Item preview snippet */}
              <div className="my-4 p-3 bg-[#FAF7F2] rounded-2xl flex items-center gap-3 text-left">
                <img
                  src={itemToDelete.image}
                  alt={itemToDelete.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <p className="font-bold text-xs text-[#2C2724]">{itemToDelete.name}</p>
                  <p className="text-[10px] text-[#8C847A]">{itemToDelete.category} • ${itemToDelete.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-5">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#EDE7DD] text-[#6B655F] text-xs font-bold rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="admin-confirm-delete-button"
                  onClick={handleConfirmDelete}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full transition-colors shadow-md shadow-red-600/30"
                >
                  Confirm Delete Dish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: BULK DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isBulkDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-red-100 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-black text-[#2C2724] font-display">
                Delete {selectedItemIds.length} Dishes?
              </h3>
              <p className="text-xs text-[#78716A] mt-1.5 max-w-xs mx-auto">
                Are you sure you want to remove all {selectedItemIds.length} selected dishes from the menu catalog?
              </p>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setIsBulkDeleteModalOpen(false)}
                  className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#EDE7DD] text-[#6B655F] text-xs font-bold rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full shadow-md shadow-red-600/30"
                >
                  Delete {selectedItemIds.length} Dishes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 4: RESET CATALOG CONFIRMATION */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isResetCatalogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-[#EDE7DD] text-center"
            >
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-black text-[#2C2724] font-display">
                Reset Catalog to Factory Defaults?
              </h3>
              <p className="text-xs text-[#78716A] mt-1.5 max-w-xs mx-auto">
                This will restore all initial gourmet dishes (Signature Salads, Truffle Burgers, Artisan Pizzas, Handmade Pastas, Shakes & Desserts).
              </p>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setIsResetCatalogModalOpen(false)}
                  className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#EDE7DD] text-[#6B655F] text-xs font-bold rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetMenuToDefault();
                    setIsResetCatalogModalOpen(false);
                  }}
                  className="px-6 py-2.5 bg-[#2C2724] hover:bg-black text-white text-xs font-bold rounded-full shadow-md"
                >
                  Reset Catalog
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 5: CREATE PROMO VOUCHER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPromoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EDE7DD] relative"
            >
              <button
                onClick={() => setIsPromoModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EDE7DD] flex items-center justify-center text-[#2C2724]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-black uppercase text-[#E85B43] tracking-wider">
                  MARKETING DISCOUNT
                </span>
                <h3 className="text-xl font-black text-[#2C2724] font-display">
                  Create New Promo Voucher
                </h3>
              </div>

              <form onSubmit={handleCreatePromo} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMER25"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-mono font-black tracking-wider"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Type</label>
                    <select
                      value={newPromoDiscountType}
                      onChange={(e) => setNewPromoDiscountType(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-bold"
                    >
                      <option value="percentage">% Percentage Off</option>
                      <option value="fixed">$ Flat Fixed Off</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Discount Value</label>
                    <input
                      type="number"
                      required
                      value={newPromoDiscountValue}
                      onChange={(e) => setNewPromoDiscountValue(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Minimum Order ($)</label>
                  <input
                    type="number"
                    value={newPromoMinOrder}
                    onChange={(e) => setNewPromoMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Description</label>
                  <input
                    type="text"
                    value={newPromoDescription}
                    onChange={(e) => setNewPromoDescription(e.target.value)}
                    placeholder="e.g. 25% discount on all orders above $30"
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPromoFreeShipping}
                    onChange={(e) => setNewPromoFreeShipping(e.target.checked)}
                    className="accent-[#E85B43]"
                  />
                  <span>Includes Free Delivery</span>
                </label>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE7DD]">
                  <button
                    type="button"
                    onClick={() => setIsPromoModalOpen(false)}
                    className="px-5 py-2.5 bg-[#FAF7F2] text-xs font-bold text-[#6B655F] rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730]"
                  >
                    Publish Voucher
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 6: DELETE ORDER CONFIRMATION */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {orderToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-red-100 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-black text-[#2C2724] font-display">
                Delete Order #{orderToDelete.orderNumber}?
              </h3>
              <p className="text-xs text-[#78716A] mt-1.5 max-w-xs mx-auto">
                Are you sure you want to delete this order from the dispatch queue? This will remove all associated telemetry logs.
              </p>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setOrderToDelete(null)}
                  className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#EDE7DD] text-[#6B655F] text-xs font-bold rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteOrder(orderToDelete.id);
                    setOrderToDelete(null);
                  }}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full"
                >
                  Delete Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
