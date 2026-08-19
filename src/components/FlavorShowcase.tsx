import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flavor } from '../types';
import { Plus, Minus, Eye, Sparkles, ShoppingBag, Check, Flame, Award, AlertCircle } from 'lucide-react';

export const FlavorShowcase: React.FC = () => {
  const { flavors, addToCart, cart, updateCartQuantity, setPreviewFlavorId, canAddFlavor, selectedFlavorCount, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'classic' | 'premium' | 'special'>('all');

  const filteredFlavors = flavors.filter((f) => {
    if (selectedCategory === 'all') return true;
    return f.category === selectedCategory;
  });

  const getCartQuantity = (flavorId: string) => {
    const item = cart.find((c) => c.flavorId === flavorId);
    return item ? item.quantity : 0;
  };

  const inspectIn3D = (flavorId: string) => {
    setPreviewFlavorId(flavorId);
    const el = document.getElementById('interactive-3d-experience');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="flavors-section" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E6] border border-[#FCDDBF] px-3.5 py-1 text-xs font-bold text-[#C46A18] uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          Pilihan Varian Rasa
        </div>
        <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2F1C11] tracking-tight">
          Varian Menu & Harga
        </h2>
        <p className="text-[#6B5242] text-sm sm:text-base">
          Pilih rasa favoritmu. Satu kotak dapat memuat kombinasi maksimal <strong>2 varian rasa</strong> (minimal 10 pcs per box).
        </p>

        {/* 2-Flavor Rule Note */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF6EE] border border-[#FAD8BD] text-xs font-semibold text-[#8C4F1B]">
          <AlertCircle className="h-4 w-4 text-[#E88C38]" />
          <span>Varian Aktif di Kotak: <strong>{selectedFlavorCount}/2 Rasa</strong></span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
          <button
            id="filter-flavor-all"
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#3B281B] text-white shadow-md'
                : 'bg-white text-[#664F40] border border-[#ECD7C4] hover:bg-[#FFF5EB]'
            }`}
          >
            Semua Varian ({flavors.length})
          </button>
          <button
            id="filter-flavor-classic"
            type="button"
            onClick={() => setSelectedCategory('classic')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === 'classic'
                ? 'bg-[#3B281B] text-white shadow-md'
                : 'bg-white text-[#664F40] border border-[#ECD7C4] hover:bg-[#FFF5EB]'
            }`}
          >
            Classic Custard
          </button>
          <button
            id="filter-flavor-premium"
            type="button"
            onClick={() => setSelectedCategory('premium')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === 'premium'
                ? 'bg-[#3B281B] text-white shadow-md'
                : 'bg-white text-[#664F40] border border-[#ECD7C4] hover:bg-[#FFF5EB]'
            }`}
          >
            Premium Roasts
          </button>
          <button
            id="filter-flavor-special"
            type="button"
            onClick={() => setSelectedCategory('special')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === 'special'
                ? 'bg-[#3B281B] text-white shadow-md'
                : 'bg-white text-[#664F40] border border-[#ECD7C4] hover:bg-[#FFF5EB]'
            }`}
          >
            Special Signatures
          </button>
        </div>
      </div>

      {/* Flavors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredFlavors.map((flavor) => {
          const qtyInCart = getCartQuantity(flavor.id);
          const isAllowed = canAddFlavor(flavor.id);

          return (
            <div
              key={flavor.id}
              id={`flavor-card-${flavor.id}`}
              className="bg-white rounded-3xl border border-[#ECD9C8] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Card Image Cover with Fla Color Tag */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-[#FFF5EB]">
                <img
                  src={flavor.image}
                  alt={flavor.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {flavor.badge && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E88C38] text-white px-3 py-1 text-xs font-black shadow-md uppercase tracking-wider">
                      <Flame className="h-3.5 w-3.5" />
                      {flavor.badge}
                    </span>
                  )}
                  {flavor.isPopular && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#3B281B] text-[#F8E3D2] px-2.5 py-0.5 text-[10px] font-bold shadow-xs">
                      <Award className="h-3 w-3 text-[#E88C38]" />
                      Favorit Dapur
                    </span>
                  )}
                </div>

                {/* Inspect in 3D Action */}
                <button
                  id={`inspect-3d-${flavor.id}`}
                  type="button"
                  onClick={() => inspectIn3D(flavor.id)}
                  className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white text-[#3B281B] p-2.5 shadow-md backdrop-blur-xs transition-all hover:scale-110 flex items-center gap-1 text-xs font-bold cursor-pointer"
                  title="Lihat Struktur & Tekstur 3D"
                >
                  <Eye className="h-4 w-4 text-[#E88C38]" />
                  <span className="hidden sm:inline">3D</span>
                </button>

                {/* Price Pill Ribbon */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 rounded-xl backdrop-blur-2xs">
                  <span className="text-xs font-semibold text-[#FFF3E6]">
                    {flavor.subtitle}
                  </span>
                  <span className="text-base font-black px-2.5 py-0.5 rounded-lg bg-[#E88C38] shadow-xs">
                    Rp {flavor.price.toLocaleString('id-ID')}
                    <span className="text-[11px] font-normal opacity-90">/pcs</span>
                  </span>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#321F13] group-hover:text-[#C46A18] transition-colors">
                      {flavor.name}
                    </h3>
                    <div
                      className="h-4 w-4 rounded-full border border-black/15 flex-shrink-0 shadow-2xs"
                      style={{ backgroundColor: flavor.flaColorHex }}
                      title="Warna Lapisan Fla"
                    />
                  </div>

                  <p className="text-xs sm:text-sm text-[#6E5748] leading-relaxed line-clamp-3">
                    {flavor.description}
                  </p>
                </div>

                {/* Flavor Taste Attributes */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-[#7A6455]">
                    <span className="font-semibold">Tingkat Manis:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <span
                          key={lvl}
                          className={`h-1.5 w-4 rounded-full ${
                            lvl <= flavor.sweetness ? 'bg-[#E88C38]' : 'bg-[#EBDDD2]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#7A6455]">
                    <span className="font-semibold">Creamy / Gurih:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <span
                          key={lvl}
                          className={`h-1.5 w-4 rounded-full ${
                            lvl <= flavor.richness ? 'bg-[#3B281B]' : 'bg-[#EBDDD2]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ingredients Pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {flavor.ingredients.slice(0, 3).map((ing, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[#FFF5EB] text-[#8C6D58] border border-[#F5E2D2] px-2 py-0.5 rounded-md font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                  {flavor.ingredients.length > 3 && (
                    <span className="text-[10px] text-[#A88C78] py-0.5">
                      +{flavor.ingredients.length - 3} lainnya
                    </span>
                  )}
                </div>

                {/* Action Area: Add to Cart / Quantity Stepper */}
                <div className="pt-3 border-t border-[#F0DFD1]">
                  {!flavor.available ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-2xl bg-stone-200 text-stone-500 font-bold text-xs cursor-not-allowed"
                    >
                      Stok Habis Sementara
                    </button>
                  ) : qtyInCart > 0 ? (
                    <div className="flex items-center justify-between bg-[#FFF5EC] border border-[#F5D8BF] p-1.5 rounded-2xl">
                      <button
                        id={`decrease-cart-${flavor.id}`}
                        type="button"
                        onClick={() => updateCartQuantity(flavor.id, qtyInCart - 1)}
                        className="h-8 w-8 rounded-xl bg-white border border-[#ECD3BC] text-[#3B281B] flex items-center justify-center font-bold hover:bg-[#FBECE0] active:scale-95 transition-all cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <div className="text-center px-2">
                        <span className="text-xs font-bold text-[#C46A18]">
                          {qtyInCart} pcs di keranjang
                        </span>
                        <p className="text-[10px] text-[#8A7160]">
                          (Rp {(qtyInCart * flavor.price).toLocaleString('id-ID')})
                        </p>
                      </div>

                      <button
                        id={`increase-cart-${flavor.id}`}
                        type="button"
                        onClick={() => updateCartQuantity(flavor.id, qtyInCart + 1)}
                        className="h-8 w-8 rounded-xl bg-[#E88C38] text-white flex items-center justify-center font-bold hover:bg-[#D57924] active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <button
                        id={`add-to-cart-${flavor.id}`}
                        type="button"
                        onClick={() => {
                          if (!isAllowed) {
                            showToast(
                              'Satu kotak dibatasi maksimal 2 varian rasa. Hapus salah satu varian yang ada terlebih dahulu jika ingin memilih rasa ini.',
                              'warning'
                            );
                            return;
                          }
                          addToCart(flavor.id, 5);
                        }}
                        className={`w-full py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 ${
                          isAllowed
                            ? 'bg-[#E88C38] hover:bg-[#D57924] text-white hover:scale-101 cursor-pointer'
                            : 'bg-stone-100 text-stone-500 border border-stone-200 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>{isAllowed ? '+ Masukkan 5 Pcs' : 'Batas 2 Rasa Tercapai'}</span>
                      </button>

                      {!isAllowed && (
                        <p className="text-[10px] text-center text-amber-800 font-medium">
                          Sudah ada 2 rasa di kotak. Kurangi varian lain untuk memilih rasa ini.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
