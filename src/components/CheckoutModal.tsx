import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CreditCard, ShieldCheck, MapPin, Check, ArrowRight, Lock, Phone, User, Mail, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { UserAddress } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTax,
    tipAmount,
    cartTotal,
    currentUser,
    createOrder,
    setTrackingModalOrder,
    showToast
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple_pay' | 'cash'>('card');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  // Form Fields
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Sarah Mitchell');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'sarah.mitchell@example.com');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+1 (555) 234-8971');
  const [streetAddress, setStreetAddress] = useState(
    currentUser?.addresses[0]?.street || '742 Evergreen Terrace, Apt 4B'
  );
  const [city, setCity] = useState(currentUser?.addresses[0]?.city || 'Rome');
  const [zipCode, setZipCode] = useState(currentUser?.addresses[0]?.zipCode || '00100');
  const [deliveryNotes, setDeliveryNotes] = useState('Ring bell and leave at door step.');

  // Card Simulator state
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'SARAH MITCHELL');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('884');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your cart is empty!', 'warning');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderAddress: UserAddress = {
        id: `addr-${Date.now()}`,
        label: 'Delivery Address',
        street: streetAddress,
        city,
        zipCode
      };

      const newOrder = createOrder({
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress: orderAddress,
        deliveryNotes,
        paymentMethod: paymentMethod === 'card' ? 'card' : paymentMethod === 'paypal' ? 'paypal' : paymentMethod === 'apple_pay' ? 'apple_pay' : 'cash',
      });

      setIsProcessing(false);
      setIsCheckoutOpen(false);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      // Automatically open the Live GPS Tracking modal!
      setTrackingModalOrder(newOrder);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-[36px] max-w-3xl w-full overflow-hidden shadow-2xl border border-[#EDE7DD] relative my-6 max-h-[92vh] flex flex-col"
      >
        
        {/* Header */}
        <div className="p-6 bg-[#FAF7F2] border-b border-[#F0EAE1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#E85B43] flex items-center justify-center text-white">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#2C2724] font-display">
                Secure Checkout & Payment Gateway
              </h2>
              <p className="text-xs text-[#78716A] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                256-Bit Encrypted Secure Foody Gateway
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-9 h-9 rounded-full bg-white border border-[#EDE7DD] hover:bg-[#F0EAE1] flex items-center justify-center text-[#2C2724]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7">
          
          {/* Section 1: Customer Contact & Delivery Info */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#2C2724] flex items-center gap-2 mb-3 font-display">
              <MapPin className="w-4 h-4 text-[#E85B43]" />
              1. Delivery Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C847A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C847A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#57514B] block mb-1">Street Address & Apartment</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">City / Region</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Postal / Zip Code</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#57514B] block mb-1">Delivery Notes for Courier</label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Leave with security, ring apartment doorbell..."
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method Selector */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#2C2724] flex items-center gap-2 mb-3 font-display">
              <CreditCard className="w-4 h-4 text-[#E85B43]" />
              2. Payment Method
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'card', label: 'Credit Card', icon: '💳' },
                { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                { id: 'apple_pay', label: 'Apple / Google Pay', icon: '🍎' },
                { id: 'cash', label: 'Cash on Delivery', icon: '💵' }
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === method.id
                      ? 'bg-[#E85B43]/5 border-[#E85B43] shadow-sm'
                      : 'bg-[#FAF7F2] border-[#EDE7DD] hover:border-[#E85B43]/40'
                  }`}
                >
                  <span className="text-2xl mb-1">{method.icon}</span>
                  <span className="text-xs font-bold text-[#2C2724]">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Interactive Credit Card Visual Simulator */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              
              {/* 3D Animated Card Preview */}
              <div className="flex justify-center">
                <div className="w-full max-w-sm h-48 rounded-2xl bg-gradient-to-tr from-neutral-900 via-neutral-800 to-stone-700 text-white p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden border border-white/10">
                  {/* Decorative Circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E85B43]/20 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-7 rounded-md bg-amber-400/80 border border-amber-300 shadow-inner flex items-center justify-center">
                      <div className="w-6 h-4 border border-amber-600/60 rounded-xs" />
                    </div>
                    <span className="text-xs font-black tracking-widest text-[#E85B43]">FOODY CARD</span>
                  </div>

                  <p className="font-mono text-lg tracking-widest font-bold text-center">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </p>

                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-neutral-400">Cardholder</p>
                      <p className="font-bold tracking-wide uppercase truncate max-w-[150px]">
                        {cardHolder || 'SARAH MITCHELL'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-neutral-400 text-right">Expires</p>
                      <p className="font-bold font-mono">{cardExpiry || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Card Number</label>
                  <input
                    type="text"
                    required={paymentMethod === 'card'}
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-mono font-bold text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#57514B] block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required={paymentMethod === 'card'}
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs uppercase font-bold text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      required={paymentMethod === 'card'}
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-mono text-center font-bold text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#57514B] block mb-1">CVC / CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="884"
                      required={paymentMethod === 'card'}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs font-mono text-center font-bold text-[#2C2724] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center space-y-2">
              <p className="text-sm font-bold text-blue-950">PayPal Express Checkout</p>
              <p className="text-xs text-blue-800">
                You will be seamlessly connected to PayPal for quick one-touch authorization.
              </p>
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
              <p className="text-sm font-bold text-amber-950">Pay Cash upon Delivery</p>
              <p className="text-xs text-amber-800">
                Please have the exact amount of <strong>${cartTotal.toFixed(2)}</strong> ready for courier Marco upon doorstep arrival.
              </p>
            </div>
          )}

          {/* Order Summary Recap */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE7DD] space-y-2 text-xs text-[#6B655F]">
            <div className="flex justify-between">
              <span>Items Subtotal ({cart.length} dishes)</span>
              <span className="font-bold text-[#2C2724]">${cartSubtotal.toFixed(2)}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>-${cartDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax + Courier Tip</span>
              <span>${(cartTax + tipAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-[#2C2724] pt-2 border-t border-[#EAE3D5]">
              <span>Final Total to Pay</span>
              <span className="text-[#E85B43]">${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 rounded-full bg-[#E85B43] text-white font-black text-base hover:bg-[#D44730] shadow-xl shadow-[#E85B43]/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authorizing Payment & Sending to Kitchen...</span>
              </div>
            ) : (
              <>
                <Lock className="w-4 h-4 stroke-[2.5]" />
                <span>Pay ${cartTotal.toFixed(2)} & Track Live Delivery</span>
              </>
            )}
          </button>

        </form>

      </motion.div>
    </div>
  );
};
