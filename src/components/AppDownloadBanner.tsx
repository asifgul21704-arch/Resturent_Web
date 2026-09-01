import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Download, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const AppDownloadBanner: React.FC = () => {
  const { showToast } = useApp();

  const handleAppDownload = (store: string) => {
    showToast(`Downloading Foody app from ${store}... Use code FOODY20 for 20% off!`, 'success');
  };

  return (
    <section className="py-14 sm:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#FFF5EC] via-[#FFEFE4] to-[#FFF9F3] rounded-[40px] p-8 sm:p-12 lg:p-16 border border-[#F5E2D2] shadow-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column matching screenshot */}
            <div className="lg:col-span-6 space-y-6">
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#FA9538] tracking-tight font-display leading-[1.08]">
                Get 20% Discount
              </h2>

              <p className="text-base sm:text-xl font-bold text-[#2C2724] max-w-md leading-snug">
                Get flat 20% off on your first order though The Foodmood App!
              </p>

              {/* App Store / Google Play Buttons matching screenshot */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                
                {/* Google Play Button */}
                <button
                  onClick={() => handleAppDownload('Google Play')}
                  className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-3 hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  {/* Google Play vector */}
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186a2.03 2.03 0 0 1-.61-1.464V3.278c0-.575.228-1.1.61-1.464zm11.602 11.602l2.368-2.368-2.368-2.368 2.052-1.185 3.327 1.921c.88.508.88 1.946 0 2.454l-3.327 1.921-2.052-1.185v.001zm-1.418-1.416L5.051 3.258l9.742 5.626-1 3.116zm0 2.001l1 3.115-9.742 5.626 8.742-8.741z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-semibold text-neutral-400 leading-none">GET IT ON</p>
                    <p className="text-sm font-black leading-tight">Google Play</p>
                  </div>
                </button>

                {/* App Store Button */}
                <button
                  onClick={() => handleAppDownload('Apple App Store')}
                  className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-3 hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  {/* Apple logo vector */}
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.64-.78 1.08-1.86.96-2.94-1 .04-2.2 1.05-2.83 1.83-.56.66-1.04 1.76-.92 2.8 1.11.09 2.15-.91 2.79-1.69z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-semibold text-neutral-400 leading-none">Download on the</p>
                    <p className="text-sm font-black leading-tight">App Store</p>
                  </div>
                </button>

              </div>

              {/* Extra Perks */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#78716A]">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Live GPS Tracking
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Instant Re-order
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Exclusive Coupons
                </span>
              </div>
            </div>

            {/* Right Column: Burger graphic & Smartphone Mockup matching screenshot */}
            <div className="lg:col-span-6 flex items-center justify-center relative">
              
              {/* Stacked Delicious Burger Graphic */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:block absolute -left-10 bottom-4 w-44 h-44 z-20"
              >
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
                  alt="Delicious Double Burger"
                  className="w-full h-full object-contain drop-shadow-2xl rounded-3xl"
                />
              </motion.div>

              {/* 3D Mobile Phone Frame displaying Foody App mockup */}
              <div className="w-[260px] sm:w-[300px] h-[520px] bg-neutral-900 rounded-[44px] p-3 shadow-2xl border-4 border-neutral-800 relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Speaker pill notch */}
                <div className="w-24 h-4 bg-neutral-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-8 h-1.5 bg-neutral-700 rounded-full" />
                </div>

                {/* Inner Screen Mockup */}
                <div className="w-full h-[calc(100%-24px)] bg-[#FFFDF9] rounded-[34px] overflow-hidden p-3 flex flex-col justify-between text-[#2C2724] border border-[#EDE7DD]">
                  
                  {/* Phone Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#F5EFE6]">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-[#E85B43] flex items-center justify-center text-white text-[9px] font-bold">
                        🍔
                      </div>
                      <span className="text-xs font-black text-[#E85B43]">Foody</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      20% Active
                    </span>
                  </div>

                  {/* Phone Mini Hero */}
                  <div className="py-2 text-left">
                    <p className="text-[11px] font-black leading-tight">
                      Healthy <span className="text-[#E85B43]">Eating</span> is Important
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      <div className="bg-[#F36B5E] text-white p-2 rounded-xl text-center">
                        <p className="text-[9px] font-bold">Berries Salad</p>
                        <p className="text-[11px] font-black">$5.00</p>
                      </div>
                      <div className="bg-[#FA9538] text-white p-2 rounded-xl text-center">
                        <p className="text-[9px] font-bold">Healthy Salad</p>
                        <p className="text-[11px] font-black">$3.00</p>
                      </div>
                    </div>
                  </div>

                  {/* Phone Mini Map Track */}
                  <div className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#EDE7DD]">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-[#2C2724]">Live Courier</span>
                      <span className="text-[#E85B43] font-bold">12 Mins ETA</span>
                    </div>
                    <div className="w-full bg-[#EAE3D5] h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-[#E85B43] h-full w-2/3 animate-pulse" />
                    </div>
                  </div>

                  {/* Bottom order button in phone */}
                  <button className="w-full py-2 bg-[#E85B43] text-white text-xs font-bold rounded-xl shadow-md">
                    Order with 20% OFF
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
