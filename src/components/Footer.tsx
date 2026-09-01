import React from 'react';
import { useApp } from '../context/AppContext';
import { Instagram, Facebook, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setIsAIAssistantOpen } = useApp();

  return (
    <footer className="bg-[#FFFDF9] border-t border-[#F0EAE1] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#F0EAE1]">
          
          {/* Brand Info & Socials (Col 1) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#E85B43] flex items-center justify-center text-white shadow-md shadow-[#E85B43]/20">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M4 10.5C4 7.46 6.46 5 9.5 5h5c3.04 0 5.5 2.46 5.5 5.5v.5H4v-.5zM3 13h18v1.5c0 .83-.67 1.5-1.5 1.5H4.5A1.5 1.5 0 0 1 3 14.5V13zm1 5h16v.5c0 1.93-1.57 3.5-3.5 3.5h-9A3.5 3.5 0 0 1 4 18.5V18z"/>
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-[#E85B43] font-display">
                Foody
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#78716A] leading-relaxed max-w-sm">
              Vivamus convallis fermen sollicitudin et, vitae elit in vel ultrices sed in urna ipsum ullamcorper auctor.
            </p>

            {/* Social Icons matching screenshot: Google, Facebook, Instagram */}
            <div className="flex items-center space-x-5 pt-2">
              {/* Google */}
              <a
                href="#google"
                onClick={(e) => { e.preventDefault(); alert('Connecting to Foody Google Business review page'); }}
                className="text-[#2C2724] hover:text-[#E85B43] font-bold text-lg transition-colors"
                title="Foody on Google"
              >
                G
              </a>
              {/* Facebook */}
              <a
                href="#facebook"
                onClick={(e) => { e.preventDefault(); alert('Follow Foody on Facebook'); }}
                className="text-[#2C2724] hover:text-[#E85B43] font-bold text-lg transition-colors"
                title="Foody on Facebook"
              >
                f
              </a>
              {/* Instagram */}
              <a
                href="#instagram"
                onClick={(e) => { e.preventDefault(); alert('Follow Foody on Instagram @TheFoodyOfficial'); }}
                className="text-[#2C2724] hover:text-[#E85B43] transition-colors"
                title="Foody on Instagram"
              >
                <Instagram className="w-5 h-5 stroke-[2.2]" />
              </a>
            </div>
          </div>

          {/* ABOUT US Links (Col 2) matching screenshot */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#2C2724] font-display">
              ABOUT US
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#78716A]">
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-[#E85B43] transition-colors">
                  Our Story
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('restaurants')} className="hover:text-[#E85B43] transition-colors">
                  Our Locations
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('offers')} className="hover:text-[#E85B43] transition-colors">
                  Current Deals
                </button>
              </li>
              <li>
                <button onClick={() => setIsAIAssistantOpen(true)} className="hover:text-[#E85B43] transition-colors flex items-center gap-1 text-[#E85B43] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask AI Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* OUR MENU Links (Col 3) matching screenshot */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#2C2724] font-display">
              OUR MENU
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#78716A]">
              <li>
                <button onClick={() => { setSelectedCategory('Pizza'); setCurrentView('menu'); }} className="hover:text-[#E85B43] transition-colors">
                  Pizza
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('Pasta'); setCurrentView('menu'); }} className="hover:text-[#E85B43] transition-colors">
                  Pasta
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('Desserts'); setCurrentView('menu'); }} className="hover:text-[#E85B43] transition-colors">
                  Dessert
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('Burgers'); setCurrentView('menu'); }} className="hover:text-[#E85B43] transition-colors">
                  Take & Bake
                </button>
              </li>
            </ul>
          </div>

          {/* OUR LOCATION (Col 4) matching screenshot */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#2C2724] font-display">
              OUR LOCATION
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#78716A]">
              <li className="hover:text-[#2C2724] transition-colors">
                The FOODY Rome • Via del Corso 84
              </li>
              <li className="hover:text-[#2C2724] transition-colors">
                The FOODY Madrid • Gran Vía 32
              </li>
              <li className="hover:text-[#2C2724] transition-colors">
                The FOODY Paris • Boulevard Saint-Germain
              </li>
              <li className="hover:text-[#2C2724] transition-colors">
                The FOODY Miami • Ocean Drive 1200
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright bar matching screenshot */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C847A] gap-4">
          <p>Copyright © 2024 The Foody</p>
          <p className="font-semibold text-[#2C2724]">Powered by The FOODY</p>
        </div>

      </div>
    </footer>
  );
};
