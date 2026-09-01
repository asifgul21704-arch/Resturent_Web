import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA } from '../data/mockData';
import { motion } from 'motion/react';

export const TopFoods: React.FC = () => {
  const { setSelectedCategory, setCurrentView } = useApp();

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Title matching screenshot */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#E85B43] font-display">
            TOP FOODS
          </h2>
          <div className="w-12 h-1 bg-[#E85B43] rounded-full mx-auto mt-2" />
        </div>

        {/* 4 Category Showcase Columns matching screenshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {CATEGORIES_DATA.map((cat, idx) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -6 }}
              onClick={() => {
                setSelectedCategory(cat.slug);
                setCurrentView('menu');
              }}
              className="flex flex-col items-center cursor-pointer group"
            >
              {/* Food Image Container */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden mb-4 p-2 bg-white shadow-lg shadow-black/[0.04] border border-[#F0EAE1] flex items-center justify-center group-hover:border-[#E85B43]/50 transition-all">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Title & Count */}
              <h3 className="text-lg sm:text-xl font-bold text-[#2C2724] group-hover:text-[#E85B43] transition-colors font-display">
                {cat.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#78716A] mt-1 font-medium">
                {cat.itemCount} Restaurants Foods
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
