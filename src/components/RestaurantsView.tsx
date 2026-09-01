import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Clock, Star, ArrowRight } from 'lucide-react';

export const RestaurantsView: React.FC = () => {
  const { setCurrentView } = useApp();

  const locations = [
    {
      id: 'rome',
      name: 'The FOODY Rome Flagship',
      address: 'Via del Corso 84, 00186 Rome, Italy',
      phone: '+39 06 698 7210',
      hours: '10:00 AM - 11:30 PM Daily',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      tag: 'Flagship Kitchen'
    },
    {
      id: 'madrid',
      name: 'The FOODY Madrid Central',
      address: 'Gran Vía 32, 28013 Madrid, Spain',
      phone: '+34 91 532 8901',
      hours: '11:00 AM - Midnight Daily',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      tag: 'Tapas & Grill Studio'
    },
    {
      id: 'paris',
      name: 'The FOODY Paris Saint-Germain',
      address: '142 Boulevard Saint-Germain, 75006 Paris, France',
      phone: '+33 1 42 68 55 00',
      hours: '10:30 AM - 11:00 PM Daily',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
      tag: 'Artisanal Bakery'
    },
    {
      id: 'miami',
      name: 'The FOODY Miami Beach',
      address: '1200 Ocean Drive, Miami Beach, FL 33139',
      phone: '+1 (305) 538-2000',
      hours: '10:00 AM - 1:00 AM Daily',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80',
      tag: 'Coastal Organic Grill'
    }
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#E85B43] bg-[#E85B43]/10 px-3.5 py-1 rounded-full inline-block">
          GLOBAL HUBS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#2C2724] font-display">
          Our Restaurant Locations
        </h1>
        <p className="text-sm text-[#78716A] max-w-xl mx-auto">
          Visit our award-winning open-concept gourmet kitchens or order direct delivery straight to your door.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {locations.map(loc => (
          <div
            key={loc.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#EDE7DD] shadow-sm hover:shadow-xl transition-all flex flex-col group"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
              <img
                src={loc.image}
                alt={loc.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-[#2C2724] text-white text-xs font-black rounded-full shadow-md">
                  {loc.tag}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md text-[#2C2724]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{loc.rating}</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#2C2724] font-display">
                  {loc.name}
                </h3>
                <div className="space-y-1.5 text-xs text-[#6B655F]">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E85B43] shrink-0" />
                    {loc.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FA9538] shrink-0" />
                    {loc.hours}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    {loc.phone}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-700">● Open for dine-in & delivery</span>
                <button
                  onClick={() => setCurrentView('menu')}
                  className="px-4 py-2 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730]"
                >
                  Order from here →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
