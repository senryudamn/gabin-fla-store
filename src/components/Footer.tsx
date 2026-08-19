import React from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_ASSETS } from '../data/mockData';
import { Heart, Sparkles, MapPin, Phone, Instagram, Send, ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setView } = useApp();

  return (
    <footer className="bg-[#2B1B12] text-[#E0D0C4] border-t border-[#3D281D] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl overflow-hidden bg-white/10 p-1 border border-white/20 flex-shrink-0">
                <img
                  src={BRAND_ASSETS.logo}
                  alt="Gabin Isi Fla Logo"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover rounded-xl"
                />
              </div>
              <div>
                <span className="font-['Playfair_Display',serif] text-2xl font-bold text-white tracking-tight">
                  Gabin Isi Fla
                </span>
                <p className="text-xs text-[#B59C8B]">Artisanal Homemade Goodness</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#B59C8B] leading-relaxed max-w-sm">
              Camilan gabin klasik bertopping gula kristal berpadu dengan kelembutan isian custard fla aneka rasa khas nusantara dan modern. Dibuat fresh setiap hari dengan bahan-bahan halal berkualitas tinggi.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors"
                title="Instagram @gabin_isifla"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/6282311724554"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/30 flex items-center justify-center text-white transition-colors"
                title="WhatsApp Hotline"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Menu Navigasi
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#B59C8B]">
              <li>
                <a href="#hero-section" className="hover:text-white transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#story-section" className="hover:text-white transition-colors">
                  Cerita Gabin Fla
                </a>
              </li>
              <li>
                <a href="#flavors-section" className="hover:text-white transition-colors">
                  Daftar Varian Rasa
                </a>
              </li>
              <li>
                <a href="#partnership-section" className="hover:text-white text-[#FFAE66] font-semibold transition-colors">
                  Kemitraan Toko, Kedai, Angkringan & Cafe
                </a>
              </li>
              <li>
                <a href="#order-section" className="hover:text-white transition-colors">
                  Formulir Pesan Online
                </a>
              </li>
              <li>
                <a href="#locations-section" className="hover:text-white transition-colors">
                  Lokasi Pick-up Cabang
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Dapur Pusat & Info */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Dapur Pusat & Hotline
            </h4>
            <div className="space-y-2.5 text-xs text-[#B59C8B]">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#E88C38] flex-shrink-0 mt-0.5" />
                <span>Jl. Faridan M Noto No. 12, Kotabaru, Kota Yogyakarta</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#E88C38] flex-shrink-0" />
                <span>Hotline: +62 812-3456-7890</span>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>100% Menggunakan Bahan Halal & Higienis</span>
              </p>
            </div>

            <div className="pt-3">
              <button
                id="footer-admin-btn"
                type="button"
                onClick={() => setView('admin-login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#D5C2B5] transition-colors"
              >
                <Lock className="h-3 w-3 text-[#E88C38]" />
                <span>Portal Admin & CMS Dapur</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C7465]">
          <p>© {new Date().getFullYear()} Gabin Isi Fla. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> untuk pecinta kuliner tradisional.
          </p>
        </div>
      </div>
    </footer>
  );
};
