import React, { useState } from 'react';
import { CHEFS_DATA } from '../data/mockData';
import { ChefInfo } from '../types';
import { Sparkles, Award, Utensils, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TeamSection: React.FC = () => {
  const [selectedChef, setSelectedChef] = useState<ChefInfo | null>(null);

  return (
    <section className="py-14 sm:py-20 bg-[#FDFBF7]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header matching screenshot */}
        <div className="mb-12">
          <span className="text-base sm:text-lg font-bold text-[#E85B43] lowercase tracking-wide block">
            foody
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2C2724] tracking-tight font-display mt-1">
            Meet Our Best Team
          </h2>
          <div className="w-14 h-1 bg-[#E85B43] rounded-full mx-auto mt-3" />
        </div>

        {/* 4 Chef Cards in rounded light containers matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {CHEFS_DATA.map((chef, idx) => (
            <motion.div
              key={chef.id}
              whileHover={{ y: -6 }}
              onClick={() => setSelectedChef(chef)}
              className="flex flex-col items-center cursor-pointer group"
            >
              {/* Light Gray Curved Rectangular Container matching screenshot */}
              <div className="w-full aspect-[4/5] rounded-[32px] bg-[#EFECE6] overflow-hidden p-3 shadow-sm border border-[#E5E0D8] group-hover:border-[#E85B43]/40 group-hover:shadow-xl transition-all relative flex items-end justify-center">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="w-full h-full object-cover rounded-[26px] group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Subtle hover badge */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-[26px] flex items-center justify-center m-3">
                  <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-[#2C2724] shadow-md">
                    View Culinary Profile
                  </span>
                </div>
              </div>

              {/* Chef Name & Role matching screenshot */}
              <h3 className="text-lg font-extrabold text-[#2C2724] mt-4 group-hover:text-[#E85B43] transition-colors font-display">
                {chef.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#78716A] font-medium mt-0.5">
                {chef.role}
              </p>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Chef Profile Modal */}
      <AnimatePresence>
        {selectedChef && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#EDE7DD] relative p-6 sm:p-7"
            >
              <button
                onClick={() => setSelectedChef(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-[#F0EAE1] flex items-center justify-center text-[#2C2724]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-5">
                <img
                  src={selectedChef.image}
                  alt={selectedChef.name}
                  className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-[#E85B43]"
                />
                <div>
                  <span className="text-xs font-bold text-[#E85B43] uppercase tracking-wider">
                    {selectedChef.role}
                  </span>
                  <h3 className="text-2xl font-black text-[#2C2724] font-display">
                    {selectedChef.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#78716A]">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{selectedChef.experienceYears}+ Years Master Experience</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-[#57514B]">
                <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EFECE6]">
                  <p className="text-xs font-bold text-[#2C2724] mb-1 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#E85B43]" />
                    Culinary Specialty
                  </p>
                  <p className="text-xs text-[#6B655F]">{selectedChef.specialty}</p>
                </div>

                <p className="leading-relaxed text-xs sm:text-sm">
                  {selectedChef.bio}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F0EAE1] flex justify-end">
                <button
                  onClick={() => setSelectedChef(null)}
                  className="px-6 py-2.5 bg-[#E85B43] text-white text-xs font-bold rounded-full hover:bg-[#D44730]"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
