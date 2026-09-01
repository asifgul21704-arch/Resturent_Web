import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const PizzaDeliveryBanner: React.FC = () => {
  const { setCurrentView, setSelectedCategory } = useApp();

  return (
    <section className="py-12 sm:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Content matching screenshot */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Small Orange Tag */}
            <span className="text-xs font-black uppercase tracking-wider text-[#E85B43] bg-[#E85B43]/10 px-3 py-1 rounded-full inline-block">
              PIZZA DELIVERY
            </span>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2C2724] tracking-tight leading-tight font-display">
              Get Started Today!
            </h2>

            {/* Bold Subheading */}
            <p className="text-base sm:text-lg font-bold text-[#2C2724] leading-snug">
              Everything you need to build an amazing food restaurant responsive website.
            </p>

            {/* Latin body paragraph matching screenshot */}
            <p className="text-sm text-[#78716A] leading-relaxed max-w-xl">
              Hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis.
            </p>

            {/* 2 Feature Cards Row matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
              
              {/* Feature 1: Food Order with Money/Bag icon */}
              <div 
                onClick={() => {
                  setSelectedCategory('Pizza');
                  setCurrentView('menu');
                }}
                className="p-5 rounded-2xl bg-white border border-[#EAE3D5] shadow-sm hover:shadow-md hover:border-[#E85B43]/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {/* Bag / Money Icon */}
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-[#2C2724] group-hover:text-[#E85B43] transition-colors font-display">
                  Food Order
                </h4>
                <p className="text-xs text-[#78716A] leading-relaxed">
                  Food is the necessity of life. It provides nutrition, sustenance growth to human body.
                </p>
              </div>

              {/* Feature 2: Promote Restaurant with Chart/Growth icon */}
              <div 
                onClick={() => setCurrentView('services')}
                className="p-5 rounded-2xl bg-white border border-[#EAE3D5] shadow-sm hover:shadow-md hover:border-[#E85B43]/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#E85B43] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#2C2724] group-hover:text-[#E85B43] transition-colors font-display">
                  Promote Restaurant
                </h4>
                <p className="text-xs text-[#78716A] leading-relaxed">
                  Food can be classified into cereals, pulses, nuts and oilseeds, vegetable
                </p>
              </div>

            </div>

          </div>

          {/* Right Column: Girl Eating Pizza in Yellow Circular Cutout + French Fries Mascots matching screenshot */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Main Yellow Circle Background */}
            <div className="relative w-[300px] sm:w-[380px] md:w-[420px] aspect-square rounded-full bg-[#F6D55C] flex items-center justify-center overflow-visible shadow-xl">
              
              {/* Photo of woman eating slice of pizza */}
              <div className="w-[90%] h-[90%] rounded-full overflow-hidden relative shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=85"
                  alt="Enjoying Delicious Sourdough Pizza"
                  className="w-full h-full object-cover scale-110 object-top"
                />
              </div>

              {/* French Fries Mascot 1 (Top Right) */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -top-4 -right-2 sm:top-2 sm:right-2 w-14 h-14 rounded-2xl bg-white shadow-xl border border-[#EDE7DD] p-1.5 flex items-center justify-center z-20"
              >
                <span className="text-2xl select-none" title="Crispy Fries!">🍟</span>
              </motion.div>

              {/* Mascot 2 (Bottom Left) */}
              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute -bottom-2 -left-2 sm:bottom-6 sm:-left-4 w-12 h-12 rounded-2xl bg-white shadow-xl border border-[#EDE7DD] p-1.5 flex items-center justify-center z-20"
              >
                <span className="text-xl select-none" title="Hot Slice!">🍕</span>
              </motion.div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
