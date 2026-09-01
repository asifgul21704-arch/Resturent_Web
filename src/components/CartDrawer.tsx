import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    cartDiscount,
    deliveryFee,
    tipAmount,
    setTipAmount,
    cartTax,
    cartTotal,
    setIsCheckoutOpen,
    setCurrentView
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code) return;
    const result = applyPromoCode(code);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
        >
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#E85B43] flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#2C2724] font-display">
                  Your Food Basket
                </h3>
                <p className="text-xs text-[#78716A]">
                  {cart.length} unique {cart.length === 1 ? 'dish' : 'dishes'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-[#8C847A] hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  title="Clear all items"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-9 h-9 rounded-full bg-white border border-[#EDE7DD] hover:bg-[#F0EAE1] flex items-center justify-center text-[#2C2724]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Scrollable Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              cart.map((item, index) => {
                const itemBasePrice = item.foodItem.discountPrice || item.foodItem.price;
                const addonsPrice = item.selectedAddons.reduce((sum, a) => sum + a.price, 0);
                const rowTotal = (itemBasePrice + addonsPrice) * item.quantity;

                return (
                  <div
                    key={`${item.foodItem.id}-${index}`}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DD] flex gap-3.5 relative group"
                  >
                    <img
                      src={item.foodItem.image}
                      alt={item.foodItem.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#EAE3D5]"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-bold text-[#2C2724] truncate">
                          {item.foodItem.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-[#A0988E] hover:text-red-500 transition-colors p-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-black text-[#E85B43] mt-0.5">
                        ${rowTotal.toFixed(2)}
                      </p>

                      {/* Selected Addons preview */}
                      {item.selectedAddons.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.selectedAddons.map(a => (
                            <span key={a.id} className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-[#EAE3D5] text-[#6B655F]">
                              +{a.name} (${a.price.toFixed(2)})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Special instructions */}
                      {item.specialInstructions && (
                        <p className="text-[10px] text-[#8C847A] italic mt-1 truncate">
                          Note: "{item.specialInstructions}"
                        </p>
                      )}

                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-2.5 mt-3">
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white border border-[#EDE7DD] flex items-center justify-center text-[#2C2724] hover:bg-[#EAE3D5]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-[#2C2724] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white border border-[#EDE7DD] flex items-center justify-center text-[#2C2724] hover:bg-[#EAE3D5]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 space-y-3">
                <div className="w-20 h-20 rounded-full bg-[#FAF7F2] flex items-center justify-center mx-auto text-3xl text-neutral-400">
                  🥗
                </div>
                <h4 className="text-base font-bold text-[#2C2724]">Your basket is empty</h4>
                <p className="text-xs text-[#78716A] max-w-xs mx-auto">
                  Explore our signature salads, burgers, and stone-baked sourdough pizzas to get started!
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentView('menu');
                  }}
                  className="px-6 py-2.5 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730]"
                >
                  Browse Menu Now
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer: Coupons, Tip & Price Breakdown */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#FAF7F2] border-t border-[#F0EAE1] space-y-4">
              
              {/* Promo code box */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900">
                          Coupon "{appliedPromo.code}" Applied
                        </p>
                        <p className="text-[10px] text-emerald-700">
                          {appliedPromo.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Promo Code (e.g. FOODY20)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3.5 py-2 bg-white border border-[#EDE7DD] rounded-xl text-xs uppercase font-bold text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 bg-[#2C2724] text-white rounded-xl text-xs font-bold hover:bg-black"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick copy chips */}
                    <div className="flex gap-2 text-[10px]">
                      <button
                        onClick={() => handleApplyCoupon('FOODY20')}
                        className="text-[#E85B43] font-bold hover:underline"
                      >
                        ⚡ Apply "FOODY20" (20% Off)
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleApplyCoupon('FREESHIP')}
                        className="text-emerald-600 font-bold hover:underline"
                      >
                        "FREESHIP"
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Courier Tip selector */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#2C2724]">Courier Tip</span>
                  <span className="text-[#8C847A]">${tipAmount.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 5, 0].map(tip => (
                    <button
                      key={tip}
                      onClick={() => setTipAmount(tip)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        tipAmount === tip
                          ? 'bg-[#E85B43] text-white border-[#E85B43]'
                          : 'bg-white text-[#2C2724] border-[#EAE3D5] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      {tip === 0 ? 'No Tip' : `$${tip}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Table */}
              <div className="space-y-1.5 text-xs text-[#6B655F] pt-2 border-t border-[#EDE7DD]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2C2724]">${cartSubtotal.toFixed(2)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>-${cartDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${cartTax.toFixed(2)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Rider Tip</span>
                    <span>${tipAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-[#2C2724] pt-2 border-t border-[#EAE3D5]">
                  <span>Total Amount</span>
                  <span className="text-base text-[#E85B43]">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-[#E85B43] text-white rounded-full font-black text-sm hover:bg-[#D44730] shadow-lg shadow-[#E85B43]/30 active:scale-95 transition-all flex items-center justify-between px-6"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-1.5">
                  <span>${cartTotal.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};
