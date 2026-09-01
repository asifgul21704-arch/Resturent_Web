import React from 'react';
import { useApp } from '../context/AppContext';
import { Tag, Sparkles, Clock, Check, ArrowRight } from 'lucide-react';
import { PROMO_CODES_DATA } from '../data/mockData';

export const OffersView: React.FC = () => {
  const { applyPromoCode, setIsCartDrawerOpen, setCurrentView, showToast } = useApp();

  const handleCopyAndApply = (code: string) => {
    navigator.clipboard?.writeText(code);
    applyPromoCode(code);
    showToast(`Code "${code}" copied & applied to your cart!`, 'success');
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#FFF5EC] to-[#FFE8D6] rounded-[36px] p-8 sm:p-12 border border-[#F5D8C0] text-center space-y-4 shadow-sm">
        <span className="text-xs font-black uppercase tracking-wider text-[#E85B43] bg-white px-3.5 py-1 rounded-full shadow-xs inline-block">
          EXCLUSIVE SAVINGS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#2C2724] font-display">
          Active Deals & Discount Vouchers
        </h1>
        <p className="text-sm text-[#78716A] max-w-xl mx-auto">
          Enjoy mouth-watering discounts on salads, burgers, and artisanal pizzas. Apply voucher codes with one click!
        </p>
      </div>

      {/* Promo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROMO_CODES_DATA.map(promo => (
          <div
            key={promo.code}
            className="bg-white rounded-3xl p-6 border border-[#EDE7DD] shadow-sm hover:shadow-lg hover:border-[#E85B43]/50 transition-all flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-[#E85B43]/10 text-[#E85B43] text-xs font-black rounded-full font-mono uppercase">
                  {promo.code}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {promo.discountPercent ? `${promo.discountPercent}% OFF` : `$${promo.discountFlat} OFF`}
                </span>
              </div>

              <h3 className="text-lg font-black text-[#2C2724] font-display">
                {promo.description}
              </h3>

              <p className="text-xs text-[#78716A]">
                {promo.minSubtotal ? `Minimum order subtotal of $${promo.minSubtotal.toFixed(2)}` : 'No minimum subtotal required.'}
              </p>
            </div>

            <button
              onClick={() => handleCopyAndApply(promo.code)}
              className="w-full py-3 rounded-2xl bg-[#FAF7F2] group-hover:bg-[#E85B43] group-hover:text-white text-[#2C2724] text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Copy & Apply to Order</span>
            </button>
          </div>
        ))}
      </div>

      {/* Featured Happy Hour Banner */}
      <div className="bg-[#2C2724] text-white rounded-[32px] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#FA9538] uppercase tracking-wider">
            CHEF SPECIAL DAILY
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Free Delivery on all orders over $25
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            No promo code required. Automatically calculated in your checkout bag.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('menu')}
          className="px-6 py-3 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730] shadow-md whitespace-nowrap"
        >
          Explore Fresh Menu →
        </button>
      </div>

    </div>
  );
};
