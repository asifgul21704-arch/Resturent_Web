import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Phone, MessageSquare, FileText, CheckCircle2, Clock, MapPin, Navigation, Bike, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';

export const LiveTrackingModal: React.FC = () => {
  const {
    trackingModalOrder,
    setTrackingModalOrder,
    activeLiveOrder,
    advanceOrderStatus,
    setInvoiceModalOrder,
    showToast
  } = useApp();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'courier' | 'user'; text: string; time: string }>>([
    { sender: 'courier', text: "Ciao! I have your fresh Foody order secured in my insulated thermal box. On my way!", time: "Just now" }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Use the active live order from context (which updates GPS continuously), or fallback to modal order
  const order: Order | null = (activeLiveOrder && activeLiveOrder.id === trackingModalOrder?.id)
    ? activeLiveOrder
    : trackingModalOrder;

  if (!order) return null;

  const currentStepIndex = order.status === 'placed' ? 0 : order.status === 'preparing' ? 1 : order.status === 'on_the_way' ? 2 : order.status === 'delivered' ? 3 : 0;

  // Courier position calculation for the vector map (percentages)
  // Restaurant: [15%, 25%], Customer: [85%, 75%]
  const courierProgress = order.liveLocationProgress || 50;
  const courierX = 15 + ((85 - 15) * courierProgress) / 100;
  const courierY = 25 + ((75 - 25) * courierProgress) / 100;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user' as const, text: chatInput, time: 'Just now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Courier auto reply
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'courier',
          text: "Got it! Thanks for letting me know. See you in a few minutes!",
          time: 'Just now'
        }
      ]);
    }, 1200);
  };

  const handleOpenInvoice = () => {
    setInvoiceModalOrder(order);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-[36px] max-w-4xl w-full overflow-hidden shadow-2xl border border-[#EDE7DD] relative my-6 max-h-[94vh] flex flex-col"
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#F0EAE1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E85B43] flex items-center justify-center text-white">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#2C2724] font-display">
                  Live GPS Order Tracker
                </h2>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase animate-pulse">
                  Live GPS
                </span>
              </div>
              <p className="text-xs text-[#78716A]">
                Order ID: <span className="font-mono font-bold text-[#2C2724]">{order.id}</span> • {order.items.length} items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInvoice}
              className="px-3.5 py-2 rounded-full bg-white border border-[#EDE7DD] text-xs font-bold text-[#2C2724] hover:bg-[#FAF7F2] flex items-center gap-1.5 shadow-xs"
              title="Download PDF Invoice"
            >
              <FileText className="w-3.5 h-3.5 text-[#E85B43]" />
              <span className="hidden sm:inline">PDF Invoice</span>
            </button>

            <button
              onClick={() => setTrackingModalOrder(null)}
              className="w-9 h-9 rounded-full bg-white border border-[#EDE7DD] hover:bg-[#F0EAE1] flex items-center justify-center text-[#2C2724]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status Timeline */}
          <div className="bg-[#FAF7F2] p-5 rounded-3xl border border-[#EDE7DD]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E85B43]">
                  Status Overview
                </span>
                <h3 className="text-base font-black text-[#2C2724]">
                  {order.status === 'placed' && 'Order Placed & Confirmed'}
                  {order.status === 'preparing' && 'Kitchen is Preparing Fresh Meal'}
                  {order.status === 'on_the_way' && 'Courier Marco is On The Way!'}
                  {order.status === 'delivered' && 'Order Successfully Delivered!'}
                </h3>
              </div>

              {/* ETA Display */}
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#8C847A] block">Estimated Arrival</span>
                <span className="text-lg font-black text-[#E85B43] flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {order.status === 'delivered' ? 'Arrived!' : `${order.courier?.etaMinutes || 20} mins`}
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[
                { title: 'Confirmed', desc: 'Order placed' },
                { title: 'In Kitchen', desc: 'Cooking fresh' },
                { title: 'On The Way', desc: 'GPS delivery' },
                { title: 'Delivered', desc: 'Enjoy food' }
              ].map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.title} className="text-center">
                    <div className={`h-2 rounded-full mb-2 transition-all ${
                      isPassed ? 'bg-[#E85B43]' : 'bg-[#E5DFD5]'
                    } ${isCurrent ? 'animate-pulse ring-2 ring-[#E85B43]/30' : ''}`} />
                    <p className={`text-xs font-bold ${isPassed ? 'text-[#2C2724]' : 'text-[#A0988E]'}`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-[#8C847A] hidden sm:block">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick Testing Controller */}
            <div className="mt-4 pt-3 border-t border-[#EAE3D5] flex items-center justify-between text-xs text-[#78716A]">
              <span>Simulate Delivery Progress:</span>
              <button
                onClick={() => advanceOrderStatus(order.id)}
                className="px-3 py-1.5 bg-[#2C2724] text-white font-bold rounded-xl hover:bg-black active:scale-95 transition-all text-xs flex items-center gap-1"
              >
                <span>⚡ Advance Next Step</span>
              </button>
            </div>
          </div>

          {/* Interactive GPS Live Vector Map */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-[#E8ECE9] rounded-3xl overflow-hidden border border-[#D5DCD7] shadow-inner">
            
            {/* Street Grid Artwork */}
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="street-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#BAC7BC" strokeWidth="2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#street-grid)" />
              {/* Main Arterial Roads */}
              <line x1="0" y1="30%" x2="100%" y2="70%" stroke="#FFFFFF" strokeWidth="16" />
              <line x1="20%" y1="0" x2="80%" y2="100%" stroke="#FFFFFF" strokeWidth="12" />
              {/* City River */}
              <path d="M 0 80 Q 250 20, 500 90 T 1000 60" fill="none" stroke="#A7D2ED" strokeWidth="24" opacity="0.6" />
            </svg>

            {/* Delivery Route Polyline */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1="15%"
                y1="25%"
                x2="85%"
                y2="75%"
                stroke="#E85B43"
                strokeWidth="4"
                strokeDasharray="6 6"
                className="animate-pulse"
              />
            </svg>

            {/* Restaurant Origin Pin */}
            <div className="absolute top-[25%] left-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="w-10 h-10 rounded-full bg-[#E85B43] text-white shadow-xl flex items-center justify-center border-2 border-white ring-4 ring-[#E85B43]/20">
                <span className="text-base">🍳</span>
              </div>
              <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-md shadow-md text-[#2C2724] mt-1 whitespace-nowrap border border-[#EDE7DD]">
                Foody Kitchen
              </span>
            </div>

            {/* Customer Destination Pin */}
            <div className="absolute top-[75%] left-[85%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white shadow-xl flex items-center justify-center border-2 border-white ring-4 ring-emerald-600/20">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-md shadow-md text-[#2C2724] mt-1 whitespace-nowrap border border-[#EDE7DD]">
                Delivery Home
              </span>
            </div>

            {/* Live Moving Courier Scooter */}
            <motion.div
              animate={{ left: `${courierX}%`, top: `${courierY}%` }}
              transition={{ duration: 1.5, ease: 'linear' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
            >
              <div className="w-12 h-12 rounded-full bg-[#2C2724] text-white shadow-2xl flex items-center justify-center border-2 border-[#FA9538] animate-bounce">
                <Bike className="w-6 h-6 text-[#FA9538]" />
              </div>
              <span className="text-[10px] font-black bg-[#2C2724] text-white px-2 py-0.5 rounded-md shadow-lg mt-1 whitespace-nowrap">
                Marco (Courier)
              </span>
            </motion.div>

            {/* Map Floating Legend */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#EDE7DD] shadow-md text-[10px] text-[#57514B]">
              <span className="font-bold text-[#E85B43]">Rome City Route</span> • Speed: 28 km/h
            </div>

          </div>

          {/* Courier Contact Card */}
          <div className="p-5 rounded-3xl bg-white border border-[#EDE7DD] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={order.courier?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
                alt="Courier"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E85B43] shadow-md"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C847A] tracking-wide">
                  Your Dedicated Driver
                </span>
                <h4 className="text-base font-black text-[#2C2724]">
                  {order.courier?.name || order.courierName || 'Marco Rossi'}
                </h4>
                <p className="text-xs text-[#78716A]">
                  Red Vespa 125 • Plate: <span className="font-mono font-bold text-[#2C2724]">FDY-7729</span> (★ 4.98)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  showToast('Calling driver Marco Rossi (+39 06 698 721)...', 'info');
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#FAF7F2] border border-[#EDE7DD] text-xs font-bold text-[#2C2724] hover:bg-[#F0EAE1] flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#E85B43]" />
                <span>Call Rider</span>
              </button>

              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#E85B43] text-white text-xs font-bold hover:bg-[#D44730] flex items-center justify-center gap-1.5 shadow-md shadow-[#E85B43]/20"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isChatOpen ? 'Close Chat' : 'Chat with Marco'}</span>
              </button>
            </div>
          </div>

          {/* Courier Direct Chat Drawer */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#FAF7F2] rounded-3xl p-5 border border-[#EDE7DD] space-y-3 overflow-hidden"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D5]">
                  <span className="text-xs font-bold text-[#2C2724]">
                    Direct Driver Messenger
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                    Marco is Online
                  </span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto p-1">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3.5 py-2 rounded-2xl text-xs ${
                          msg.sender === 'user'
                            ? 'bg-[#E85B43] text-white rounded-br-none'
                            : 'bg-white text-[#2C2724] border border-[#EAE3D5] rounded-bl-none shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-[#A0988E] mt-0.5 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Type message to driver (e.g. Please leave at door)..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white border border-[#EDE7DD] rounded-xl text-xs text-[#2C2724] focus:outline-none focus:ring-1 focus:ring-[#E85B43]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2C2724] text-white rounded-xl text-xs font-bold hover:bg-black"
                  >
                    Send
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Itemized Order Summary */}
          <div className="p-5 rounded-3xl bg-[#FAF7F2] border border-[#EDE7DD] space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#2C2724]">
              Ordered Food Items
            </h4>
            <div className="divide-y divide-[#EFECE6]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.foodItem.image}
                      alt={item.foodItem.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-[#2C2724]">
                        {item.quantity}x {item.foodItem.name}
                      </p>
                      {item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-[#78716A]">
                          +{item.selectedAddons.map(a => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-[#2C2724]">
                    ${((item.foodItem.discountPrice || item.foodItem.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#EAE3D5] flex justify-between items-center text-xs">
              <span className="text-[#78716A]">Total Paid with {order.paymentMethod.toUpperCase()}</span>
              <span className="text-sm font-black text-[#E85B43]">${(order.total || order.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
