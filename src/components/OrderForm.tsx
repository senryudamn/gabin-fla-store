import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  ShoppingCart, Send, Calendar, Clock, MapPin, Sparkles, CheckCircle, 
  Info, Plus, Minus, AlertCircle, Copy, Check, Lightbulb, CreditCard, Handshake, ShieldCheck, X 
} from 'lucide-react';

export const OrderForm: React.FC = () => {
  const {
    flavors,
    locations,
    cart,
    addToCart,
    updateCartQuantity,
    calculateOrderPricing,
    createOrder,
    showToast,
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [pickupLocationId, setPickupLocationId] = useState(locations[0]?.id || 'loc-jogja-pusat');
  
  // Default tomorrow date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(defaultDateStr);
  const [pickupTime, setPickupTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Modal State (DITAMBAHKAN paymentUrl UNTUK DUITKU)
  const [successOrderData, setSuccessOrderData] = useState<{
    orderCode: string;
    whatsappUrl: string;
    total: number;
    dp: number;
    paymentUrl?: string; 
  } | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedDp, setCopiedDp] = useState(false);
  
  // State untuk menyimpan URL QRIS manual dari LocalStorage (Sebagai Fallback/Cadangan)
  const [qrisImageUrl, setQrisImageUrl] = useState("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=GABIN_FLA_QRIS_DUMMY_URL");

  // Ambil data QRIS saat modal sukses terbuka
  useEffect(() => {
    if (successOrderData) {
      const savedQris = localStorage.getItem('GABIN_QRIS_URL');
      if (savedQris) {
        setQrisImageUrl(savedQris);
      }
    }
  }, [successOrderData]);

  const pricing = calculateOrderPricing(cart);
  const isMinimumMet = pricing.totalPcs >= 10;
  const pcsToMin = Math.max(0, 10 - pricing.totalPcs);

  // Next discount milestone calculation
  const nextTenMilestone = Math.ceil(pricing.totalPcs / 10) * 10 || 10;
  const pcsToNextDiscount = nextTenMilestone - pricing.totalPcs;

  // DIUBAH MENJADI ASYNC UNTUK MENGHUBUNGI DUITKU
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast('Mohon masukkan nama lengkap pemesan', 'warning');
      return;
    }

    if (!whatsappNumber.trim() || whatsappNumber.length < 8) {
      showToast('Mohon masukkan nomor WhatsApp yang aktif', 'warning');
      return;
    }

    if (!isMinimumMet) {
      showToast(`Pesanan minimal adalah 10 pcs. Kurang ${pcsToMin} pcs lagi.`, 'error');
      return;
    }

    setIsSubmitting(true);

    // 1. Simpan pesanan ke Firebase
    const result = createOrder({
      customerName,
      whatsappNumber,
      pickupLocationId,
      pickupDate,
      pickupTime,
      notes,
    });

    if (result) {
      let finalPaymentUrl = "";

      try {
        // 2. Tembak API Backend Netlify kita untuk membuat tagihan Duitku
        const response = await fetch('/.netlify/functions/createTransaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: result.order.orderCode,
            grossAmount: result.order.dpAmount, // Nominal tagihan adalah DP 50%
            customerName: customerName,
            phone: whatsappNumber
          })
        });

        const data = await response.json();
        
        if (data.success && data.paymentUrl) {
          finalPaymentUrl = data.paymentUrl;
        } else {
          console.warn("Duitku API Response:", data.error);
        }
      } catch (err) {
        console.error("Gagal menghubungi server pembayaran", err);
      }

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E88C38', '#F5B056', '#3B281B', '#E53E3E', '#38A169'],
        });
      } catch (err) {}

      // 3. Tampilkan Pop-Up Sukses
      setSuccessOrderData({
        orderCode: result.order.orderCode,
        whatsappUrl: result.whatsappUrl,
        total: result.order.totalPrice,
        dp: result.order.dpAmount,
        paymentUrl: finalPaymentUrl // Masukkan link pembayaran jika berhasil didapat
      });

      setCustomerName('');
      setWhatsappNumber('');
      setNotes('');
    }

    setIsSubmitting(false);
  };

  const copyOrderCode = () => {
    if (successOrderData) {
      navigator.clipboard.writeText(successOrderData.orderCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
      showToast('Kode pesanan berhasil disalin!', 'success');
    }
  };

  const copyDpAmount = () => {
    if (successOrderData) {
      navigator.clipboard.writeText(successOrderData.dp.toString());
      setCopiedDp(true);
      setTimeout(() => setCopiedDp(false), 2500);
      showToast('Nominal DP berhasil disalin!', 'success');
    }
  };

  return (
    <section id="order-section" className="py-14 sm:py-20 bg-gradient-to-b from-[#FFFDF9] via-[#FFF5EB] to-[#FFF9F2] border-t border-[#F2DECC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E6] border border-[#FCDDBF] px-4 py-1 text-xs font-bold text-[#C46A18] uppercase tracking-wider">
            <ShoppingCart className="h-3.5 w-3.5" />
            Formulir Pemesanan
          </div>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2F1C11] tracking-tight">
            Pesan Gabin Fla Segar
          </h2>
          <p className="text-[#6B5242] text-sm sm:text-base">
            Tentukan varian dan jumlah pesanan Anda. Minimal 10 pcs dengan diskon otomatis setiap kelipatan 10 pcs dan DP 50%.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Flavor Picker & Item Allocation */}
          <div className="lg:col-span-7 space-y-6">
            {/* Minimum Order & Promo Alert Banner */}
            <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
              isMinimumMet
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/90 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-start gap-3">
                {isMinimumMet ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-xs sm:text-sm flex-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>Status Pesanan: {pricing.totalPcs} pcs terpilih</span>
                    <span className={isMinimumMet ? 'text-emerald-700' : 'text-amber-800'}>
                      {isMinimumMet ? 'Memenuhi Syarat Min. 10 Pcs' : `Kurang ${pcsToMin} Pcs`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden mt-1.5">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isMinimumMet ? 'bg-emerald-500' : 'bg-[#E88C38]'
                      }`}
                      style={{ width: `${Math.min(100, (pricing.totalPcs / 10) * 100)}%` }}
                    />
                  </div>

                  <p className="text-[11px] pt-1 opacity-90 flex items-center flex-wrap gap-1">
                    {isMinimumMet
                      ? pcsToNextDiscount === 0
                        ? <><Sparkles className="h-3.5 w-3.5 text-emerald-600"/> Anda telah mengaktifkan diskon kelipatan 10 pcs!</>
                        : <><Lightbulb className="h-3.5 w-3.5 text-amber-600"/> Tambah {pcsToNextDiscount} pcs lagi untuk mendapatkan ekstra diskon kelipatan berikutnya!</>
                      : `Minimal pemesanan adalah 10 pcs. Anda bebas mencampur rasa apa saja.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Flavor Allocation Table */}
            <div className="bg-white rounded-3xl border border-[#ECD9C7] p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F5E6D8]">
                <div>
                  <h3 className="font-bold text-[#3B281B] text-base flex items-center gap-2">
                    <span>Pilih Varian & Jumlah</span>
                  </h3>
                  <p className="text-xs text-[#8A7160]">Maksimal 2 varian rasa per kotak</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#594233] bg-[#F4EDE4] px-2.5 py-1 rounded-xl border border-[#E3D4C4]">
                    {cart.filter((c) => c.quantity > 0).length}/2 Rasa
                  </span>
                  <span className="text-xs font-bold text-[#C46A18] bg-[#FFF2E5] px-2.5 py-1 rounded-xl border border-[#F5D8BF]">
                    Total: {pricing.totalPcs} Pcs
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {flavors.map((flavor) => {
                  const cartItem = cart.find((c) => c.flavorId === flavor.id);
                  const qty = cartItem ? cartItem.quantity : 0;
                  const activeFlavorsCount = cart.filter((c) => c.quantity > 0).length;
                  const canAddThis = qty > 0 || activeFlavorsCount < 2;

                  // Check status for coming soon / unavailable
                  const isAvailable = flavor.available;
                  const isComingSoon = !isAvailable && (flavor.badge?.toLowerCase().includes('coming soon') || flavor.badge?.toLowerCase().includes('segera hadir'));

                  return (
                    <div
                      key={flavor.id}
                      id={`order-picker-${flavor.id}`}
                      className={`relative flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all overflow-hidden ${
                        qty > 0
                          ? 'bg-[#FFF9F2] border-[#E88C38]/50 shadow-2xs'
                          : canAddThis && isAvailable
                          ? 'bg-white border-[#F2E4D8] hover:border-[#ECD3BC]'
                          : 'bg-[#F9F6F0] border-[#E8DFC9] opacity-70'
                      }`}
                    >
                      {/* Overlay garis diagonal untuk Coming Soon */}
                      {isComingSoon && (
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--tw-gradient-from)_0px,var(--tw-gradient-from)_6px,var(--tw-gradient-to)_6px,var(--tw-gradient-to)_12px)] from-black/5 to-transparent z-0 pointer-events-none" />
                      )}

                      <div className="flex items-center gap-3 min-w-0 relative z-10">
                        <img
                          src={flavor.image}
                          alt={flavor.name}
                          referrerPolicy="no-referrer"
                          className={`h-12 w-12 rounded-xl object-cover border border-[#ECD3BC] flex-shrink-0 ${!isAvailable ? 'grayscale' : ''}`}
                        />
                        <div className="min-w-0">
                          <h4 className={`text-xs sm:text-sm font-bold truncate ${!isAvailable ? 'text-[#8A7160]' : 'text-[#321F13]'}`}>
                            {flavor.name}
                          </h4>
                          <p className="text-[11px] text-[#8C7362] truncate">
                            {isComingSoon ? (
                              <span className="font-black text-[#C46A18] tracking-widest uppercase">Segera Hadir</span>
                            ) : !isAvailable ? (
                              <span className="font-bold text-rose-600">Habis Sementara</span>
                            ) : (
                              <>
                                Rp {flavor.price.toLocaleString('id-ID')} / pcs
                                {flavor.badge && (
                                  <span className="ml-1.5 font-bold text-[#C46A18]">
                                    • {flavor.badge}
                                  </span>
                                )}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Stepper Controls HANYA MUNCUL JIKA AVAILABLE */}
                      {isAvailable && (
                        <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
                          {qty > 0 && (
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(flavor.id, qty - 1)}
                              className="h-8 w-8 rounded-xl bg-white border border-[#E0CCBC] text-[#3B281B] flex items-center justify-center font-bold hover:bg-[#FBECE0] active:scale-95 transition-all shadow-2xs cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                          )}

                          <span className={`w-8 text-center text-sm font-black ${qty > 0 ? 'text-[#C46A18]' : 'text-stone-400'}`}>
                            {qty}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              if (!canAddThis) {
                                showToast('Satu kotak maksimal 2 varian rasa. Hapus salah satu varian yang ada terlebih dahulu.', 'warning');
                                return;
                              }
                              addToCart(flavor.id, 1);
                            }}
                            className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold transition-all shadow-xs ${
                              canAddThis
                                ? 'bg-[#E88C38] text-white hover:bg-[#D57924] active:scale-95 cursor-pointer'
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            }`}
                            title={canAddThis ? 'Tambah 1 Pcs' : 'Batas 2 rasa tercapai'}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info, Pick-up & Real-time Calculation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#ECD9C7] p-5 sm:p-6 shadow-md space-y-5">
              <h3 className="font-bold text-[#3B281B] text-base border-b border-[#F5E6D8] pb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#E88C38]" />
                <span>Informasi Pemesan & Pick-up</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4A3427] block">
                  Nama Lengkap Pemesan <span className="text-rose-500">*</span>
                </label>
                <input
                  id="order-input-name"
                  type="text"
                  required
                  placeholder="Contoh: Siti Rahmawati"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DECBC0] text-sm focus:outline-none focus:ring-2 focus:ring-[#E88C38] bg-[#FFFCF8]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4A3427] block">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  id="order-input-whatsapp"
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DECBC0] text-sm focus:outline-none focus:ring-2 focus:ring-[#E88C38] bg-[#FFFCF8]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4A3427] flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#E88C38]" />
                  <span>Lokasi Cabang Pengambilan</span> <span className="text-rose-500">*</span>
                </label>
                <select
                  id="order-select-location"
                  value={pickupLocationId}
                  onChange={(e) => setPickupLocationId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DECBC0] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E88C38] bg-[#FFFCF8] text-[#362115]"
                >
                  {locations.filter((l) => l.active).map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3427] flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#E88C38]" />
                    <span>Tanggal Ambil</span>
                  </label>
                  <input
                    id="order-input-date"
                    type="date"
                    required
                    min={defaultDateStr} 
                    value={pickupDate}
                    onClick={(e) => {
                      try { e.currentTarget.showPicker(); } catch(err) {} 
                    }} 
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E88C38] bg-[#FFFCF8] cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3427] flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#E88C38]" />
                    <span>Waktu Ambil</span>
                  </label>
                  <select
                    id="order-select-time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E88C38] bg-[#FFFCF8] cursor-pointer"
                  >
                    <option value="09:00">09.00 WIB</option>
                    <option value="10:00">10.00 WIB</option>
                    <option value="11:00">11.00 WIB</option>
                    <option value="13:00">13.00 WIB</option>
                    <option value="14:00">14.00 WIB</option>
                    <option value="15:00">15.00 WIB</option>
                    <option value="16:00">16.00 WIB</option>
                    <option value="17:00">17.00 WIB</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4A3427] block">
                  Catatan Khusus (Opsional)
                </label>
                <textarea
                  id="order-input-notes"
                  rows={2}
                  placeholder="Contoh: Mohon dipisah jadi 2 box masing-masing 5 pcs..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] text-xs focus:outline-none focus:ring-2 focus:ring-[#E88C38] bg-[#FFFCF8]"
                />
              </div>

              {/* Calculation Summary Card */}
              <div className="p-4 rounded-2xl bg-[#FFF5EC] border border-[#F5D8BF] space-y-2.5">
                <div className="flex justify-between text-xs text-[#6B5242]">
                  <span>Total Jumlah Gabin:</span>
                  <span className="font-bold text-[#3B281B]">{pricing.totalPcs} pcs</span>
                </div>

                <div className="flex justify-between text-xs text-[#6B5242]">
                  <span>Subtotal Produk:</span>
                  <span className="font-semibold">Rp {pricing.subtotal.toLocaleString('id-ID')}</span>
                </div>

                {pricing.discount > 0 && (
                  <div className="flex justify-between items-center text-xs text-emerald-700 font-bold bg-emerald-100/60 p-1.5 rounded-lg">
                    <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5"/> Diskon Promo:</span>
                    <span>- Rp {pricing.discount.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="border-t border-[#F0D0B5] pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-[#321F13]">Total Pembayaran:</span>
                  <span className="text-lg font-black text-[#C46A18]">
                    Rp {pricing.total.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="pt-2 border-t border-dashed border-[#E5BA9A] space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-[#3B281B]">
                    <span className="flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-[#E88C38]"/> Uang Muka (DP 50%):</span>
                    <span className="text-[#C46A18]">Rp {pricing.dp.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-[#8A7160]">
                    <span className="flex items-center gap-1.5"><Handshake className="h-4 w-4"/> Pelunasan saat Pick-up:</span>
                    <span>Rp {pricing.remaining.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="submit-order-form-btn"
                type="submit"
                disabled={!isMinimumMet || isSubmitting}
                className={`w-full py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                  isMinimumMet
                    ? 'bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-emerald-500/20 active:scale-98'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">Mempersiapkan Tagihan...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{isMinimumMet ? 'Kirim Pesanan ke WhatsApp' : `Tambah ${pcsToMin} Pcs Lagi untuk Pesan`}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-[11px] text-[#8C7362] justify-center">
                <Info className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Pesanan akan dikonfirmasi langsung oleh admin via WhatsApp resmi.</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Order Success & QRIS Payment Modal */}
      {successOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-[#ECD9C7] p-5 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSuccessOrderData(null)} 
              className="absolute top-4 right-4 p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors cursor-pointer z-10"
              title="Tutup Jendela"
            >
              <X className="h-5 w-5"/>
            </button>

            <div className="text-center space-y-1.5 mb-5 mt-2">
              <div className="h-12 w-12 mx-auto rounded-full bg-emerald-100 border-4 border-emerald-300 text-emerald-600 flex items-center justify-center shadow-md mb-2">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="font-['Playfair_Display',serif] text-xl sm:text-2xl font-extrabold text-[#2F1C11]">
                Pesanan Berhasil Dicatat!
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5242]">
                Selangkah lagi. Selesaikan pembayaran Down Payment (DP) 50% untuk memproses pesanan Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              
              {/* Left Column: Order Details & DP */}
              <div className="space-y-3 flex flex-col justify-center">
                <div className="p-4 rounded-2xl bg-[#FFF5EC] border border-[#F5D8BF] space-y-3">
                  <div>
                    <span className="text-[10px] font-black text-[#8A7160] uppercase tracking-wider">Kode Pesanan:</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-mono font-black text-lg text-[#C46A18]">{successOrderData.orderCode}</span>
                      <button 
                        onClick={copyOrderCode} 
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E3C8B4] text-[#4A3427] hover:bg-[#FAF0E6] flex items-center gap-1.5 shadow-xs font-bold text-[11px] cursor-pointer transition-colors"
                      >
                        {copiedCode ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        {copiedCode ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-[#F0D0B5] flex justify-between items-center">
                     <span className="text-[10px] font-bold text-[#8A7160] uppercase tracking-wider">Total Pesanan:</span>
                     <p className="font-bold text-[#3B281B] text-base">Rp {successOrderData.total.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-10">
                    <ShieldCheck className="h-20 w-20 text-emerald-900" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5"/> Nominal DP Wajib (50%)
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-1.5 gap-2">
                      <span className="text-2xl font-black text-emerald-700">Rp {successOrderData.dp.toLocaleString('id-ID')}</span>
                      <button 
                        onClick={copyDpAmount} 
                        className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors w-full sm:w-auto"
                      >
                         {copiedDp ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Salin Nominal
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Duitku Integration & Fallback QRIS */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-center">
                 {successOrderData.paymentUrl ? (
                   // Jika API Duitku Berhasil
                   <div className="flex flex-col items-center w-full">
                     <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                       <CreditCard className="h-8 w-8 text-blue-600" />
                     </div>
                     <h4 className="font-bold text-[#321F13] text-sm">Pembayaran Otomatis</h4>
                     <p className="text-[11px] text-stone-500 mt-1 max-w-[200px] mb-4">
                       Klik tombol di bawah untuk membayar DP via QRIS, GoPay, atau Virtual Account melalui Duitku.
                     </p>
                     <a 
                       href={successOrderData.paymentUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="px-6 py-3 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                     >
                       <CreditCard className="h-4 w-4" /> Bayar Sekarang
                     </a>
                   </div>
                 ) : (
                   // Jika API Duitku Gagal / Belum Siap (Fallback)
                   <>
                     <img 
                       src={qrisImageUrl} 
                       alt="QRIS Pembayaran Gabin Fla" 
                       className="w-32 h-32 rounded-xl shadow-md mb-3 border-4 border-white object-cover"
                     />
                     <h4 className="font-bold text-[#321F13] text-sm">Scan QRIS untuk Bayar</h4>
                     <p className="text-[11px] text-stone-500 mt-1 max-w-[200px]">
                       Masukkan <strong>tepat</strong> nominal DP yang tertera di samping. 
                     </p>
                   </>
                 )}
              </div>
            </div>

            {/* Action Bottom */}
            <div className="mt-5 pt-5 border-t border-stone-200 flex flex-col items-center gap-2">
              <p className="text-[11px] sm:text-xs font-semibold text-[#6B5242]">Sudah menyelesaikan pembayaran?</p>
              <a
                id="modal-wa-direct-btn"
                href={successOrderData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSuccessOrderData(null)}
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Kirim Bukti Transfer ke WA</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
