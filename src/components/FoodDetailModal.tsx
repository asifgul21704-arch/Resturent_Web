import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, Star, Flame, Clock, Plus, Minus, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { SelectedAddon } from '../types';

export const FoodDetailModal: React.FC = () => {
  const {
    selectedFoodDetail,
    setSelectedFoodDetail,
    addToCart,
    toggleFavorite,
    isFavorite
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!selectedFoodDetail) return null;

  const fav = isFavorite(selectedFoodDetail.id);
  const basePrice = selectedFoodDetail.discountPrice || selectedFoodDetail.price;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const calculatedTotal = (basePrice + addonsTotal) * quantity;

  const toggleAddon = (addon: { id: string; name: string; price: number }) => {
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(selectedFoodDetail, quantity, selectedAddons, specialInstructions);
    setSelectedFoodDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-[36px] max-w-xl w-full overflow-hidden shadow-2xl border border-[#EDE7DD] relative my-8"
      >
        
        {/* Close & Wishlist Top Actions */}
        <button
          onClick={() => setSelectedFoodDetail(null)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-[#2C2724] hover:bg-white hover:scale-110 active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <button
          onClick={() => toggleFavorite(selectedFoodDetail.id)}
          className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-[#2C2724] hover:bg-white hover:scale-110 active:scale-95 transition-all"
        >
          <Heart className={`w-5 h-5 ${fav ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`} />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-[16/10] w-full bg-[#FAF7F2] overflow-hidden">
          <img
            src={selectedFoodDetail.image}
            alt={selectedFoodDetail.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
            <span className="px-3 py-1 bg-[#E85B43] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
              {selectedFoodDetail.category}
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-7 space-y-5 max-h-[60vh] overflow-y-auto">
          
          {/* Title & Ratings */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-black text-[#2C2724] font-display">
                {selectedFoodDetail.name}
              </h2>
              <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{selectedFoodDetail.rating.toFixed(1)}</span>
                <span className="text-[10px] text-amber-700">({selectedFoodDetail.reviewCount})</span>
              </div>
            </div>

            {selectedFoodDetail.tagline && (
              <p className="text-xs font-semibold text-[#E85B43] mt-1">
                {selectedFoodDetail.tagline}
              </p>
            )}

            <p className="text-sm text-[#6B655F] leading-relaxed mt-2.5">
              {selectedFoodDetail.description}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-[#F0EAE1] text-center">
            <div className="p-2.5 bg-[#FAF7F2] rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-[#8C847A]">Energy</p>
              <p className="text-sm font-black text-[#2C2724] flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                {selectedFoodDetail.calories} kcal
              </p>
            </div>
            <div className="p-2.5 bg-[#FAF7F2] rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-[#8C847A]">Cook Time</p>
              <p className="text-sm font-black text-[#2C2724] flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {selectedFoodDetail.prepTimeMinutes} mins
              </p>
            </div>
            <div className="p-2.5 bg-[#FAF7F2] rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-[#8C847A]">Quality</p>
              <p className="text-sm font-black text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Fresh
              </p>
            </div>
          </div>

          {/* Add-ons Selector */}
          {selectedFoodDetail.availableAddons && selectedFoodDetail.availableAddons.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#2C2724] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E85B43]" />
                Customize Add-ons
              </h4>

              <div className="space-y-2">
                {selectedFoodDetail.availableAddons.map(addon => {
                  const isChecked = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#E85B43]/5 border-[#E85B43]'
                          : 'bg-[#FAF7F2] border-[#EFECE6] hover:border-[#E85B43]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isChecked ? 'bg-[#E85B43] border-[#E85B43] text-white' : 'border-neutral-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-bold text-[#2C2724]">{addon.name}</span>
                      </div>
                      <span className="text-xs font-black text-[#E85B43]">
                        +${addon.price.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#2C2724] block">
              Special Kitchen Notes / Allergies
            </label>
            <input
              type="text"
              placeholder="e.g. Extra dressing on side, no onions, gluten alert..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs text-[#2C2724] placeholder-[#A0988E] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
            />
          </div>

        </div>

        {/* Footer Actions: Quantity & Add to Cart */}
        <div className="p-5 sm:p-6 bg-[#FAF7F2] border-t border-[#F0EAE1] flex items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-full border border-[#EAE3D5] shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-full bg-[#FAF7F2] hover:bg-[#EAE3D5] flex items-center justify-center text-[#2C2724] disabled:opacity-40"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-black text-[#2C2724] w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-full bg-[#FAF7F2] hover:bg-[#EAE3D5] flex items-center justify-center text-[#2C2724]"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedFoodDetail.inStock}
            className={`flex-1 py-3.5 px-6 rounded-full font-black text-sm flex items-center justify-between shadow-lg active:scale-95 transition-all ${
              selectedFoodDetail.inStock
                ? 'bg-[#E85B43] text-white hover:bg-[#D44730] shadow-[#E85B43]/25'
                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <span>Add to Order</span>
            <span>${calculatedTotal.toFixed(2)}</span>
          </button>

        </div>

      </motion.div>
    </div>
  );
};
