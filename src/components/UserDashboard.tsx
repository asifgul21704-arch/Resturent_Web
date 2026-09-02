import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, MapPin, Clock, Heart, ShieldCheck, Plus, Trash2, Edit3, FileText, Navigation, Check, Sparkles, LogOut, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { UserAddress, Order } from '../types';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    orders,
    favorites,
    foodItems,
    addToCart,
    setTrackingModalOrder,
    setInvoiceModalOrder,
    setCurrentView,
    logoutUser,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'favorites'>('orders');

  // Profile Form state
  const [name, setName] = useState(currentUser?.name || 'Sarah Mitchell');
  const [email, setEmail] = useState(currentUser?.email || 'sarah.mitchell@example.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-8971');
  const [avatar, setAvatar] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80');
  const [dietPreferences, setDietPreferences] = useState<string[]>(currentUser?.dietaryPreferences || ['Vegetarian']);

  // New Address Form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Office');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Rome');
  const [newAddrZip, setNewAddrZip] = useState('00100');

  const userOrders = orders.filter(o => o.userId === currentUser?.id || o.customerId === currentUser?.id || o.customerEmail === currentUser?.email);
  const favoriteItems = foodItems.filter(f => favorites.includes(f.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      avatar,
      dietaryPreferences: dietPreferences
    });
    showToast('Profile updated successfully!', 'success');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) return;

    const newAddress: UserAddress = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      street: newAddrStreet,
      city: newAddrCity,
      zipCode: newAddrZip,
      isDefault: currentUser?.addresses.length === 0
    };

    const updatedAddresses = [...(currentUser?.addresses || []), newAddress];
    updateUserProfile({ addresses: updatedAddresses });
    setIsAddingAddress(false);
    setNewAddrStreet('');
    showToast('Address added to your account!', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = currentUser?.addresses.filter(a => a.id !== id) || [];
    updateUserProfile({ addresses: updated });
    showToast('Address removed', 'info');
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* User Dashboard Header Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#EDE7DD] shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={currentUser?.avatar || avatar}
              alt={currentUser?.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#FAF7F2] shadow-md"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-600" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#2C2724] font-display">
                {currentUser?.name || 'Sarah Mitchell'}
              </h1>
              <span className="px-3 py-0.5 bg-orange-100 text-[#E85B43] text-xs font-bold rounded-full">
                Verified Member
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#78716A] mt-1">
              {currentUser?.email} • {currentUser?.phone}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-[#8C847A]">
              <span>🛒 {userOrders.length} Total Orders</span>
              <span>•</span>
              <span>❤️ {favorites.length} Saved Favorites</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('menu')}
            className="px-5 py-2.5 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730] shadow-md shadow-[#E85B43]/20 transition-all flex items-center gap-1.5"
          >
            <span>Order New Food</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={logoutUser}
            className="px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] text-xs font-bold text-[#2C2724] hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-full transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#EDE7DD] pb-4 mb-8 overflow-x-auto scrollbar-none">
        {[
          { id: 'orders', label: 'My Orders & Tracking', count: userOrders.length },
          { id: 'profile', label: 'Account Profile Settings' },
          { id: 'addresses', label: 'Saved Delivery Addresses', count: currentUser?.addresses.length },
          { id: 'favorites', label: 'Wishlist & Favorites', count: favorites.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#2C2724] text-white shadow-md'
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

      {/* Tab 1: Orders & Live GPS Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {userOrders.length > 0 ? (
            userOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EAE1]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-black text-[#2C2724]">
                        #{order.id}
                      </span>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'on_the_way'
                          ? 'bg-orange-100 text-orange-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716A] mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Live GPS Tracker button */}
                    <button
                      onClick={() => setTrackingModalOrder(order)}
                      className="px-4 py-2 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730] flex items-center gap-1.5 shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Track Live on Map</span>
                    </button>

                    {/* View PDF Invoice button */}
                    <button
                      onClick={() => setInvoiceModalOrder(order)}
                      className="px-4 py-2 bg-[#FAF7F2] border border-[#EDE7DD] text-xs font-bold text-[#2C2724] hover:bg-[#F0EAE1] rounded-full flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#E85B43]" />
                      <span>PDF Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DD]">
                      <img
                        src={item.foodItem.image}
                        alt={item.foodItem.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#2C2724] truncate">
                          {item.quantity}x {item.foodItem.name}
                        </p>
                        <p className="text-[11px] font-black text-[#E85B43]">
                          ${((item.foodItem.discountPrice || item.foodItem.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer recap */}
                <div className="flex items-center justify-between text-xs pt-2 text-[#78716A]">
                  <span>Delivery to: <strong>{order.deliveryAddress.street}, {order.deliveryAddress.city}</strong></span>
                  <span className="text-sm font-black text-[#2C2724]">Total: ${(order.total || order.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#EDE7DD] p-8 space-y-3">
              <p className="text-4xl">📦</p>
              <h3 className="text-base font-bold text-[#2C2724]">No orders placed yet</h3>
              <p className="text-xs text-[#78716A] max-w-sm mx-auto">
                Explore our signature salads, burgers, and sourdough pizzas to place your first order!
              </p>
              <button
                onClick={() => setCurrentView('menu')}
                className="px-6 py-2.5 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730]"
              >
                Browse Menu
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE7DD] shadow-sm max-w-2xl">
          <h3 className="text-lg font-black text-[#2C2724] font-display mb-6">
            Update Personal Profile Information
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                />
              </div>
            </div>

            {/* Dietary preferences */}
            <div>
              <label className="text-xs font-bold text-[#57514B] block mb-2">Dietary Preferences</label>
              <div className="flex flex-wrap gap-2">
                {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Keto'].map(diet => {
                  const isSelected = dietPreferences.includes(diet);
                  return (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setDietPreferences(dietPreferences.filter(d => d !== diet));
                        } else {
                          setDietPreferences([...dietPreferences, diet]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                        isSelected
                          ? 'bg-[#E85B43] text-white border-[#E85B43]'
                          : 'bg-[#FAF7F2] text-[#6B655F] border-[#EDE7DD]'
                      }`}
                    >
                      {diet} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730] shadow-md shadow-[#E85B43]/20"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-[#2C2724] font-display">
              Delivery Addresses
            </h3>
            <button
              onClick={() => setIsAddingAddress(true)}
              className="px-4 py-2 bg-[#2C2724] text-white text-xs font-bold rounded-full hover:bg-black flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Add Address Form Modal / Box */}
          {isAddingAddress && (
            <form onSubmit={handleAddAddress} className="bg-white rounded-3xl p-6 border-2 border-[#E85B43] space-y-4">
              <h4 className="text-sm font-bold text-[#2C2724]">New Delivery Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Label (e.g. Home, Office)</label>
                  <input
                    type="text"
                    required
                    value={newAddrLabel}
                    onChange={(e) => setNewAddrLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100 Broadway Ave, Apt 12"
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Zip Code</label>
                  <input
                    type="text"
                    required
                    value={newAddrZip}
                    onChange={(e) => setNewAddrZip(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-4 py-2 bg-[#FAF7F2] text-xs font-bold text-[#6B655F] rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E85B43] text-white text-xs font-bold rounded-full"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser?.addresses.map(addr => (
              <div
                key={addr.id}
                className="bg-white rounded-3xl p-5 border border-[#EDE7DD] shadow-sm flex items-start justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] text-[#E85B43] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#2C2724]">{addr.label}</h4>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B655F] mt-1">{addr.street}</p>
                    <p className="text-xs text-[#78716A]">{addr.city}, {addr.zipCode}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-2 text-[#A0988E] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <h3 className="text-lg font-black text-[#2C2724] font-display">
            Your Saved Wishlist Dishes ({favoriteItems.length})
          </h3>

          {favoriteItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-4 border border-[#EDE7DD] shadow-sm flex flex-col justify-between"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-[4/3] rounded-2xl object-cover mb-3"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#2C2724] truncate">{item.name}</h4>
                    <p className="text-xs font-black text-[#E85B43] mt-1">
                      ${(item.discountPrice || item.price).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(item, 1)}
                    className="w-full mt-3 py-2 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730]"
                  >
                    + Add to Cart
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#EDE7DD] p-8">
              <p className="text-3xl mb-2">❤️</p>
              <h3 className="text-base font-bold text-[#2C2724]">No favorites saved yet</h3>
              <p className="text-xs text-[#78716A] mt-1">
                Click the heart icon on any salad, burger, or pizza card to save it here!
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
