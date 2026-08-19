import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, PackageCheck, RotateCcw, Plus, ArrowRight, ShoppingBag, Gift, AlertCircle, CheckCircle2 } from 'lucide-react';

export const BoxBuilder: React.FC = () => {
  const {
    flavors,
    cart,
    addToCart,
    updateCartQuantity,
    clearCart,
    selectedFlavorCount,
    canAddFlavor,
    calculateOrderPricing,
    showToast,
    setIsCartOpen,
  } = useApp();

  const pricing = calculateOrderPricing(cart);

  // Flatten cart into individual pieces for the visual box (e.g. 10 slots per box)
  const allPieces: { flavorId: string; flavorName: string; color: string; image: string }[] = [];
  cart.forEach((item) => {
    const flavor = flavors.find((f) => f.id === item.flavorId);
    if (flavor && item.quantity > 0) {
      for (let i = 0; i < item.quantity; i++) {
        allPieces.push({
          flavorId: flavor.id,
          flavorName: flavor.name,
          color: flavor.flaColorHex,
          image: flavor.image,
        });
      }
    }
  });

  const totalPcs = allPieces.length;
  const currentBoxCapacity = Math.max(10, Math.ceil(totalPcs / 10) * 10 || 10);
  const slots = Array.from({ length: currentBoxCapacity });

  // Quick preset packs (STRICTLY MAX 2 FLAVORS PER BOX)
  const applyPreset = (presetName: string, presetItems: { [flavorId: string]: number }) => {
    clearCart();
    // Allow state to clear before adding
    setTimeout(() => {
      Object.entries(presetItems).forEach(([id, qty]) => {
        addToCart(id, qty);
      });
      showToast(`Paket "${presetName}" berhasil dimasukkan ke kotak!`, 'success');
    }, 50);
  };

  const removeSinglePieceAtIndex = (index: number) => {
    const piece = allPieces[index];
    if (!piece) return;
    const cartItem = cart.find((c) => c.flavorId === piece.flavorId);
    if (cartItem) {
      updateCartQuantity(piece.flavorId, cartItem.quantity - 1);
    }
  };

  return (
    <section id="box-builder-section" className="py-12 sm:py-16 bg-gradient-to-b from-[#FFFDF9] via-[#FFF6EB] to-[#FFF9F2] border-y border-[#F0DDCF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E88C38]/15 border border-[#E88C38]/30 px-4 py-1.5 text-xs font-bold text-[#C46A18] uppercase tracking-wider">
            <Gift className="h-4 w-4" />
            Interactive Box Builder
          </div>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2F1C11] tracking-tight">
            Susun Kotak Gabin Fla Anda
          </h2>
          <p className="text-[#695244] text-sm sm:text-base">
            Isi slot kotak pesanan secara visual dengan varian rasa favorit Anda. Minimal 10 pcs per kotak.
          </p>

          {/* 2-Flavor Rule Highlight Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFF1E5] border border-[#FAD0B0] text-xs font-bold text-[#9C4B08] shadow-2xs">
            <AlertCircle className="h-4 w-4 text-[#E88C38] flex-shrink-0" />
            <span>
              <strong>Aturan Kotak:</strong> 1 Kotak maksimal memilih <strong>2 Varian Rasa</strong> (misal: 5 Vanilla + 5 Robusta, atau 10 rasa sama).
            </span>
          </div>
        </div>

        {/* Quick Presets Ribbon (Compliant with 2-Flavor Rule) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="text-xs font-bold text-[#8A7160] mr-1">Rekomendasi Paket 2 Rasa:</span>
          <button
            type="button"
            onClick={() =>
              applyPreset('Best Seller Mix (5 Vanilla + 5 Robusta)', {
                'classic-vanilla': 5,
                'espresso-blend': 5,
              })
            }
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF0E6] border border-[#ECD3BC] text-xs font-bold text-[#4A3324] shadow-2xs transition-all hover:scale-102 cursor-pointer"
          >
            🔥 Best Seller (5 Vanilla + 5 Robusta)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset('Sweet Berry Mix (5 Red Velvet + 5 Mixed Berry)', {
                'red-velvet': 5,
                'mixed-berry': 5,
              })
            }
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF0E6] border border-[#ECD3BC] text-xs font-bold text-[#4A3324] shadow-2xs transition-all hover:scale-102 cursor-pointer"
          >
            🍓 Sweet Berry (5 Red Velvet + 5 Berry)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset('Matcha & Vanilla (5 Kyoto Matcha + 5 Vanilla)', {
                'kyoto-matcha': 5,
                'classic-vanilla': 5,
              })
            }
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF0E6] border border-[#ECD3BC] text-xs font-bold text-[#4A3324] shadow-2xs transition-all hover:scale-102 cursor-pointer"
          >
            🍵 Kyoto Matcha & Vanilla (5 + 5)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset('Full Vanilla Custard (10 Pcs)', {
                'classic-vanilla': 10,
              })
            }
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF0E6] border border-[#ECD3BC] text-xs font-bold text-[#4A3324] shadow-2xs transition-all hover:scale-102 cursor-pointer"
          >
            ✨ 10 Pcs Full Vanilla
          </button>
        </div>

        {/* Main Interactive Visual Box Container */}
        <div className="bg-white rounded-3xl border-2 border-[#E5CEBA] p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Card Corner Tape Decors */}
          <div className="absolute -top-3 left-10 w-24 h-6 bg-[#E88C38]/20 -rotate-2 rounded-sm pointer-events-none" />
          <div className="absolute -top-3 right-10 w-24 h-6 bg-[#E88C38]/20 rotate-3 rounded-sm pointer-events-none" />

          {/* Box Header Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F2E2D2]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[#FFF3E6] border border-[#FAD8BD] flex items-center justify-center text-[#C46A18] font-bold shadow-2xs">
                <PackageCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-['Playfair_Display',serif] text-xl sm:text-2xl font-black text-[#321F13]">
                    Kotak Pesanan Artisanal
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      totalPcs >= 10
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {totalPcs >= 10 ? 'Siap Dipesan' : `Kurang ${10 - totalPcs} Pcs`}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4EDE4] text-[#594233] border border-[#E3D4C4]">
                    Varian: {selectedFlavorCount}/2 Rasa
                  </span>
                </div>
                <p className="text-xs text-[#8A7160]">
                  Terisi: <strong className="text-[#C46A18] font-black">{totalPcs}</strong> dari minimal 10 pcs
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {totalPcs > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Kosongkan Kotak</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('order-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                disabled={totalPcs < 10}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                  totalPcs >= 10
                    ? 'bg-[#E88C38] hover:bg-[#D57924] text-white hover:scale-102 cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <span>Konfirmasi Isi Kotak</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* VISUAL 10-SLOT BOX GRID */}
          <div className="py-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-[#FFF8F0] border-2 border-dashed border-[#E3C8B2]">
              {slots.map((_, index) => {
                const piece = allPieces[index];

                return (
                  <div
                    key={index}
                    id={`box-slot-${index}`}
                    onClick={() => piece && removeSinglePieceAtIndex(index)}
                    className={`relative aspect-square rounded-2xl border-2 transition-all flex flex-col items-center justify-center p-2 text-center group ${
                      piece
                        ? 'bg-white border-[#E88C38] shadow-md hover:scale-105 cursor-pointer hover:border-rose-400'
                        : 'bg-white/40 border-dashed border-[#DFC8B4] text-[#A68F80]'
                    }`}
                    title={piece ? `Klik untuk menghapus ${piece.flavorName} dari slot ${index + 1}` : `Slot ${index + 1} Kosong`}
                  >
                    {/* Slot Number Stamp */}
                    <span className="absolute top-1.5 left-2 text-[10px] font-black opacity-40">
                      #{index + 1}
                    </span>

                    {piece ? (
                      <>
                        <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden shadow-2xs border border-[#ECD3BC] mb-1">
                          <img
                            src={piece.image}
                            alt={piece.flavorName}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                          {/* Fla Color Dot */}
                          <div
                            className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: piece.color }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[#321F13] leading-tight line-clamp-1">
                          {piece.flavorName.split(' ')[0]}
                        </span>
                        {/* Hover Remove Pill */}
                        <div className="absolute inset-0 bg-rose-900/80 rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 text-[10px] font-bold">
                          <span>Hapus</span>
                          <span className="text-[9px] font-normal opacity-80">dari slot</span>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1">
                        <Plus className="h-5 w-5 mx-auto text-[#C8B09C]" />
                        <span className="text-[10px] font-semibold block text-[#8C7362]">Slot Kosong</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PALETTE OF FLAVORS TO TAP AND ADD TO BOX (RESPECT 2-FLAVOR CONSTRAINT) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-[#321F13] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#E88C38]" />
                <span>Pilih Varian (Maks. 2 Rasa per Kotak):</span>
              </h4>
              <span className="text-xs text-[#8A7160]">
                {selectedFlavorCount < 2 ? (
                  <span className="text-emerald-700 font-semibold">Bisa tambah 1 rasa lagi</span>
                ) : (
                  <span className="text-amber-800 font-semibold">Batas 2 rasa aktif tercapai</span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {flavors.map((flavor) => {
                const isAllowed = canAddFlavor(flavor.id);
                const currentQty = cart.find((c) => c.flavorId === flavor.id)?.quantity || 0;

                return (
                  <button
                    key={flavor.id}
                    id={`box-add-flavor-${flavor.id}`}
                    type="button"
                    onClick={() => {
                      if (!isAllowed) {
                        showToast(
                          'Satu kotak maksimal 2 varian rasa. Hapus salah satu varian yang ada jika ingin memilih rasa ini.',
                          'warning'
                        );
                        return;
                      }
                      addToCart(flavor.id, 1);
                    }}
                    className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center relative group ${
                      isAllowed
                        ? 'bg-white hover:bg-[#FFF5EB] border-[#ECD7C4] hover:border-[#E88C38] shadow-2xs hover:shadow-md active:scale-95 cursor-pointer'
                        : 'bg-[#F9F6F0] border-[#E8DFC9] opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Selected Count Indicator Badge */}
                    {currentQty > 0 && (
                      <span className="absolute top-2 right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E88C38] text-white px-1 text-[10px] font-black shadow-xs">
                        {currentQty}
                      </span>
                    )}

                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-[#ECD3BC] mb-2 group-hover:scale-105 transition-transform">
                      <img
                        src={flavor.image}
                        alt={flavor.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                      <div
                        className="absolute bottom-1 right-1 h-3 w-3 rounded-full border border-white"
                        style={{ backgroundColor: flavor.flaColorHex }}
                      />
                    </div>

                    <span className="text-xs font-bold text-[#321F13] line-clamp-1 group-hover:text-[#C46A18]">
                      {flavor.name}
                    </span>
                    <span className="text-[11px] font-semibold text-[#C46A18] mt-0.5">
                      Rp {flavor.price.toLocaleString('id-ID')}
                    </span>

                    {isAllowed ? (
                      <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF3E6] text-[#C46A18] group-hover:bg-[#E88C38] group-hover:text-white transition-colors">
                        + Tambah 1 Pcs
                      </span>
                    ) : (
                      <span className="mt-2 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-600">
                        Batas 2 Rasa
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing & Progress Bar Footer */}
          <div className="mt-6 pt-4 border-t border-[#F0DFD1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#3B281B]">
                  Subtotal: Rp {pricing.subtotal.toLocaleString('id-ID')}
                </span>
                {pricing.discount > 0 && (
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Hemat Rp {pricing.discount.toLocaleString('id-ID')} ({pricing.discountNote})
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8C7362]">
                Total: <strong className="text-sm font-black text-[#C46A18]">Rp {pricing.total.toLocaleString('id-ID')}</strong> (DP 50%: Rp {pricing.dp.toLocaleString('id-ID')})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-[#ECD3BC] bg-white hover:bg-[#FFF5EB] font-bold text-[#4A3324] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4 text-[#E88C38]" />
                <span>Lihat Keranjang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
