import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  ShoppingCart, Send, Calendar, Clock, MapPin, Sparkles, CheckCircle, 
  Info, Plus, Minus, AlertCircle, Copy, Check, Lightbulb, CreditCard, Handshake 
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

  // Success Modal State
  const [successOrderData, setSuccessOrderData] = useState<{
    orderCode: string;
    whatsappUrl: string;
    total: number;
    dp: number;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const pricing = calculateOrderPricing(cart);
  const isMinimumMet = pricing.totalPcs >= 10;
  const pcsToMin = Math.max(0, 10 - pricing.totalPcs);

  // Next discount milestone calculation
  const nextTenMilestone = Math.ceil(pricing.totalPcs / 10) * 10 || 10;
  const pcsToNextDiscount = nextTenMilestone - pricing.totalPcs;

  const handleSubmitOrder = (e: React.FormEvent) => {
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

    const result = createOrder({
      customerName,
      whatsappNumber,
      pickupLocationId,
      pickupDate,
      pickupTime,
      notes,
    });

    if (result) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E88C38', '#F5B056', '#3B281B', '#E53E3E', '#38A169'],
        });
      } catch (err) {}

      setSuccessOrderData({
        orderCode: result.order.orderCode,
        whatsappUrl: result.whatsappUrl,
        total: result.order.totalPrice,
        dp: result.order.dpAmount,
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      showToast('Kode pesanan berhasil disalin!', 'success');
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

                  return (
                    <div
                      key={flavor.id}
                      id={`order-picker-${flavor.id}`}
                      className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
                        qty > 0
                          ? 'bg-[#FFF9F2] border-[#E88C38]/50 shadow-2xs'
                          : canAddThis
                          ? 'bg-white border-[#F2E4D8] hover:border-[#ECD3BC]'
                          : 'bg-[#F9F6F0] border-[#E8DFC9] opacity-60'
                      } ${!flavor.available ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={flavor.image}
                          alt={flavor.name}
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 rounded-xl object-cover border border-[#ECD3BC] flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-[#321F13] truncate">
                            {flavor.name}
                          </h4>
                          <p className="text-[11px] text-[#8C7362] truncate">
                            Rp {flavor.price.toLocaleString('id-ID')} / pcs
                            {flavor.badge && (
                              <span className="ml-1.5 font-bold text-[#C46A18]">
                                • {flavor.badge}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
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
                <Send className="h-4 w-4" />
                <span>{isMinimumMet ? 'Kirim Pesanan ke WhatsApp' : `Tambah ${pcsToMin} Pcs Lagi untuk Pesan`}</span>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-[#8C7362] justify-center">
                <Info className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Pesanan akan dikonfirmasi langsung oleh admin via WhatsApp resmi.</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Order Success Modal */}
      {successOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#ECD9C7] p-6 sm:p-8 shadow-2xl space-y-5 text-center relative animate-in zoom-in-95 duration-200">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center shadow-md animate-bounce">
              <CheckCircle className="h-9 w-9" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Pesanan Berhasil Dicatat!
              </span>
              <h3 className="font-['Playfair_Display',serif] text-2xl font-extrabold text-[#2F1C11]">
                Terima Kasih atas Pesanan Anda
              </h3>
              <p className="text-xs text-[#7A6455]">
                Silakan lanjutkan konfirmasi ke WhatsApp untuk menerima nomor rekening pembayaran DP 50%.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF5EC] border border-[#F5D8BF] flex items-center justify-between gap-2 text-left">
              <div>
                <span className="text-[10px] font-bold text-[#8A7160] uppercase">Kode Pesanan:</span>
                <p className="font-mono font-black text-base text-[#C46A18]">
                  {successOrderData.orderCode}
                </p>
              </div>
              <button
                type="button"
                onClick={copyOrderCode}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#E3C8B4] text-xs font-bold text-[#4A3427] hover:bg-[#FAF0E6] flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F7F2ED] text-left">
                <span className="text-[10px] text-[#7A6455] block">Total Pesanan</span>
                <span className="font-bold text-[#3B281B]">
                  Rp {successOrderData.total.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-left border border-emerald-200">
                <span className="text-[10px] text-emerald-700 block font-semibold">DP 50% Wajib</span>
                <span className="font-black text-emerald-800">
                  Rp {successOrderData.dp.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                id="modal-wa-direct-btn"
                href={successOrderData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSuccessOrderData(null)}
                className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
              >
                <Send className="h-4 w-4" />
                <span>Buka WhatsApp & Kirim Detail</span>
              </a>

              <button
                type="button"
                onClick={() => setSuccessOrderData(null)}
                className="w-full py-2.5 text-xs font-semibold text-[#8C7362] hover:text-[#3B281B] cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};