import React from 'react';
import { BRAND_ASSETS } from '../data/mockData';
import { Flame, Star, CheckCircle2, Award, Clock } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section id="story-section" className="py-12 sm:py-16 bg-[#FFF9F2] border-y border-[#F3E2D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Image with overlay and floating tag */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-[#F7ECE1]">
              <img
                src={BRAND_ASSETS.storyHero}
                alt="Sepiring Gabin Fla Lezat"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Image Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#ECD9C7] shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#E88C38]/20 flex items-center justify-center text-[#C46A18] font-bold">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#3B281B]">Resep Warisan Nusantara</h4>
                    <p className="text-[11px] text-[#7A6455]">Sentuhan Custard Modern Aneka Varian</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>4.9 / 5.0</span>
                </div>
              </div>
            </div>

            {/* Corner Decorative Badge */}
            <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 rounded-2xl bg-[#3B281B] text-white px-4 py-2.5 shadow-lg">
              <Flame className="h-4 w-4 text-[#F5B056]" />
              <span className="text-xs font-bold">Garing di Luar, Lumer di Dalam</span>
            </div>
          </div>

          {/* Right Column: Story & Craft Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C46A18]">
                Kenikmatan Autentik
              </span>
              <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-extrabold text-[#2F1C11] tracking-tight">
                Apa itu Gabin Isi Fla?
              </h2>
            </div>

            <p className="text-[#634E41] text-base leading-relaxed">
              <strong className="text-[#362115]">Gabin Fla</strong> adalah camilan tradisional legendaris Indonesia yang terdiri dari dua lapis biskuit crackers (gabin) manis gurih, diapit dengan isian adonan <strong className="text-[#362115]">fla susu kental manis nan lembut</strong>, lalu digoreng atau dipanggang dengan suhu presisi hingga berwarna keemasan.
            </p>

            <p className="text-[#634E41] text-base leading-relaxed">
              Di dapur artisanal kami, kami mengangkat kelezatan jajanan klasik ini dengan menggunakan 
              <strong className="text-[#C46A18]"> susu murni segar, butter premium, dan bubuk sari rasa asli</strong> (seperti Uji Matcha dari Kyoto, Kopi Robusta sangrai lokal, dan dark chocolate Belgia).
            </p>

            {/* 3 Pillars List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#EFE0D3] shadow-2xs">
                <CheckCircle2 className="h-5 w-5 text-[#E88C38] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#3B281B]">Biskuit Renyah Berkilau Gula</h4>
                  <p className="text-xs text-[#7A6455]">Tekstur garing memuaskan saat pertama kali digigit tanpa minyak berlebih.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#EFE0D3] shadow-2xs">
                <CheckCircle2 className="h-5 w-5 text-[#E88C38] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#3B281B]">Fla Custard Super Creamy & Padat</h4>
                  <p className="text-xs text-[#7A6455]">Isian fla tebal, tidak mudah bocor, manis pas, dan lumer lembut di lidah.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#EFE0D3] shadow-2xs">
                <CheckCircle2 className="h-5 w-5 text-[#E88C38] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#3B281B]">Freshly Made Sesuai Jadwal Pick-up</h4>
                  <p className="text-xs text-[#7A6455]">Diproduksi pada hari pengambilan untuk menjamin kualitas terbaik.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
