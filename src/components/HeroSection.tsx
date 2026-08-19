import React from 'react';
import { Interactive3DGabin } from './Interactive3DGabin';
import { ArrowRight, Sparkles, Heart, ShieldCheck, Clock, PackageCheck, Flame } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToBoxBuilder = () => {
    const el = document.getElementById('box-builder-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFlavors = () => {
    const el = document.getElementById('flavors-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero-section" className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 overflow-hidden">
      {/* Background Subtle Warm Ornaments */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#FFE9D4]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#FFF0E0]/60 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline & Value Propositions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Live Oven Batch Banner */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF3E6] border border-[#FCDDBF] px-4 py-1.5 shadow-2xs">
              <Flame className="h-4 w-4 text-[#E88C38] animate-bounce" />
              <span className="text-xs font-bold text-[#C46A18]">
                Batch Pagi Fresh: Siap Pick-up Hari Ini
              </span>
            </div>

            {/* Main Display Headline */}
            <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl xl:text-6xl font-extrabold text-[#2F1C11] tracking-tight leading-[1.15]">
              Sensasi Renyah Gabin,{' '}
              <span className="text-[#C46A18] italic underline decoration-[#FAD082] decoration-wavy decoration-2">
                Fla Lembut Lumer
              </span>{' '}
              di Setiap Gigitan.
            </h1>

            {/* Description */}
            <p className="text-[#695244] text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Dibuat fresh setiap hari dengan biskuit malkist keemasan bertabur gula kristal dan isian fla custard artisanal aneka rasa. 
              Camilan klasik legendaris yang ditingkatkan ke level rasa modern premium.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="hero-cta-box-builder"
                type="button"
                onClick={scrollToBoxBuilder}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#E88C38] hover:bg-[#D57924] text-white px-7 py-4 text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <PackageCheck className="h-5 w-5" />
                <span>Susun Kotak 10 Pcs</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                id="hero-cta-browse-flavors"
                type="button"
                onClick={scrollToFlavors}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[#ECD3BC] bg-white hover:bg-[#FFF5EB] text-[#4A3324] px-6 py-4 text-base font-bold transition-all shadow-xs"
              >
                <span>Lihat Varian Menu</span>
              </button>
            </div>

            {/* Feature Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#F0DDD0]/80">
              <div className="flex items-center gap-2 text-left">
                <div className="h-8 w-8 rounded-xl bg-[#FFF3E6] border border-[#FBD6B7] flex items-center justify-center text-[#C46A18] flex-shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#3B281B]">Fresh Oven</p>
                  <p className="text-[11px] text-[#8C7362]">Panggang tiap hari</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-left">
                <div className="h-8 w-8 rounded-xl bg-[#FFF3E6] border border-[#FBD6B7] flex items-center justify-center text-[#C46A18] flex-shrink-0">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#3B281B]">Min. 10 Pcs</p>
                  <p className="text-[11px] text-[#8C7362]">Bebas mix rasa</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-left col-span-2 sm:col-span-1">
                <div className="h-8 w-8 rounded-xl bg-[#FFF3E6] border border-[#FBD6B7] flex items-center justify-center text-[#C46A18] flex-shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#3B281B]">100% Halal</p>
                  <p className="text-[11px] text-[#8C7362]">Bahan higienis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Gabin Showcase */}
          <div className="lg:col-span-6 w-full">
            <Interactive3DGabin />
          </div>
        </div>
      </div>
    </section>
  );
};
