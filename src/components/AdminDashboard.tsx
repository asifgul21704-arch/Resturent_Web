import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Edit, Check, X, TrendingUp, DollarSign, ShoppingCart, Bike, Sparkles, Filter, Search, ArrowUpRight, ShieldCheck, RefreshCw, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem, Order } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    foodItems,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    orders,
    advanceOrderStatus,
    setInvoiceModalOrder,
    setTrackingModalOrder,
    currentUser,
    updateUserProfile,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'menu_crud' | 'orders_dispatch' | 'settings'>('analytics');
  const [menuSearch, setMenuSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Add/Edit Food Item Modal
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Food Form state
  const [dishName, setDishName] = useState('');
  const [dishCategory, setDishCategory] = useState<'Salads' | 'Burgers' | 'Pizza' | 'Pasta' | 'Shakes' | 'Desserts' | 'Healthy' | 'Drinks'>('Salads');
  const [dishPrice, setDishPrice] = useState<number>(5.00);
  const [dishDiscountPrice, setDishDiscountPrice] = useState<number | undefined>(undefined);
  const [dishDescription, setDishDescription] = useState('');
  const [dishImage, setDishImage] = useState('');
  const [dishCalories, setDishCalories] = useState<number>(320);
  const [dishPrepTime, setDishPrepTime] = useState<number>(15);
  const [dishIsVegan, setDishIsVegan] = useState(false);
  const [dishIsGlutenFree, setDishIsGlutenFree] = useState(false);
  const [dishIsSpicy, setDishIsSpicy] = useState(false);
  const [dishIsBestSeller, setDishIsBestSeller] = useState(false);
  const [dishInStock, setDishInStock] = useState(true);

  // Store Settings state
  const [adminName, setAdminName] = useState(currentUser?.name || 'Chef Alessandro');
  const [adminEmail, setAdminEmail] = useState(currentUser?.email || 'admin@foody.kitchen');
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const activeDeliveriesCount = orders.filter(o => o.status === 'on_the_way' || o.status === 'preparing').length;

  const openAddModal = () => {
    setEditingItem(null);
    setDishName('');
    setDishCategory('Salads');
    setDishPrice(5.00);
    setDishDiscountPrice(undefined);
    setDishDescription('Prepared fresh daily with garden greens and balsamic vinaigrette.');
    setDishImage('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
    setDishCalories(340);
    setDishPrepTime(15);
    setDishIsVegan(true);
    setDishIsGlutenFree(false);
    setDishIsSpicy(false);
    setDishIsBestSeller(false);
    setDishInStock(true);
    setIsFoodModalOpen(true);
  };

  const openEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setDishName(item.name);
    setDishCategory(item.category as any);
    setDishPrice(item.price);
    setDishDiscountPrice(item.discountPrice);
    setDishDescription(item.description);
    setDishImage(item.image);
    setDishCalories(item.calories);
    setDishPrepTime(item.prepTimeMinutes);
    setDishIsVegan(item.isVegan);
    setDishIsGlutenFree(item.isGlutenFree);
    setDishIsSpicy(item.isSpicy);
    setDishIsBestSeller(item.isBestSeller);
    setDishInStock(item.inStock);
    setIsFoodModalOpen(true);
  };

  const handleSaveFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    if (editingItem) {
      updateFoodItem(editingItem.id, {
        name: dishName,
        category: dishCategory,
        price: Number(dishPrice),
        discountPrice: dishDiscountPrice ? Number(dishDiscountPrice) : undefined,
        description: dishDescription,
        image: dishImage,
        calories: Number(dishCalories),
        prepTimeMinutes: Number(dishPrepTime),
        isVegan: dishIsVegan,
        isGlutenFree: dishIsGlutenFree,
        isSpicy: dishIsSpicy,
        isBestSeller: dishIsBestSeller,
        inStock: dishInStock
      });
      showToast(`Updated "${dishName}" successfully!`, 'success');
    } else {
      addFoodItem({
        name: dishName,
        category: dishCategory,
        price: Number(dishPrice),
        discountPrice: dishDiscountPrice ? Number(dishDiscountPrice) : undefined,
        description: dishDescription,
        image: dishImage,
        rating: 5.0,
        reviewCount: 1,
        calories: Number(dishCalories),
        prepTimeMinutes: Number(dishPrepTime),
        isVegan: dishIsVegan,
        isGlutenFree: dishIsGlutenFree,
        isSpicy: dishIsSpicy,
        isBestSeller: dishIsBestSeller,
        inStock: dishInStock,
        tags: [dishCategory.toLowerCase(), 'fresh', 'organic']
      });
      showToast(`Added new dish "${dishName}" to menu!`, 'success');
    }
    setIsFoodModalOpen(false);
  };

  const filteredMenuItems = foodItems.filter(item => {
    if (filterCategory !== 'All' && item.category !== filterCategory) return false;
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Admin Top Banner */}
      <div className="bg-[#2C2724] text-white rounded-[32px] p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 bg-[#E85B43] text-white text-xs font-black rounded-full uppercase tracking-wider">
              ADMIN CONTROL CENTER
            </span>
            <span className="text-xs text-neutral-400">Rome Central HQ</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display mt-2">
            Store & Kitchen Dispatch Manager
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1">
            Real-time live orders dispatching, kitchen inventory CRUD, and GPS courier management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl">
            <span className={`w-3 h-3 rounded-full ${isKitchenOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-xs font-bold">{isKitchenOpen ? 'Kitchen Accepting Orders' : 'Kitchen Paused'}</span>
          </div>
          <button
            onClick={() => setIsKitchenOpen(!isKitchenOpen)}
            className="px-4 py-2 bg-white text-[#2C2724] rounded-2xl text-xs font-bold hover:bg-[#FAF7F2]"
          >
            Toggle Status
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#EDE7DD] pb-4 mb-8 overflow-x-auto scrollbar-none">
        {[
          { id: 'analytics', label: '📊 Store Analytics & Revenue' },
          { id: 'orders_dispatch', label: '🛵 Live Dispatch & Tracking', count: orders.length },
          { id: 'menu_crud', label: '🥗 Food Menu Inventory (CRUD)', count: foodItems.length },
          { id: 'settings', label: '⚙️ Admin Profile & Settings' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#E85B43] text-white shadow-md shadow-[#E85B43]/25'
                : 'bg-white border border-[#EDE7DD] text-[#6B655F] hover:bg-[#FAF7F2]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-neutral-100 text-[#57514B]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Analytics & Metrics */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-sm">
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
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% this week
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-sm">
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
                Completed & in transit
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-sm">
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
                Healthy margin
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-sm">
              <div className="flex items-center justify-between text-[#8C847A] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Couriers</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Bike className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#2C2724] font-display">
                {activeDeliveriesCount} Active
              </p>
              <p className="text-xs text-purple-600 font-bold mt-1">
                Avg ETA: 22 mins
              </p>
            </div>
          </div>

          {/* Quick Dispatch Action Panel */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-sm space-y-4">
            <h3 className="text-base font-black text-[#2C2724] font-display">
              Recent Activity & Live Kitchen Pulse
            </h3>
            <div className="divide-y divide-[#F0EAE1]">
              {orders.slice(0, 4).map(o => (
                <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#2C2724]">#{o.id}</span>
                    <span className="text-[#78716A] ml-2">• {o.customerName} ordered {o.items.length} items</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-[#E85B43]">${(o.total || o.totalAmount || 0).toFixed(2)}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      {o.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders Dispatch & Status Sync */}
      {activeTab === 'orders_dispatch' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-[#2C2724] font-display">
                Live Kitchen Dispatch Table ({orders.length})
              </h3>
              <p className="text-xs text-[#78716A]">
                Advance order status to automatically update customers' live GPS navigation in real-time.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EDE7DD] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF7F2] border-b border-[#EDE7DD] text-[#2C2724] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Dishes</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Courier</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1]">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#2C2724]">
                        #{order.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#2C2724]">{order.customerName}</p>
                        <p className="text-[10px] text-[#78716A]">{order.deliveryAddress.city}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#2C2724]">{order.items.length} items</span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-[#2C2724]">
                        ${(order.total || order.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'on_the_way'
                            ? 'bg-orange-100 text-orange-800 animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#6B655F]">
                        {order.courier?.name || order.courierName || 'Marco Rossi'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => advanceOrderStatus(order.id)}
                            className="px-2.5 py-1 bg-[#2C2724] text-white rounded-lg text-[11px] font-bold hover:bg-black"
                            title="Advance to next status"
                          >
                            ⚡ Advance
                          </button>
                          <button
                            onClick={() => setTrackingModalOrder(order)}
                            className="p-1.5 bg-[#FAF7F2] text-[#E85B43] hover:bg-[#F0EAE1] rounded-lg"
                            title="Open Live GPS Map"
                          >
                            <Bike className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setInvoiceModalOrder(order)}
                            className="p-1.5 bg-[#FAF7F2] text-[#2C2724] hover:bg-[#F0EAE1] rounded-lg"
                            title="View PDF Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Food Menu Management (CRUD) */}
      {activeTab === 'menu_crud' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-[#2C2724] font-display">
                Food Menu & Inventory Management
              </h3>
              <p className="text-xs text-[#78716A]">
                Add, update, or remove dishes, adjust prices, and toggle in-stock availability.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730] flex items-center gap-1.5 shadow-md shadow-[#E85B43]/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-[#EDE7DD]">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-[#8C847A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dish name..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto">
              {['All', 'Salads', 'Burgers', 'Pizza', 'Pasta', 'Desserts', 'Healthy'].map(c => (
                <button
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    filterCategory === c ? 'bg-[#2C2724] text-white' : 'bg-[#FAF7F2] text-[#6B655F]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Dishes Table */}
          <div className="bg-white rounded-3xl border border-[#EDE7DD] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF7F2] border-b border-[#EDE7DD] text-[#2C2724] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Dish</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Diet / Calories</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1]">
                  {filteredMenuItems.map(item => (
                    <tr key={item.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#EDE7DD]"
                          />
                          <div>
                            <p className="font-bold text-[#2C2724] text-sm">{item.name}</p>
                            <p className="text-[10px] text-[#78716A] line-clamp-1 max-w-xs">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#2C2724]">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 font-black text-[#2C2724]">
                        ${item.price.toFixed(2)}
                        {item.discountPrice && (
                          <span className="block text-[10px] text-emerald-600 font-bold">
                            Sale: ${item.discountPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#6B655F]">
                        <p>{item.calories} kcal • {item.prepTimeMinutes}m</p>
                        <div className="flex gap-1 mt-0.5">
                          {item.isVegan && <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 rounded">Vegan</span>}
                          {item.isGlutenFree && <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 rounded">GF</span>}
                          {item.isSpicy && <span className="text-[9px] bg-red-100 text-red-800 px-1.5 rounded">🌶️</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => updateFoodItem(item.id, { inStock: !item.inStock })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-colors ${
                            item.inStock
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {item.inStock ? '✓ In Stock' : '✕ Sold Out'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg bg-[#FAF7F2] text-[#2C2724] hover:bg-[#EDE7DD]"
                            title="Edit dish"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                                deleteFoodItem(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                            title="Delete dish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Admin Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE7DD] shadow-sm max-w-2xl space-y-6">
          <h3 className="text-lg font-black text-[#2C2724] font-display">
            Admin Profile & Store Parameters
          </h3>

          <form onSubmit={(e) => {
            e.preventDefault();
            updateUserProfile({ name: adminName, email: adminEmail });
            showToast('Admin profile updated!', 'success');
          }} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#57514B] block mb-1">Admin Executive Name</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#57514B] block mb-1">Kitchen Dispatch Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730]"
            >
              Update Admin Details
            </button>
          </form>
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      <AnimatePresence>
        {isFoodModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#EDE7DD] relative my-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsFoodModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#2C2724]"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-xl font-black text-[#2C2724] font-display mb-4">
                {editingItem ? `Edit "${editingItem.name}"` : 'Add New Culinary Dish'}
              </h3>

              <form onSubmit={handleSaveFoodItem} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Avocado Crunch Salad"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Category</label>
                    <select
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
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={dishPrice}
                      onChange={(e) => setDishPrice(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Discount Price ($)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Optional"
                      value={dishDiscountPrice || ''}
                      onChange={(e) => setDishDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      value={dishCalories}
                      onChange={(e) => setDishCalories(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Cook Time (m)</label>
                    <input
                      type="number"
                      value={dishPrepTime}
                      onChange={(e) => setDishPrepTime(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={dishImage}
                    onChange={(e) => setDishImage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={dishDescription}
                    onChange={(e) => setDishDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>

                {/* Dietary toggles */}
                <div className="flex flex-wrap gap-4 pt-2 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsVegan}
                      onChange={(e) => setDishIsVegan(e.target.checked)}
                      className="accent-[#E85B43]"
                    />
                    <span>🌱 Vegan</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsGlutenFree}
                      onChange={(e) => setDishIsGlutenFree(e.target.checked)}
                      className="accent-[#E85B43]"
                    />
                    <span>🌾 Gluten-Free</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsSpicy}
                      onChange={(e) => setDishIsSpicy(e.target.checked)}
                      className="accent-[#E85B43]"
                    />
                    <span>🌶️ Spicy</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsBestSeller}
                      onChange={(e) => setDishIsBestSeller(e.target.checked)}
                      className="accent-[#E85B43]"
                    />
                    <span>★ Best Seller</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-700">
                    <input
                      type="checkbox"
                      checked={dishInStock}
                      onChange={(e) => setDishInStock(e.target.checked)}
                      className="accent-emerald-600"
                    />
                    <span>In Stock</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE7DD]">
                  <button
                    type="button"
                    onClick={() => setIsFoodModalOpen(false)}
                    className="px-5 py-2.5 bg-[#FAF7F2] text-xs font-bold text-[#6B655F] rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730]"
                  >
                    {editingItem ? 'Save Updates' : 'Publish Dish'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
