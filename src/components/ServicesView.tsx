import React from 'react';
import { useApp } from '../context/AppContext';
import { Truck, ShieldCheck, Sparkles, Utensils, Award, Clock, HeartHandshake, ArrowRight } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { setCurrentView, setIsAIAssistantOpen } = useApp();

  const services = [
    {
      icon: <Truck className="w-8 h-8 text-[#E85B43]" />,
      title: '30-Minute GPS Fast Delivery',
      desc: 'Our electric Vespa courier fleet guarantees boiling hot pizza and crisp salads at your doorstep in under 30 minutes.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
      title: '100% Certified Organic Kitchens',
      desc: 'Every herb, tomato, olive oil drop, and sourdough grain is sourced every morning from partner organic regional farms.'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-[#FA9538]" />,
      title: 'AI Smart Food Concierge',
      desc: 'Personalized dietary recommendations, calorie calculations, allergen screening, and dish pairings powered by Gemini 2.5.'
    },
    {
      icon: <Utensils className="w-8 h-8 text-purple-600" />,
      title: 'Corporate & Party Catering',
      desc: 'Custom banquet menus for private weddings, team summits, and birthdays with full tableware and chef stations.'
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: 'Real-Time Telemetry Tracking',
      desc: 'Monitor your dish cooking temperature, driver GPS route on interactive map, and exact arrival countdowns in real time.'
    },
    {
      icon: <Award className="w-8 h-8 text-amber-600" />,
      title: 'Master Chef Craftsmanship',
      desc: 'Every recipe is curated and tested by award-winning culinary directors Alizeh Anderson & Angelina John.'
    }
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#E85B43] bg-[#E85B43]/10 px-3.5 py-1 rounded-full inline-block">
          WHY CHOOSE FOODY
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#2C2724] font-display">
          Premium Culinary Services & Delivery
        </h1>
        <p className="text-sm text-[#78716A] max-w-xl mx-auto">
          We combine old-world culinary craftsmanship with modern GPS dispatch and AI-powered health personalization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-7 border border-[#EDE7DD] shadow-sm hover:shadow-xl hover:border-[#E85B43]/40 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] flex items-center justify-center">
                {s.icon}
              </div>
              <h3 className="text-lg font-black text-[#2C2724] font-display">
                {s.title}
              </h3>
              <p className="text-xs text-[#78716A] leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="bg-[#FAF7F2] rounded-[36px] p-8 sm:p-12 border border-[#EDE7DD] text-center space-y-4">
        <h2 className="text-2xl sm:text-4xl font-black text-[#2C2724] font-display">
          Ready to Experience Next-Gen Food Delivery?
        </h2>
        <p className="text-xs sm:text-sm text-[#78716A] max-w-md mx-auto">
          Join over 50,000 foodies ordering daily meals, fresh salads, and wood-fired sourdough pizzas.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={() => setCurrentView('menu')}
            className="px-8 py-3.5 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730] shadow-lg shadow-[#E85B43]/20"
          >
            Explore Menu Catalog
          </button>
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="px-6 py-3.5 bg-white border border-[#EDE7DD] text-[#2C2724] text-xs font-bold rounded-full hover:bg-[#F0EAE1]"
          >
            Chat with AI Chef
          </button>
        </div>
      </div>

    </div>
  );
};
