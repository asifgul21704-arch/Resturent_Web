import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Send, Bot, User, Plus, RefreshCw, Compass, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { FoodItem } from '../types';

export const AIAssistantModal: React.FC = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    foodItems,
    addToCart,
    setSelectedFoodDetail,
    setCurrentView,
    activeLiveOrder,
    setTrackingModalOrder
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    suggestedDishIds?: string[];
  }>>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 **Ciao! I'm your Foody AI Culinary Concierge.**\n\nI can help you build custom meals, calculate macros, suggest vegan or gluten-free options, or recommend wine and dessert pairings. What are you craving today?",
      suggestedDishIds: ['salad-1', 'burger-1', 'pizza-1']
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAIAssistantOpen]);

  if (!isAIAssistantOpen) return null;

  const quickPrompts = [
    "🥗 Low-calorie lunch under 500 kcal",
    "🍕 Best spicy wood-fired pizza",
    "🌱 100% Vegan dinner with high protein",
    "📦 Where is my active delivery right now?",
    "🧁 Best dessert pairing for berries salad"
  ];

  const handleSend = async (userTextToSend?: string) => {
    const text = userTextToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const newMessages = [
      ...messages,
      { id: userMessageId, role: 'user' as const, content: text }
    ];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation history for the API
      const conversationHistory = newMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      // Call our secure backend server-side Gemini route
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory,
          menuContext: foodItems.map(i => ({
            id: i.id,
            name: i.name,
            category: i.category,
            price: i.price,
            discountPrice: i.discountPrice,
            calories: i.calories,
            prepTime: i.prepTimeMinutes,
            isVegan: i.isVegan,
            isGlutenFree: i.isGlutenFree,
            isSpicy: i.isSpicy,
            tags: i.tags
          })),
          activeOrder: activeLiveOrder ? {
            id: activeLiveOrder.id,
            status: activeLiveOrder.status,
            eta: activeLiveOrder.courier?.etaMinutes || 25,
            courier: activeLiveOrder.courier?.name || 'Marco Rossi'
          } : null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();

      // Find mentioned dishes to render interactive quick-add cards
      const matchedDishes: string[] = [];
      foodItems.forEach(item => {
        if (
          data.reply.toLowerCase().includes(item.name.toLowerCase()) ||
          text.toLowerCase().includes(item.name.toLowerCase())
        ) {
          if (!matchedDishes.includes(item.id)) {
            matchedDishes.push(item.id);
          }
        }
      });

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          suggestedDishIds: matchedDishes.slice(0, 3)
        }
      ]);
    } catch (error) {
      console.error('AI chat error:', error);
      // Helpful fallback response
      let fallbackText = "I'm having a brief connection hitch with the kitchen satellite, but I highly recommend our **Berries Salad ($5.00)** or our chef's signature **Double Truffle Burger ($8.99)**!";
      if (text.toLowerCase().includes('track') || text.toLowerCase().includes('order')) {
        fallbackText = activeLiveOrder
          ? `Your order **#${activeLiveOrder.id}** is currently **${activeLiveOrder.status.replace('_', ' ').toUpperCase()}** with an estimated delivery in **${activeLiveOrder.courier?.etaMinutes || 20} minutes**!`
          : "You don't have an active delivery right now. Would you like to check our freshly baked sourdough pizzas?";
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          suggestedDishIds: ['salad-1', 'burger-1']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-[36px] max-w-2xl w-full h-[85vh] overflow-hidden shadow-2xl border border-[#EDE7DD] relative flex flex-col"
      >
        
        {/* Chat Header */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-b border-[#F0EAE1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E85B43] to-[#FA9538] flex items-center justify-center text-white shadow-md shadow-[#E85B43]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#2C2724] font-display">
                  Foody AI Concierge
                </h3>
                <span className="text-[10px] font-bold bg-[#E85B43]/10 text-[#E85B43] px-2 py-0.5 rounded-full">
                  Gemini 2.5
                </span>
              </div>
              <p className="text-xs text-[#78716A]">
                Smart Nutritionist, Sommelier & Order Tracker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([
                {
                  id: 'reset',
                  role: 'assistant',
                  content: "👋 How can I help with your culinary cravings or order details today?",
                  suggestedDishIds: ['salad-1', 'pizza-1']
                }
              ])}
              className="p-2 rounded-full hover:bg-white text-[#8C847A] hover:text-[#2C2724] transition-colors"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAIAssistantOpen(false)}
              className="w-9 h-9 rounded-full bg-white border border-[#EDE7DD] hover:bg-[#F0EAE1] flex items-center justify-center text-[#2C2724]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Message Scroll List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#E85B43] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[82%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Text Bubble */}
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#E85B43] text-white rounded-br-none shadow-md shadow-[#E85B43]/15'
                      : 'bg-[#FAF7F2] text-[#2C2724] border border-[#EDE7DD] rounded-bl-none shadow-xs'
                  }`}
                >
                  <div className="prose prose-sm max-w-none text-inherit">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>

                {/* Suggested Dish Cards (Interactive 1-click Add to Cart) */}
                {msg.suggestedDishIds && msg.suggestedDishIds.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {msg.suggestedDishIds.map(dishId => {
                      const dish = foodItems.find(f => f.id === dishId);
                      if (!dish) return null;
                      return (
                        <div
                          key={dish.id}
                          className="p-2.5 rounded-2xl bg-white border border-[#EDE7DD] shadow-xs flex items-center justify-between gap-2 hover:border-[#E85B43]/40 transition-all"
                        >
                          <div 
                            onClick={() => setSelectedFoodDetail(dish)}
                            className="flex items-center gap-2.5 cursor-pointer min-w-0"
                          >
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#2C2724] truncate">
                                {dish.name}
                              </p>
                              <p className="text-[11px] font-black text-[#E85B43]">
                                ${(dish.discountPrice || dish.price).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => addToCart(dish, 1)}
                            className="px-2.5 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#E85B43] hover:text-white text-[#2C2724] text-[10px] font-black transition-colors shrink-0"
                          >
                            + Add
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#2C2724] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-full bg-[#E85B43] flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DD] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E85B43] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#E85B43] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#E85B43] animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-[#78716A] ml-1">Consulting kitchen recipes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-5 py-2 bg-[#FAF7F2] border-t border-[#F0EAE1] overflow-x-auto scrollbar-none flex gap-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 bg-white border border-[#EDE7DD] hover:border-[#E85B43] text-[#57514B] hover:text-[#2C2724] rounded-full text-xs font-semibold whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 bg-white border-t border-[#F0EAE1] flex gap-3">
          <input
            type="text"
            placeholder="Ask anything (e.g. 'I want something under 600 calories with high protein')..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-3 bg-[#FAF7F2] border border-[#EDE7DD] rounded-2xl text-xs sm:text-sm text-[#2C2724] placeholder-[#A0988E] focus:outline-none focus:ring-2 focus:ring-[#E85B43]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-12 h-12 rounded-2xl bg-[#E85B43] hover:bg-[#D44730] text-white flex items-center justify-center shadow-md shadow-[#E85B43]/20 active:scale-95 transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </motion.div>
    </div>
  );
};
