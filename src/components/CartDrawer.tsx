import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    flavors,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    selectedFlavorCount,
    cartTotalPcs,
    cartSubtotal,
    cartDiscount,
    cartDiscountNote,
    cartTotal,
    cartDp,
    cartRemaining,
  } = useApp();

  if (!isCartOpen) return null;

  const isMinimumMet = cartTotalPcs >= 10;
  const pcsToMin = Math.max(0, 10 - cartTotalPcs);

  const proceedToCheckout = () => {
    setIsCartOpen(false);
    const el = document.getElementById('order-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] border-l border-[#ECD9C7] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-[#F0DDD0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#FFF3E6] border border-[#FAD8BD] flex items-center justify-center text-[#C46A18]">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#3B281B] text-base">Keranjang Kotak</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF2E5] text-[#C46A18] border border-[#F5D8BF]">
                    {selectedFlavorCount}/2 Rasa
                  </span>
                </div>
                <p className="text-xs text-[#8C7362]">{cartTotalPcs} pcs gabin dipilih</p>
              </div>
            </div>

            <button
              id="close-cart-drawer-btn"
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-[#7A6455] hover:bg-[#FFF5EB] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body Items */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-[#FFF5EB] border border-[#F7DFC9] flex items-center justify-center text-[#C46A18]">
                  <ShoppingBag className="h-8 w-8 opacity-60" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-[#3B281B] text-base">Keranjang Anda Kosong</h4>
                  <p className="text-xs text-[#8C7362] max-w-xs mx-auto">
                    Yuk susun kotak gabin fla favoritmu. Satu kotak dapat memuat maksimal 2 varian rasa (minimal 10 pcs).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    const el = document.getElementById('box-builder-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#E88C38] text-white font-bold text-xs shadow-md hover:bg-[#D57924] transition-all cursor-pointer"
                >
                  Susun Kotak Gabin
                </button>
              </div>
            ) : (
              <>
                {/* 2-Flavor Rule & Minimum Pcs Notification */}
                <div className="space-y-2">
                  <div
                    className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${
                      isMinimumMet
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    }`}
                  >
                    {isMinimumMet ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <span className="font-bold">
                        {isMinimumMet
                          ? 'Memenuhi syarat minimal 10 pcs!'
                          : `Kurang ${pcsToMin} pcs lagi untuk batas minimal.`}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FFF6EE] border border-[#FAD8BD] text-[11px] text-[#8C4F1B] flex items-center justify-between">
                    <span>Aturan: Maksimal 2 Varian Rasa per Kotak</span>
                    <span className="font-bold">{selectedFlavorCount}/2 Terisi</span>
                  </div>
                </div>

                {/* List of Cart Items */}
                <div className="space-y-3">
                  {cart.map((item) => {
                    const flavor = flavors.find((f) => f.id === item.flavorId);
                    if (!flavor || item.quantity <= 0) return null;

                    return (
                      <div
                        key={item.flavorId}
                        className="p-3 bg-white rounded-2xl border border-[#F2E4D8] flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <img
                          src={flavor.image}
                          alt={flavor.name}
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 rounded-xl object-cover border border-[#ECD3BC] flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#3B281B] truncate">
                            {flavor.name}
                          </h4>
                          <p className="text-[11px] text-[#8C7362]">
                            Rp {flavor.price.toLocaleString('id-ID')} / pcs
                          </p>
                          <p className="text-xs font-bold text-[#C46A18] mt-0.5">
                            Rp {(flavor.price * item.quantity).toLocaleString('id-ID')}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(flavor.id, item.quantity - 1)}
                            className="h-7 w-7 rounded-lg bg-[#FAF0E6] text-[#3B281B] flex items-center justify-center font-bold hover:bg-[#F5E2D2] transition-colors cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#3B281B]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(flavor.id, item.quantity + 1)}
                            className="h-7 w-7 rounded-lg bg-[#E88C38] text-white flex items-center justify-center font-bold hover:bg-[#D57924] transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(flavor.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors ml-1 cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] text-stone-400 hover:text-rose-500 font-semibold flex items-center gap-1 mx-auto pt-1 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  Kosongkan Kotak
                </button>
              </>
            )}
          </div>

          {/* Drawer Footer / Pricing Summary */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-[#F0DDD0] space-y-3.5 shadow-lg">
              <div className="space-y-1.5 text-xs text-[#6B5242]">
                <div className="flex justify-between">
                  <span>Subtotal ({cartTotalPcs} pcs):</span>
                  <span className="font-semibold text-[#3B281B]">
                    Rp {cartSubtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md">
                    <span>Diskon Promo:</span>
                    <span>- Rp {cartDiscount.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-extrabold text-[#321F13] pt-1 border-t border-[#F2E4D8]">
                  <span>Total Harga:</span>
                  <span className="text-[#C46A18] font-black">
                    Rp {cartTotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] font-semibold text-[#8A7160] pt-1">
                  <span>DP 50% untuk Produksi:</span>
                  <span className="text-[#3B281B] font-bold">
                    Rp {cartDp.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                id="drawer-checkout-btn"
                type="button"
                onClick={proceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-[#E88C38] hover:bg-[#D57924] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-98 transition-all cursor-pointer"
              >
                <span>Lanjut Isi Formulir Pesanan</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
