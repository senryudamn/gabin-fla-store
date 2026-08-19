import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_ASSETS } from '../data/mockData';
import { ShoppingBag, Lock, ShieldCheck, Menu, X, Sparkles, MapPin, Coffee, Utensils, Store } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cartTotalPcs, setIsCartOpen, view, setView, adminUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (view !== 'store') {
      setView('store');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F0DFD1] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div
          id="navbar-brand-logo"
          onClick={() => scrollToSection('hero-section')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden bg-[#FFF5EB] border border-[#ECD3BC] shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
            <img
              src={BRAND_ASSETS.logo}
              alt="Gabin Isi Fla Logo"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Playfair_Display',serif] text-xl sm:text-2xl font-black text-[#362115] tracking-tight group-hover:text-[#C46A18] transition-colors">
                Gabin Isi Fla
              </span>
              <span className="hidden sm:inline-flex items-center gap-0.5 rounded-full bg-[#E88C38]/15 px-2 py-0.5 text-[10px] font-bold text-[#C46A18]">
                <Sparkles className="h-3 w-3" />
                Artisanal
              </span>
            </div>
            <p className="text-xs text-[#8A7160] font-medium hidden sm:block">
              Homemade Goodness • Lumer di Setiap Gigitan
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#5A4335]">
          <button
            id="nav-link-box-builder"
            onClick={() => scrollToSection('box-builder-section')}
            className="hover:text-[#C46A18] transition-colors py-1 flex items-center gap-1.5 text-[#C46A18] bg-[#FFF2E5] px-3 py-1.5 rounded-xl border border-[#F5D8BF] shadow-2xs font-bold"
          >
            <Sparkles className="h-4 w-4 text-[#E88C38]" />
            Susun Kotak 10 Pcs
          </button>
          <button
            id="nav-link-flavors"
            onClick={() => scrollToSection('flavors-section')}
            className="hover:text-[#C46A18] transition-colors py-1 flex items-center gap-1.5"
          >
            <Coffee className="h-4 w-4 text-[#E88C38]" />
            Varian Menu
          </button>
          <button
            id="nav-link-story"
            onClick={() => scrollToSection('story-section')}
            className="hover:text-[#C46A18] transition-colors py-1 flex items-center gap-1.5"
          >
            <Utensils className="h-4 w-4 text-[#E88C38]" />
            Cerita Rasa
          </button>
          <button
            id="nav-link-order"
            onClick={() => scrollToSection('order-section')}
            className="hover:text-[#C46A18] transition-colors py-1"
          >
            Formulir Pesanan
          </button>
          <button
            id="nav-link-partnership"
            onClick={() => scrollToSection('partnership-section')}
            className="hover:text-[#C46A18] transition-colors py-1 flex items-center gap-1.5"
          >
            <Store className="h-4 w-4 text-[#E88C38]" />
            Kemitraan Toko & Cafe
          </button>
          <button
            id="nav-link-locations"
            onClick={() => scrollToSection('locations-section')}
            className="hover:text-[#C46A18] transition-colors py-1 flex items-center gap-1.5"
          >
            <MapPin className="h-4 w-4 text-[#E88C38]" />
            Lokasi Cabang
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Cart Button */}
          <button
            id="open-cart-button"
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-2xl bg-[#E88C38] hover:bg-[#D57924] text-white px-3.5 sm:px-4 py-2.5 font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Keranjang</span>
            {cartTotalPcs > 0 && (
              <span
                id="cart-badge-count"
                className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-[#C46A18] px-1 text-xs font-black shadow-xs animate-bounce"
              >
                {cartTotalPcs}
              </span>
            )}
          </button>

          {/* Admin Switcher */}
          {adminUser ? (
            <button
              id="nav-admin-dashboard-btn"
              type="button"
              onClick={() => setView(view === 'admin-dashboard' ? 'store' : 'admin-dashboard')}
              className="flex items-center gap-1.5 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-800 px-3 py-2 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-xs"
              title="Portal Admin Aktif"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="hidden lg:inline">{view === 'admin-dashboard' ? 'Ke Toko' : 'Dashboard CMS'}</span>
            </button>
          ) : (
            <button
              id="nav-admin-login-btn"
              type="button"
              onClick={() => setView(view === 'admin-login' ? 'store' : 'admin-login')}
              className="flex items-center gap-1.5 rounded-2xl border border-[#ECD3BC] bg-white/80 hover:bg-[#FFF5EB] text-[#6B513F] px-3 py-2 text-xs font-bold transition-colors shadow-xs"
              title="Masuk ke Portal Admin CMS"
            >
              <Lock className="h-3.5 w-3.5 text-[#A6826B]" />
              <span className="hidden lg:inline">Admin CMS</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#5A4335] hover:bg-[#FFF5EB] transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#F0DFD1] bg-[#FFFDF9] px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <button
            onClick={() => scrollToSection('box-builder-section')}
            className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-[#C46A18] bg-[#FFF2E5] flex items-center gap-2 border border-[#F5D8BF]"
          >
            <Sparkles className="h-4 w-4 text-[#E88C38]" />
            Susun Kotak Gabin 10 Pcs
          </button>
          <button
            onClick={() => scrollToSection('flavors-section')}
            className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-[#5A4335] hover:bg-[#FFF2E5] flex items-center gap-2"
          >
            <Coffee className="h-4 w-4 text-[#E88C38]" />
            Varian Menu & Harga
          </button>
          <button
            onClick={() => scrollToSection('story-section')}
            className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-[#5A4335] hover:bg-[#FFF2E5] flex items-center gap-2"
          >
            <Utensils className="h-4 w-4 text-[#E88C38]" />
            Cerita Rasa Gabin Fla
          </button>
          <button
            onClick={() => scrollToSection('order-section')}
            className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-[#5A4335] hover:bg-[#FFF2E5] flex items-center gap-2"
          >
            Formulir Pesan WhatsApp
          </button>
          <button
            onClick={() => scrollToSection('partnership-section')}
            className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-[#5A4335] hover:bg-[#FFF2E5] flex items-center gap-2"
          >
            <Store className="h-4 w-4 text-[#E88C38]" />
            Kemitraan Toko, Kedai, Angkringan & Cafe
          </button>
          <button
            onClick={() => scrollToSection('locations-section')}
            className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-[#5A4335] hover:bg-[#FFF2E5] flex items-center gap-2"
          >
            <MapPin className="h-4 w-4 text-[#E88C38]" />
            Lokasi Pick-up Cabang
          </button>
          <div className="pt-2 border-t border-[#F5E6D8] flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setView(adminUser ? 'admin-dashboard' : 'admin-login');
              }}
              className="text-xs font-bold text-[#8A7160] hover:text-[#362115] flex items-center gap-1.5 py-1"
            >
              <Lock className="h-3.5 w-3.5" />
              {adminUser ? 'Buka Dashboard CMS' : 'Login Admin Dapur'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
