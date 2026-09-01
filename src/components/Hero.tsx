import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, ShoppingBag, Play, X, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  const { setCurrentView, addToCart, foodItems, setSelectedFoodDetail } = useApp();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Quick action for featured salad
  const featuredSalad = foodItems.find(item => item.id === 'salad-1') || foodItems[0];

  return (
    <section className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      {/* Subtle warm background glow */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#FFEBD8]/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#FDF0EC]/60 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs matching screenshot */}
          <div className="lg:col-span-6 space-y-7 sm:space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black leading-[1.08] tracking-tight text-[#2C2724] font-display">
              Healthy <span className="text-[#E85B43]">Eating</span> is an{' '}
              <span className="font-serif-title italic font-normal text-[#2C2724]">Important</span>{' '}
              Part of <span className="text-[#E85B43]">Lifestyle</span>
            </h1>

            <p className="text-lg text-[#6B655F] max-w-lg leading-relaxed font-normal">
              We prepare delicious Food<br />
              For you we are always
            </p>

            {/* CTAs matching screenshot */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <button
                id="hero-explore-btn"
                onClick={() => setCurrentView('menu')}
                className="px-8 py-4 rounded-full bg-[#E85B43] text-white font-bold text-base hover:bg-[#D44730] hover:shadow-lg hover:shadow-[#E85B43]/30 active:scale-95 transition-all flex items-center gap-2 group"
              >
                <span>Explore New</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Play video button matching screenshot */}
              <button
                id="hero-play-video-btn"
                onClick={() => setIsVideoModalOpen(true)}
                className="group flex items-center gap-3 p-1 text-[#2C2724] font-bold text-sm focus:outline-none"
                title="Watch Chef's Story"
              >
                <div className="w-13 h-13 rounded-full bg-black text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform relative">
                  <span className="absolute inset-0 rounded-full bg-black/20 animate-ping opacity-75 pointer-events-none" />
                  <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                </div>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#8C847A]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>100% Fresh Daily Ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E85B43]" />
                <span>Average 24 min delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Bowl & Floating Badges matching screenshot */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            
            {/* Center Main Salad Plate Visual */}
            <div className="relative w-[320px] sm:w-[420px] md:w-[460px] aspect-square flex items-center justify-center">
              
              {/* Outer circular soft decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#EAE3D5] animate-spin-slow opacity-60" />
              
              {/* High-res fresh salad plate image */}
              <div 
                onClick={() => setSelectedFoodDetail(featuredSalad)}
                className="relative w-[85%] h-[85%] rounded-full overflow-hidden shadow-2xl shadow-black/15 border-4 border-white cursor-pointer group hover:scale-[1.02] transition-transform"
              >
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=85"
                  alt="Delicious Healthy Salad Bowl"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Subtle overlay button */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-[#E85B43] shadow-md">
                    Quick View Dish
                  </span>
                </div>
              </div>

              {/* Top Right Floating Badge: 20% Off in Lime Green matching screenshot */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#9CE635] text-[#1E3A08] flex flex-col items-center justify-center shadow-lg border-2 border-white select-none z-20 cursor-pointer hover:rotate-6 transition-transform"
                onClick={() => {
                  navigator.clipboard?.writeText('FOODY20');
                  alert('Promo code "FOODY20" copied to clipboard! Enjoy 20% off.');
                }}
                title="Click to copy code FOODY20"
              >
                <span className="text-base sm:text-xl font-black leading-none tracking-tight">20%</span>
                <span className="text-xs sm:text-sm font-extrabold uppercase leading-none">Off</span>
              </motion.div>

              {/* Floating Badge 1 (Top Left of bowl): Fast Delivery matching screenshot */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -top-4 -left-2 sm:top-2 sm:-left-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-[#F0EAE1] flex items-center gap-3 z-20 max-w-[210px] sm:max-w-[230px]"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#2C2724] shrink-0">
                  <Truck className="w-5 h-5 text-[#2C2724]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#2C2724] leading-tight">Fast Delivery</p>
                  <p className="text-[10px] text-[#78716A] leading-tight mt-0.5">
                    Promise To Deliver<br />Within 30 Mins
                  </p>
                </div>
              </motion.div>

              {/* Floating Badge 2 (Bottom Left of bowl): Pick Up matching screenshot */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-4 -left-2 sm:bottom-2 sm:-left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-[#F0EAE1] flex items-center gap-3 z-20 max-w-[210px] sm:max-w-[230px]"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#2C2724] shrink-0">
                  <ShoppingBag className="w-5 h-5 text-[#2C2724]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#2C2724] leading-tight">Pick Up</p>
                  <p className="text-[10px] text-[#78716A] leading-tight mt-0.5">
                    Pickup Delivery At<br />Your Doorstep
                  </p>
                </div>
              </motion.div>

            </div>

          </div>

        </div>
      </div>

      {/* Video / Culinary Story Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative"
          >
            <div className="p-4 bg-[#2C2724] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E85B43]" />
                <span className="font-bold text-sm">Behind the Scenes at Foody Kitchen</span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="aspect-video w-full rounded-2xl bg-neutral-900 overflow-hidden relative group flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                  alt="Foody Kitchen Craft"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white text-left">
                  <p className="text-xl font-bold font-display">Crafted With Organic Soul</p>
                  <p className="text-xs text-white/80 mt-1">
                    Watch how Chef Angelina and our culinary team source organic garden produce daily at dawn.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="text-xs text-[#78716A]">100% farm-to-table certified kitchens in Rome, Madrid & Paris</p>
                <button
                  onClick={() => {
                    setIsVideoModalOpen(false);
                    setCurrentView('menu');
                  }}
                  className="px-5 py-2.5 bg-[#E85B43] text-white rounded-full text-xs font-bold hover:bg-[#D44730]"
                >
                  Order Fresh Now →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
};
