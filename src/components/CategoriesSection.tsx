import React from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, Bike, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const CategoriesSection: React.FC = () => {
  const { setCurrentView, setSelectedCategory, foodItems, setSelectedFoodDetail } = useApp();

  const burgerItem = foodItems.find(i => i.id === 'burger-1') || foodItems[4];
  const dessertItem = foodItems.find(i => i.id === 'dessert-1') || foodItems[10];
  const snackItem = foodItems.find(i => i.id === 'dessert-2') || foodItems[11];

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Visual Promo Grid matching screenshot */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Big Yellow Promo Card: TASTY BURGER NEW! */}
            <div 
              onClick={() => {
                setSelectedCategory('Burgers');
                setCurrentView('menu');
              }}
              className="sm:row-span-2 bg-[#FAC539] rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between min-h-[380px] sm:min-h-[440px] shadow-xl shadow-amber-500/15 cursor-pointer group hover:shadow-2xl transition-all"
            >
              {/* Typography overlay matching screenshot */}
              <div className="text-center z-10">
                <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider drop-shadow-sm font-display">
                  TASTY<br />BURGER
                </h3>
                <span className="inline-block mt-1 px-3 py-0.5 bg-white text-[#2C2724] text-xs font-black rounded-full uppercase tracking-widest shadow-sm">
                  NEW!
                </span>
              </div>

              {/* Hands holding burger image matching screenshot */}
              <div className="relative w-full flex items-center justify-center mt-4">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
                  alt="Tasty Fresh Burger"
                  className="w-56 sm:w-64 h-56 sm:h-64 object-cover rounded-2xl shadow-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="z-10 flex justify-center">
                <span className="text-xs font-bold text-neutral-800 bg-white/90 px-4 py-1.5 rounded-full shadow-sm group-hover:bg-white transition-colors">
                  Explore Burgers →
                </span>
              </div>
            </div>

            {/* Top Right Card: Waffles & Ice Cream */}
            <div 
              onClick={() => {
                setSelectedCategory('Desserts');
                setCurrentView('menu');
              }}
              className="bg-[#FAF7F2] rounded-3xl overflow-hidden relative min-h-[190px] shadow-md border border-[#EDE7DD] cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=500&q=80"
                alt="Sweet Belgian Waffles"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Belgian Desserts & Shakes
                </span>
              </div>
            </div>

            {/* Bottom Right Card: Crispy balls with ORDER NOW overlay */}
            <div 
              onClick={() => {
                setSelectedCategory('Healthy');
                setCurrentView('menu');
              }}
              className="bg-[#FAF7F2] rounded-3xl overflow-hidden relative min-h-[190px] shadow-md border border-[#EDE7DD] cursor-pointer group flex items-center justify-center"
            >
              <img
                src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=500&q=80"
                alt="Crispy Falafel Balls"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-lg sm:text-xl font-black text-white tracking-wider uppercase border-2 border-white px-5 py-2 rounded-xl backdrop-blur-xs group-hover:scale-105 transition-transform">
                  ORDER NOW
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Our Categories List matching screenshot */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C2724] tracking-tight font-display">
                Our Categories
              </h2>
              <div className="w-16 h-1 bg-[#E85B43] rounded-full mt-2" />
            </div>

            {/* 3 Categories Rows with round color badges matching screenshot */}
            <div className="space-y-6">
              
              {/* Row 1: Orange badge (Food / Burger) */}
              <div 
                onClick={() => {
                  setSelectedCategory('Burgers');
                  setCurrentView('menu');
                }}
                className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-black/5 border border-transparent hover:border-[#EDE7DD] cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-[#FA9538] flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Utensils className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-[#2C2724] group-hover:text-[#E85B43] transition-colors font-display">
                    Grab Your Delicious Food
                  </h4>
                  <p className="text-xs text-[#78716A] leading-relaxed mt-0.5">
                    We prepare delicious Food<br />For you we are always
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C847A] group-hover:text-[#E85B43] group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
              </div>

              {/* Row 2: Blue / Purple badge (Fast Delivery) */}
              <div 
                onClick={() => {
                  setSelectedCategory('Pizza');
                  setCurrentView('menu');
                }}
                className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-black/5 border border-transparent hover:border-[#EDE7DD] cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-[#6B77EE] flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Bike className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-[#2C2724] group-hover:text-[#E85B43] transition-colors font-display">
                    Grab Your Delicious Food
                  </h4>
                  <p className="text-xs text-[#78716A] leading-relaxed mt-0.5">
                    We prepare delicious Food<br />For you we are always
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C847A] group-hover:text-[#E85B43] group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
              </div>

              {/* Row 3: Green badge (Organic & Fresh) */}
              <div 
                onClick={() => {
                  setSelectedCategory('Salads');
                  setCurrentView('menu');
                }}
                className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-black/5 border border-transparent hover:border-[#EDE7DD] cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-[#4CD263] flex items-center justify-center text-white shrink-0 shadow-md shadow-green-500/20 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-[#2C2724] group-hover:text-[#E85B43] transition-colors font-display">
                    Grab Your Delicious Food
                  </h4>
                  <p className="text-xs text-[#78716A] leading-relaxed mt-0.5">
                    We prepare delicious Food<br />For you we are always
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C847A] group-hover:text-[#E85B43] group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
