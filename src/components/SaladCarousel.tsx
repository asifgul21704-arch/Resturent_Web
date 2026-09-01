import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem } from '../types';

export const SaladCarousel: React.FC = () => {
  const {
    foodItems,
    addToCart,
    toggleFavorite,
    isFavorite,
    setSelectedFoodDetail
  } = useApp();

  // Filter salads or top items
  const saladItems = foodItems.filter(item => item.category === 'Salads');
  const [startIndex, setStartIndex] = useState(0);

  // Visible items window (up to 4 on desktop, 2 on tablet, 1 on mobile)
  const itemsPerPage = 4;
  const totalItems = saladItems.length;

  const handlePrev = () => {
    setStartIndex(prev => (prev === 0 ? Math.max(0, totalItems - itemsPerPage) : prev - 1));
  };

  const handleNext = () => {
    setStartIndex(prev => (prev + itemsPerPage >= totalItems ? 0 : prev + 1));
  };

  // Color schemes matching screenshot:
  // Card 1: Coral / Red gradient (#F2695C -> #E84D3D)
  // Card 2: Warm Amber / Orange (#FA9538 -> #EE7812)
  // Card 3: Fresh Green (#4CD263 -> #2CB846)
  // Card 4: Purple / Indigo (#6B77EE -> #505CD8)
  const themeStyles = {
    coral: {
      bg: 'bg-gradient-to-b from-[#F36B5E] to-[#E94E3E]',
      shadow: 'shadow-red-500/20'
    },
    orange: {
      bg: 'bg-gradient-to-b from-[#FA9538] to-[#EE7812]',
      shadow: 'shadow-orange-500/20'
    },
    green: {
      bg: 'bg-gradient-to-b from-[#4CD263] to-[#2CB846]',
      shadow: 'shadow-green-500/20'
    },
    purple: {
      bg: 'bg-gradient-to-b from-[#6B77EE] to-[#505CD8]',
      shadow: 'shadow-indigo-500/20'
    },
    default: {
      bg: 'bg-gradient-to-b from-[#F36B5E] to-[#E94E3E]',
      shadow: 'shadow-red-500/20'
    }
  };

  // Render cards with cyclic wrap
  const displayedItems = [
    saladItems[startIndex % totalItems],
    saladItems[(startIndex + 1) % totalItems],
    saladItems[(startIndex + 2) % totalItems],
    saladItems[(startIndex + 3) % totalItems]
  ].filter(Boolean);

  return (
    <section className="py-6 sm:py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Outer White Container with rounded corners matching screenshot */}
        <div className="relative bg-white/70 backdrop-blur-sm rounded-[36px] p-6 sm:p-10 border border-[#F0EAE1] shadow-xl shadow-black/[0.03]">
          
          {/* Left Arrow button matching screenshot */}
          <button
            id="carousel-prev-btn"
            onClick={handlePrev}
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl border border-[#EDE7DD] flex items-center justify-center text-[#2C2724] hover:bg-[#FAF7F2] hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
            aria-label="Previous salads"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Right Arrow button matching screenshot */}
          <button
            id="carousel-next-btn"
            onClick={handleNext}
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl border border-[#EDE7DD] flex items-center justify-center text-[#2C2724] hover:bg-[#FAF7F2] hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
            aria-label="Next salads"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Cards Grid matching screenshot layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {displayedItems.map((item, index) => {
              const theme = item.cardTheme || (index === 0 ? 'coral' : index === 1 ? 'orange' : index === 2 ? 'green' : 'purple');
              const currentTheme = themeStyles[theme] || themeStyles.coral;
              const fav = isFavorite(item.id);

              return (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="flex flex-col items-center group cursor-pointer"
                  onClick={() => setSelectedFoodDetail(item)}
                >
                  {/* Card Container with custom rounded top/bottom matching screenshot */}
                  <div className={`w-full ${currentTheme.bg} rounded-[28px] pt-14 pb-5 px-5 text-white shadow-xl ${currentTheme.shadow} relative flex flex-col items-center transition-all duration-300 group-hover:-translate-y-1.5`}>
                    
                    {/* Top Circular Plate Visual Overlapping the card */}
                    <div className="absolute -top-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Dish Title */}
                    <h3 className="text-lg font-bold tracking-tight text-white mt-1 text-center font-display">
                      {item.name}
                    </h3>

                    {/* Price & Heart Row matching screenshot */}
                    <div className="w-full flex items-center justify-between mt-2.5 px-2">
                      <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        ${item.price.toFixed(2)}
                      </span>
                      
                      {/* Heart Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className="p-1 text-white hover:scale-125 transition-transform"
                        title={fav ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart
                          className={`w-5 h-5 ${fav ? 'fill-white text-white' : 'text-white/90 hover:text-white'}`}
                        />
                      </button>
                    </div>

                    {/* Order Now Button & Star Rating Row matching screenshot */}
                    <div className="w-full flex items-center justify-between mt-4 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, 1);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-white text-[#2C2724] text-xs font-black shadow-md hover:bg-[#FAF7F2] active:scale-95 transition-all flex items-center gap-1"
                      >
                        <span>Order Now</span>
                        <span className="font-mono text-xs">›</span>
                      </button>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 text-xs font-bold text-white">
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                        <span>{item.rating.toFixed(1)}</span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
