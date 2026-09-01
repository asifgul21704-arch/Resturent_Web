import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, Star, Clock, Flame, Heart, Plus, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem } from '../types';

export const MenuCatalog: React.FC = () => {
  const {
    foodItems,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    addToCart,
    toggleFavorite,
    isFavorite,
    setSelectedFoodDetail
  } = useApp();

  const [dietFilter, setDietFilter] = useState<'all' | 'vegan' | 'gluten-free' | 'spicy' | 'bestseller'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'calories'>('recommended');
  const [maxPrice, setMaxPrice] = useState<number>(20);

  const categories = ['All', 'Salads', 'Burgers', 'Pizza', 'Pasta', 'Shakes', 'Desserts', 'Healthy', 'Drinks'];

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return foodItems.filter(item => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchCat && !matchTags) return false;
      }
      // Diet filter
      if (dietFilter === 'vegan' && !item.isVegan) return false;
      if (dietFilter === 'gluten-free' && !item.isGlutenFree) return false;
      if (dietFilter === 'spicy' && !item.isSpicy) return false;
      if (dietFilter === 'bestseller' && !item.isBestSeller) return false;

      // Price filter
      const effectivePrice = item.discountPrice || item.price;
      if (effectivePrice > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'calories') return a.calories - b.calories;
      return 0; // recommended
    });
  }, [foodItems, selectedCategory, searchQuery, dietFilter, sortBy, maxPrice]);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#F0EAE1]">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#E85B43] bg-[#E85B43]/10 px-3 py-1 rounded-full inline-block mb-2">
            DELICIOUS FRESH MENU
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2C2724] font-display">
            Explore All Food Dishes
          </h1>
          <p className="text-sm text-[#78716A] mt-1">
            Handcrafted with organic produce, wood-fired dough, and master chef love.
          </p>
        </div>

        {/* Search input in catalog */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8C847A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search our culinary menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EDE7DD] rounded-full text-sm text-[#2C2724] placeholder-[#A0988E] focus:outline-none focus:ring-2 focus:ring-[#E85B43] shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto py-5 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all select-none ${
              selectedCategory === cat
                ? 'bg-[#E85B43] text-white shadow-md shadow-[#E85B43]/20 scale-105'
                : 'bg-white border border-[#EAE3D5] text-[#57514B] hover:border-[#E85B43]/50 hover:bg-[#FAF7F2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Secondary Dietary & Sort Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE7DD] mb-8">
        
        {/* Diet chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#78716A] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'bestseller', label: '★ Best Sellers' },
            { id: 'vegan', label: '🌱 Vegan' },
            { id: 'gluten-free', label: '🌾 Gluten-Free' },
            { id: 'spicy', label: '🌶️ Spicy' }
          ].map(tag => (
            <button
              key={tag.id}
              onClick={() => setDietFilter(tag.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                dietFilter === tag.id
                  ? 'bg-[#2C2724] text-white'
                  : 'bg-white text-[#6B655F] hover:bg-[#EAE3D5]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Sort & Price Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[#78716A]">
            <span>Max Price:</span>
            <input
              type="range"
              min={3}
              max={20}
              step={1}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-20 accent-[#E85B43]"
            />
            <span className="font-bold text-[#2C2724]">${maxPrice}</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-[#EDE7DD] rounded-xl px-3 py-1.5 text-xs font-bold text-[#2C2724] focus:outline-none focus:ring-1 focus:ring-[#E85B43]"
          >
            <option value="recommended">Featured / Chef Pick</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated (★ 5.0)</option>
            <option value="calories">Lowest Calories</option>
          </select>
        </div>

      </div>

      {/* Food Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => {
            const fav = isFavorite(item.id);
            const effectivePrice = item.discountPrice || item.price;
            const hasDiscount = Boolean(item.discountPrice && item.discountPrice < item.price);

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl overflow-hidden border border-[#EAE3D5] shadow-md hover:shadow-xl hover:border-[#E85B43]/40 transition-all flex flex-col group"
              >
                {/* Image Container with overlay badges */}
                <div 
                  onClick={() => setSelectedFoodDetail(item)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F2] cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Heart Wishlist button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs shadow-md flex items-center justify-center text-[#2C2724] hover:scale-110 active:scale-95 transition-transform"
                    title={fav ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-4 h-4 ${fav ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`} />
                  </button>

                  {/* Badges (Discount or Best Seller) */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {hasDiscount && (
                      <span className="px-2.5 py-0.5 bg-[#E85B43] text-white text-[10px] font-black rounded-full shadow-md uppercase">
                        Save ${(item.price - item.discountPrice!).toFixed(2)}
                      </span>
                    )}
                    {item.isBestSeller && (
                      <span className="px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full shadow-md uppercase">
                        Best Seller
                      </span>
                    )}
                    {item.isVegan && (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full shadow-md">
                        🌱 Vegan
                      </span>
                    )}
                  </div>

                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="bg-white text-red-600 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        Sold Out Today
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs text-[#78716A] mb-1">
                      <span className="font-semibold">{item.category}</span>
                      <div className="flex items-center gap-1 font-bold text-[#2C2724]">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-[#A0988E]">({item.reviewCount})</span>
                      </div>
                    </div>

                    {/* Dish Name */}
                    <h3 
                      onClick={() => setSelectedFoodDetail(item)}
                      className="text-base font-bold text-[#2C2724] group-hover:text-[#E85B43] transition-colors cursor-pointer line-clamp-1 font-display"
                    >
                      {item.name}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-[#78716A] mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Nutritional micro metrics */}
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-[#8C847A]">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {item.calories} kcal
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {item.prepTimeMinutes} mins
                      </span>
                    </div>
                  </div>

                  {/* Price & Add to Cart button */}
                  <div className="mt-4 pt-3 border-t border-[#F5EFE6] flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-[#2C2724]">
                        ${effectivePrice.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-[#A0988E] line-through ml-1.5">
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(item, 1)}
                      disabled={!item.inStock}
                      className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all ${
                        item.inStock
                          ? 'bg-[#E85B43] text-white hover:bg-[#D44730] hover:shadow-md hover:shadow-[#E85B43]/20'
                          : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#FAF7F2] rounded-3xl border border-[#EDE7DD] p-8">
          <p className="text-4xl mb-3">🥗</p>
          <h3 className="text-lg font-bold text-[#2C2724]">No dishes found</h3>
          <p className="text-xs text-[#78716A] mt-1 max-w-sm mx-auto">
            We couldn't find any dishes matching your current filters. Try adjusting your search or category selection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setDietFilter('all');
              setMaxPrice(20);
            }}
            className="mt-4 px-5 py-2 bg-[#E85B43] text-white rounded-full text-xs font-bold hover:bg-[#D44730]"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
