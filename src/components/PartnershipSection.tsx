import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PartnerCategory } from '../types';
import {
  Store,
  Coffee,
  Utensils,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Truck,
  PackageCheck,
  Send,
  MessageCircle,
  CheckCircle2,
  Calculator,
  ChevronRight,
  Gift,
  Lock,
  Edit3,
  Building2
} from 'lucide-react';

export const PartnershipSection: React.FC = () => {
  const { partnerTiers, submitPartnerApplication, showToast } = useApp();

  // Profit Simulator State
  const [simCategory, setSimCategory] = useState<PartnerCategory>('angkringan');
  const [simFlavorType, setSimFlavorType] = useState<'classic' | 'special'>('classic');
  const [simDailyPcs, setSimDailyPcs] = useState<number>(35);
  const [simRetailPrice, setSimRetailPrice] = useState<number>(3500);

  // Form State
  const [formBusinessName, setFormBusinessName] = useState('');
  const [formOwnerName, setFormOwnerName] = useState('');
  const [formCategory, setFormCategory] = useState<PartnerCategory>('angkringan');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formCity, setFormCity] = useState('Yogyakarta');
  const [formAddress, setFormAddress] = useState('');
  const [formEstimatedPcs, setFormEstimatedPcs] = useState<number>(30);
  const [formNotes, setFormNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Calculation Logic (Diperbaiki agar ANTI INFINITE LOOP & KEBAL ERROR)
  // 1. Ambil tier aktif berdasarkan kategori yang dipilih
  const currentTier = partnerTiers?.find((t) => t.category === simCategory) || partnerTiers?.[0];
  
  // 2. Harga Modal (Otomatis menyesuaikan Tier + Jenis Varian, dengan fallback aman)
  const supplyPrice = currentTier
    ? (simFlavorType === 'classic' ? currentTier.priceClassic : (currentTier.priceSpecial || currentTier.pricePremium || 3200))
    : 2300;

  // 3. Otomatis sesuaikan Harga Jual bawaan jika kategori diganti (Hanya bergantung pada simCategory)
  useEffect(() => {
    const tier = partnerTiers?.find((t) => t.category === simCategory) || partnerTiers?.[0];
    if (tier) {
      setSimRetailPrice(tier.suggestedRetailPrice || 3500);
    }
  }, [simCategory]); // <- Ini adalah kunci perbaikannya agar tidak infinite loop

  // 4. Hitungan Matematika Keuntungan
  const profitPerPcs = simRetailPrice - supplyPrice;
  const isLoss = profitPerPcs < 0;
  const dailyProfit = profitPerPcs * simDailyPcs;
  const monthlyProfit = dailyProfit * 30;
  const marginPercent = simRetailPrice > 0 ? Math.round((profitPerPcs / simRetailPrice) * 100) : 0;

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBusinessName.trim() || !formOwnerName.trim() || !formWhatsapp.trim() || !formAddress.trim()) {
      showToast('Mohon lengkapi semua kolom bertanda bintang (*)', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitPartnerApplication({
        businessName: formBusinessName,
        ownerName: formOwnerName,
        category: formCategory,
        whatsapp: formWhatsapp,
        city: formCity,
        address: formAddress,
        estimatedDailyPcs: formEstimatedPcs,
        notes: formNotes,
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 600);
  };

  const getCategoryLabel = (cat: PartnerCategory) => {
    switch (cat) {
      case 'angkringan': return 'Angkringan / Warung';
      case 'kedai_kopi': return 'Kedai Kopi Santai';
      case 'cafe': return 'Cafe & Resto';
      case 'toko_roti': return 'Toko Roti / Swalayan';
      case 'reseller_kantin': return 'Reseller & Kantin';
      default: return cat;
    }
  };

  const openWhatsappDirect = () => {
    const text = `Halo Admin Gabin Fla! Saya tertarik mengajukan kerja sama kemitraan/suplai rutin untuk:
• Nama Usaha: ${formBusinessName || 'Nama Usaha'}
• Kategori: ${getCategoryLabel(formCategory)}
• Pemilik: ${formOwnerName || 'Nama Pemilik'}
• No WA: ${formWhatsapp || '-'}
• Lokasi: ${formAddress || 'Yogyakarta'}
• Estimasi Suplai: ${formEstimatedPcs} pcs/hari

Mohon informasi katalog mitra, harga grosir khusus, dan jadwal pengiriman tester. Terima kasih!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/6282311724554?text=${encoded}`, '_blank');
  };

  return (
    <section id="partnership-section" className="py-16 sm:py-24 bg-[#FDFBF7] relative overflow-hidden">
      {/* Background Decors */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#FFF5EB] to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E6] border border-[#FCDDBF] px-4 py-1 text-xs font-bold text-[#C46A18] uppercase tracking-wider">
            <Building2 className="h-3.5 w-3.5" />
            B2B Partnership
          </div>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2F1C11] tracking-tight">
            Tingkatkan Omzet Usaha Anda dengan Gabin Fla
          </h2>
          <p className="text-[#6B5242] text-sm sm:text-base leading-relaxed">
            Bergabunglah menjadi mitra distribusi kami. Kami menyuplai gabin fla segar setiap pagi langsung ke lokasi usaha Anda dengan harga grosir khusus dan jaminan retur sisa produk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: SIMULASI CUAN */}
          <div id="profit-simulator" className="lg:col-span-5 w-full scroll-mt-24">
            <div className="bg-[#2D1B11] rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-[#4A3427] text-[#F5E6D8] sticky top-24">
              <div className="flex items-center justify-between border-b border-[#4A3427] pb-5 mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                  <Calculator className="h-5 w-5 text-[#E88C38]" />
                  Simulasi Cuan Mitra
                </h3>
                <span className="text-[10px] sm:text-xs font-bold bg-[#4A3427] px-3 py-1 rounded-full text-[#FAD082]">
                  Estimasi Real-Time
                </span>
              </div>

              {/* Category Selection */}
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold text-[#D9C4B6] uppercase tracking-wider">
                  Jenis Tempat Usaha Anda:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'angkringan', label: 'Angkringan / Warung', icon: Utensils },
                    { id: 'kedai_kopi', label: 'Kedai Kopi Santai', icon: Coffee },
                    { id: 'cafe', label: 'Cafe & Resto', icon: Store },
                    { id: 'toko_roti', label: 'Toko Roti / Swalayan', icon: ShoppingBag },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSimCategory(cat.id as PartnerCategory)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                          simCategory === cat.id
                            ? 'bg-[#E88C38] text-white border-[#E88C38] shadow-md'
                            : 'bg-[#1F1007] text-[#A88C78] border-[#3D2616] hover:bg-[#3D2616] hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Varian Rasa Selection */}
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold text-[#D9C4B6] uppercase tracking-wider">
                  Pilih Varian Rasa:
                </label>
                <div className="flex bg-[#1F1007] rounded-xl border border-[#3D2616] p-1">
                  <button
                    type="button"
                    onClick={() => setSimFlavorType('classic')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      simFlavorType === 'classic'
                        ? 'bg-[#E88C38] text-white shadow-md'
                        : 'text-[#A88C78] hover:text-white'
                    }`}
                  >
                    Classic Vanilla
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimFlavorType('special')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      simFlavorType === 'special'
                        ? 'bg-[#E88C38] text-white shadow-md'
                        : 'text-[#A88C78] hover:text-white'
                    }`}
                  >
                    Signature Flavors
                  </button>
                </div>
              </div>

              {/* Target Selection Slider */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#D9C4B6] uppercase tracking-wider">
                    Target Terjual per Hari:
                  </label>
                  <span className="text-sm font-black text-white">{simDailyPcs} Pcs / hari</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={simDailyPcs}
                  onChange={(e) => setSimDailyPcs(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E88C38]"
                />
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>10 pcs</span>
                  <span>50 pcs</span>
                  <span>100 pcs</span>
                  <span>200 pcs</span>
                </div>
              </div>

              {/* DYNAMIC PRICING BOXES */}
              <div className="space-y-4 mb-6 bg-[#1F1007] p-5 rounded-2xl border border-[#3D2616]">
                
                {/* 1. HARGA PASOKAN (LOCKED - DARI ADMIN) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#A88C78] flex items-center justify-between">
                    <span>Biaya Modal Pasokan Mitra</span>
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">
                      <Lock className="h-3 w-3" />
                      <span className="text-[9px] uppercase tracking-wider">Ketetapan Pusat</span>
                    </span>
                  </label>
                  <div className="flex items-center justify-between bg-[#2D1B11] px-4 py-3 rounded-xl border border-[#4A3427]">
                    <span className="text-sm font-bold text-[#D9C4B6]">Rp</span>
                    <span className="text-xl font-black text-emerald-400">
                      {supplyPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* 2. HARGA JUAL (EDITABLE - OLEH MITRA) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#A88C78] flex items-center justify-between">
                    <span>Rencana Harga Jual Konsumen</span>
                    <span className="flex items-center gap-1 text-[#E88C38]">
                      <Edit3 className="h-3 w-3" />
                      <span className="text-[9px] uppercase tracking-wider">Ubah Sesuai Target</span>
                    </span>
                  </label>
                  <div className="flex items-center justify-between bg-[#3D2616] px-4 py-2.5 rounded-xl border border-[#E88C38] focus-within:ring-2 ring-[#E88C38]/50 transition-all">
                    <span className="text-sm font-bold text-white">Rp</span>
                    <input
                      type="number"
                      value={simRetailPrice || ''}
                      onChange={(e) => setSimRetailPrice(Number(e.target.value))}
                      className="bg-transparent text-right text-xl font-black text-white outline-none w-full ml-2 placeholder-stone-600"
                      placeholder="Ketik harga jual..."
                    />
                  </div>
                </div>
              </div>

              {/* CALCULATION RESULTS */}
              <div className="space-y-4 pt-2 border-t border-[#4A3427]/60">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#D9C4B6] font-medium">Keuntungan Bersih per Pcs:</span>
                  {isLoss ? (
                    <span className="font-bold text-rose-400 text-sm">
                      Rugi Rp {Math.abs(profitPerPcs).toLocaleString('id-ID')}
                    </span>
                  ) : (
                    <span className="font-bold text-[#7EE787] text-sm bg-[#7EE787]/10 px-2 py-1 rounded-lg">
                      Rp {profitPerPcs.toLocaleString('id-ID')} <span className="text-[10px] ml-1">({marginPercent}%)</span>
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end bg-[#E88C38]/10 p-4 rounded-xl border border-[#E88C38]/20">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Estimasi Keuntungan Bersih</p>
                    <p className="text-[11px] text-[#D9C4B6]">
                      ({simDailyPcs} pcs x 30 hari)
                    </p>
                  </div>
                  <div className="text-right">
                    {isLoss ? (
                      <span className="text-2xl font-black text-rose-400">Minus / Rugi</span>
                    ) : (
                      <span className="text-3xl font-black text-[#FAD082]">
                        Rp {monthlyProfit.toLocaleString('id-ID')}
                      </span>
                    )}
                    <span className="text-xs text-[#A88C78] block mt-0.5">/ bulan</span>
                  </div>
                </div>

                <p className="text-[10px] text-[#A88C78] text-center italic opacity-80 pt-2 leading-relaxed">
                  *Harga modal pasokan di atas ditarik otomatis dari sistem kami berdasarkan tier kategori usaha & varian rasa.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PENDAFTARAN & TIER SHOWCASE */}
          <div className="lg:col-span-7 w-full mt-8 lg:mt-0 space-y-8">
            
            {/* TIER CARDS SHOWCASE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-[#321F13]">Pilihan Skema Kemitraan</h3>
                <span className="text-xs text-[#8C6D58]">Tersedia {(partnerTiers || []).length} Opsi Tier</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(partnerTiers || []).map((tier) => (
                  <div
                    key={tier.id}
                    className="bg-white rounded-2xl p-5 border border-[#ECD9C8] hover:border-[#E88C38]/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-[#321F13]">{tier.tierName}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF3E6] text-[#C46A18] border border-[#FAD8BD] uppercase whitespace-nowrap">
                          Min {tier.minOrderPcs} pcs
                        </span>
                      </div>

                      {/* Wholesale Pricing Table */}
                      <div className="bg-[#FFFDF9] rounded-xl p-3 border border-[#F2E5D8] space-y-1.5 text-xs">
                        <div className="flex justify-between text-[#6B5242]">
                          <span>Varian Classic:</span>
                          <span className="font-bold text-[#3B281B]">Rp {tier.priceClassic?.toLocaleString('id-ID')}/pcs</span>
                        </div>
                        <div className="flex justify-between text-[#6B5242]">
                          <span>Varian Signature:</span>
                          <span className="font-bold text-[#3B281B]">Rp {(tier.priceSpecial || tier.pricePremium || 3200).toLocaleString('id-ID')}/pcs</span>
                        </div>
                        <div className="flex justify-between text-[#6B5242]">
                          <span>Sistem Bayar:</span>
                          <span className="font-semibold text-[#C46A18] capitalize">
                            {tier.paymentModel === 'konsinyasi' ? 'Titip Jual (Konsinyasi)' : tier.paymentModel.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Free Facilities */}
                      <div className="space-y-1 pt-1">
                        <p className="text-[11px] font-semibold text-[#8C6D58]">Fasilitas Mitra:</p>
                        <ul className="space-y-1">
                          {(tier.freeFacilities || []).slice(0, 3).map((fac, idx) => (
                            <li key={idx} className="text-[11px] text-[#554032] flex items-start gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{fac}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Buttons for Tier */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSimCategory(tier.category as PartnerCategory);
                          const el = document.getElementById('profit-simulator');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          showToast(`Simulasi diperbarui menggunakan skema ${tier.tierName}`, 'info');
                        }}
                        className="w-full py-2 rounded-xl bg-white hover:bg-[#FFF6EE] text-[#6B5242] hover:text-[#C46A18] border border-[#ECD9C8] font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Calculator className="h-3.5 w-3.5" />
                        <span>Simulasikan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFormCategory(tier.category as PartnerCategory);
                          const el = document.getElementById('partner-application-form');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className="w-full py-2 rounded-xl bg-[#FFF6EE] hover:bg-[#E88C38] text-[#C46A18] hover:text-white border border-[#FAD8BD] font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Daftar Skema</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FORMULIR PENDAFTARAN */}
            <div id="partner-application-form" className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-xl border border-[#ECD9C7] scroll-mt-24">
              {submittedSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#2F1C11]">
                      Pendaftaran Kemitraan Berhasil Terkirim!
                    </h3>
                    <p className="text-sm text-[#6B5242] max-w-md mx-auto">
                      Terima kasih, <strong>{formBusinessName}</strong>! Pengajuan Anda telah masuk ke sistem kami.
                      Tim kemitraan Gabin Fla akan menghubungi WhatsApp Anda (<strong>{formWhatsapp}</strong>) dalam 1x24 jam untuk pengiriman tester & proposal.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={openWhatsappDirect}
                      className="px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Chat Tim Kemitraan via WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedSuccess(false);
                        setFormBusinessName('');
                        setFormOwnerName('');
                        setFormWhatsapp('');
                        setFormAddress('');
                        setFormNotes('');
                      }}
                      className="px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition-all cursor-pointer"
                    >
                      Daftarkan Usaha Lain
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  <div className="text-center max-w-lg mx-auto space-y-1.5 pb-2">
                    <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#2F1C11]">
                      Formulir Pendaftaran Mitra Instan
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7A6455]">
                      Isi data usaha Anda di bawah ini. Tim kami akan menyiapkan tester gratis & proposal kemitraan resmi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Business Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#3B281B]">
                        Nama Usaha / Toko / Cafe <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Kopi Tepi Kali"
                        value={formBusinessName}
                        onChange={(e) => setFormBusinessName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
                      />
                    </div>

                    {/* Business Category */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#3B281B]">
                        Jenis Kategori Usaha <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as PartnerCategory)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
                      >
                        <option value="angkringan">Angkringan / Warung Makan</option>
                        <option value="kedai_kopi">Kedai Kopi Santai / Coffeeshop</option>
                        <option value="cafe">Cafe & Resto Premium</option>
                        <option value="toko_roti">Toko Roti / Oleh-oleh / Swalayan</option>
                        <option value="reseller_kantin">Reseller / Kantin Kampus & Kantor</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Owner Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#3B281B]">
                        Nama Penanggung Jawab / Pemilik <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso"
                        value={formOwnerName}
                        onChange={(e) => setFormOwnerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
                      />
                    </div>

                    {/* WhatsApp Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#3B281B]">
                        Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Contoh: 081234567890"
                        value={formWhatsapp}
                        onChange={(e) => setFormWhatsapp(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3B281B]">Kota / Kabupaten</label>
                    <input
                      type="text"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="Yogyakarta / Sleman / Bantul"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
                    />
                  </div>

                  {/* Full Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3B281B]">
                      Alamat Lengkap Tempat Usaha / Pengiriman <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Contoh: Jl. Kaliurang KM 8 No. 15, Ngaglik, Sleman (Patokan samping SPBU)"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
                    />
                  </div>

                  {/* Estimated Daily Supply */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#3B281B]">
                        Estimasi Kebutuhan Harian (Pcs/Hari)
                      </label>
                      <span className="text-sm font-bold text-[#C46A18]">{formEstimatedPcs} Pcs</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="10"
                      value={formEstimatedPcs}
                      onChange={(e) => setFormEstimatedPcs(Number(e.target.value))}
                      className="w-full accent-[#E88C38] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#8C7362] px-1">
                      <span>Mulai 10 pcs</span>
                      <span>Hingga 200+ pcs</span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3B281B]">
                      Catatan Tambahan / Permintaan Khusus (Opsional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Ingin mencoba tester rasa vanila & signature terlebih dahulu, jam buka usaha pukul 16.00 WIB."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#E88C38] hover:bg-[#D57924] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">Mengirim Data...</span>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Kirim Pengajuan Kemitraan</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={openWhatsappDirect}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FFF5EC] hover:bg-[#FFEBD6] text-[#C46A18] border border-[#FAD8BD] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Konsultasi WA Cepat</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-[#8A7160]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Tidak ada ikatan kontrak yang memberatkan.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
