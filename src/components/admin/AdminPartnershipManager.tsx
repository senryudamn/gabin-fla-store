import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Partner, PartnerPricingTier, PartnerCategory, PartnerApplication } from '../../types';
import {
  Store,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  MessageCircle,
  Truck,
  TrendingUp,
  Percent,
  Search,
  Building2,
  Coffee,
  Utensils,
  ShoppingBag,
  Sliders,
  DollarSign,
  FileText,
  AlertCircle,
  Copy,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export const AdminPartnershipManager: React.FC = () => {
  const {
    partnerTiers,
    updatePartnerTier,
    addPartnerTier,
    deletePartnerTier,
    partners,
    addPartner,
    updatePartner,
    deletePartner,
    partnerApplications,
    updatePartnerApplicationStatus,
    convertApplicationToPartner,
    flavors,
    showToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'tiers' | 'partners' | 'applications' | 'dispatch'>('tiers');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal States
  const [editingTier, setEditingTier] = useState<PartnerPricingTier | null>(null);
  const [isAddingTier, setIsAddingTier] = useState(false);

  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isAddingPartner, setIsAddingPartner] = useState(false);

  const [approvingApp, setApprovingApp] = useState<PartnerApplication | null>(null);
  const [approveTierId, setApproveTierId] = useState<string>(partnerTiers[0]?.id || 'tier-angkringan');
  const [approveDailyPcs, setApproveDailyPcs] = useState<number>(30);
  const [approveSchedule, setApproveSchedule] = useState<string>('Setiap Hari - Pukul 07.30 WIB');

  // New Tier Form State
  const [tierForm, setTierForm] = useState<Omit<PartnerPricingTier, 'id'>>({
    tierName: '',
    category: 'angkringan',
    priceClassic: 2300,
    pricePremium: 2800,
    priceSpecial: 3200,
    suggestedRetailPrice: 3500,
    estimatedMarginPercent: 35,
    minOrderPcs: 20,
    paymentModel: 'konsinyasi',
    freeFacilities: ['Toples Kaca Display Gratis', 'Garansi Retur 100%'],
    active: true,
  });

  // New Partner Form State
  const [partnerForm, setPartnerForm] = useState<Omit<Partner, 'id' | 'registeredAt' | 'totalSuppliedPcs' | 'totalRevenueValue'>>({
    businessName: '',
    ownerName: '',
    category: 'angkringan',
    whatsapp: '',
    address: '',
    city: 'Yogyakarta',
    tierId: partnerTiers[0]?.id || 'tier-angkringan',
    customDiscountPercent: 0,
    dailySupplyPcs: 30,
    supplySchedule: 'Setiap Hari - Pukul 07.30 WIB',
    preferredFlavors: ['classic-vanilla', 'espresso-blend'],
    paymentModel: 'konsinyasi',
    status: 'active',
    notes: '',
  });

  // Filtered Partners
  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculations for KPI Cards
  const totalPartners = partners.length;
  const activePartners = partners.filter((p) => p.status === 'active').length;
  const totalDailyPcsDispatched = partners.reduce((sum, p) => (p.status === 'active' ? sum + p.dailySupplyPcs : sum), 0);
  const pendingAppsCount = partnerApplications.filter((a) => a.status === 'pending').length;

  const handleSaveTier = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Membersihkan array fasilitas (menghilangkan spasi berlebih dan string kosong)
    const cleanFacilities = (editingTier ? editingTier.freeFacilities : tierForm.freeFacilities)
      .map(f => f.trim())
      .filter(Boolean);

    if (editingTier) {
      updatePartnerTier({ ...editingTier, freeFacilities: cleanFacilities });
      setEditingTier(null);
    } else if (isAddingTier) {
      if (!tierForm.tierName.trim()) {
        showToast('Nama tier tidak boleh kosong', 'warning');
        return;
      }
      addPartnerTier({ ...tierForm, freeFacilities: cleanFacilities });
      setIsAddingTier(false);
    }
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPartner) {
      updatePartner(editingPartner);
      setEditingPartner(null);
    } else if (isAddingPartner) {
      if (!partnerForm.businessName.trim() || !partnerForm.whatsapp.trim()) {
        showToast('Nama usaha dan WhatsApp wajib diisi', 'warning');
        return;
      }
      addPartner(partnerForm);
      setIsAddingPartner(false);
    }
  };

  const handleApproveAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingApp) return;
    convertApplicationToPartner(approvingApp.id, approveTierId, approveDailyPcs, approveSchedule);
    setApprovingApp(null);
  };

  const copyDispatchText = () => {
    let text = `📦 *REKAP PENGIRIMAN SUPLAI HARIAN GABIN FLA*\n📅 Tanggal: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}\n\n`;
    partners.forEach((p, idx) => {
      if (p.status !== 'active') return;
      const tier = partnerTiers.find((t) => t.id === p.tierId);
      const estPrice = tier ? tier.priceClassic : 2300;
      text += `${idx + 1}. *${p.businessName}* (${p.category.toUpperCase()})\n`;
      text += `   • Alamat: ${p.address}\n`;
      text += `   • Jumlah Suplai: ${p.dailySupplyPcs} pcs\n`;
      text += `   • Jadwal: ${p.supplySchedule}\n`;
      text += `   • Kontak WA: ${p.whatsapp}\n`;
      text += `   • Sistem: ${p.paymentModel === 'konsinyasi' ? 'Titip Jual' : 'Beli Putus'}\n\n`;
    });
    text += `Total Seluruh Suplai Hari Ini: *${totalDailyPcsDispatched} pcs*`;

    navigator.clipboard.writeText(text);
    showToast('Rekap surat jalan pengiriman berhasil disalin ke clipboard!', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Overview KPI Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#321F13]">
            Manajemen Kemitraan & Suplai B2B
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6455]">
            Atur penyesuaian biaya, harga grosir per tier, dan kelola mitra toko, kedai, angkringan & cafe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'tiers' && (
            <button
              type="button"
              onClick={() => {
                setTierForm({
                  tierName: '',
                  category: 'angkringan',
                  priceClassic: 2300,
                  pricePremium: 2800,
                  priceSpecial: 3200,
                  suggestedRetailPrice: 3500,
                  estimatedMarginPercent: 35,
                  minOrderPcs: 20,
                  paymentModel: 'konsinyasi',
                  freeFacilities: ['Toples Kaca Display Gratis', 'Garansi Retur 100%'],
                  active: true,
                });
                setIsAddingTier(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#E88C38] hover:bg-[#D57924] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Tier Harga</span>
            </button>
          )}

          {activeSubTab === 'partners' && (
            <button
              type="button"
              onClick={() => {
                setPartnerForm({
                  businessName: '',
                  ownerName: '',
                  category: 'angkringan',
                  whatsapp: '',
                  address: '',
                  city: 'Yogyakarta',
                  tierId: partnerTiers[0]?.id || 'tier-angkringan',
                  customDiscountPercent: 0,
                  dailySupplyPcs: 30,
                  supplySchedule: 'Setiap Hari - Pukul 07.30 WIB',
                  preferredFlavors: ['classic-vanilla', 'espresso-blend'],
                  paymentModel: 'konsinyasi',
                  status: 'active',
                  notes: '',
                });
                setIsAddingPartner(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#E88C38] hover:bg-[#D57924] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Mitra Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ECD9C8] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8C6D58]">
            <span>Total Mitra Terdaftar</span>
            <Store className="h-4 w-4 text-[#C46A18]" />
          </div>
          <p className="text-2xl font-black text-[#321F13]">{totalPartners}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">{activePartners} Mitra Aktif</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ECD9C8] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8C6D58]">
            <span>Target Suplai Pagi Ini</span>
            <Truck className="h-4 w-4 text-[#1E8A54]" />
          </div>
          <p className="text-2xl font-black text-[#321F13]">{totalDailyPcsDispatched} pcs</p>
          <span className="text-[11px] text-[#8C7160]">Diantar setiap 07.00 - 09.00</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ECD9C8] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8C6D58]">
            <span>Tier Penyesuaian Biaya</span>
            <Sliders className="h-4 w-4 text-[#693EB0]" />
          </div>
          <p className="text-2xl font-black text-[#321F13]">{partnerTiers.length} Tier</p>
          <span className="text-[11px] text-[#8C7160]">Angkringan, Cafe, Kedai, dll</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ECD9C8] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8C6D58]">
            <span>Pengajuan Baru</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-[#321F13]">{pendingAppsCount}</p>
          <span className="text-[11px] text-amber-700 font-semibold">Perlu diverifikasi</span>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E8DFC9] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('tiers')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'tiers'
              ? 'bg-[#3B281B] text-white shadow-xs'
              : 'bg-white text-[#6B5242] border border-[#ECD7C4] hover:bg-[#FFF6EE]'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Penyesuaian Biaya & Tier Harga ({partnerTiers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('partners')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'partners'
              ? 'bg-[#3B281B] text-white shadow-xs'
              : 'bg-white text-[#6B5242] border border-[#ECD7C4] hover:bg-[#FFF6EE]'
          }`}
        >
          <Store className="h-4 w-4" />
          <span>Daftar Mitra Aktif ({partners.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'applications'
              ? 'bg-[#3B281B] text-white shadow-xs'
              : 'bg-white text-[#6B5242] border border-[#ECD7C4] hover:bg-[#FFF6EE]'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Pengajuan Kemitraan</span>
          {pendingAppsCount > 0 && (
            <span className="h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingAppsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('dispatch')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'dispatch'
              ? 'bg-[#3B281B] text-white shadow-xs'
              : 'bg-white text-[#6B5242] border border-[#ECD7C4] hover:bg-[#FFF6EE]'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Surat Jalan & Drop-Off Harian</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: PENYESUAIAN BIAYA & TIER HARGA */}
      {/* ========================================================================= */}
      {activeSubTab === 'tiers' && (
        <div className="space-y-6">
          <div className="bg-[#FFF8F0] rounded-2xl p-4 border border-[#FAD8BD] flex items-start gap-3 text-xs text-[#8C4F1B]">
            <AlertCircle className="h-5 w-5 text-[#E88C38] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#3B281B]">Informasi Penyesuaian Biaya Grosir:</strong>
              <p className="mt-0.5">
                Setiap jenis mitra (Angkringan, Kedai Kopi, Cafe, Toko Roti) dapat memiliki harga pasokan tersendiri.
                Sistem akan menghitung otomatis selisih margin keuntungan agar mitra mendapatkan keuntungan yang sehat.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerTiers.map((tier) => (
              <div
                key={tier.id}
                className="bg-white rounded-3xl border border-[#ECD9C8] p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#321F13] text-base">{tier.tierName}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF2E5] text-[#C46A18] border border-[#F5D8BF] uppercase">
                          {tier.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-[#8C7362] mt-0.5">
                        Min. Order: <strong>{tier.minOrderPcs} pcs</strong> • Sistem: <strong className="capitalize">{tier.paymentModel}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingTier(tier)}
                        className="p-2 rounded-xl text-stone-600 hover:bg-[#FFF5EB] hover:text-[#C46A18] transition-colors cursor-pointer"
                        title="Edit Penyesuaian Biaya"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus tier "${tier.tierName}"?`)) {
                            deletePartnerTier(tier.id);
                          }
                        }}
                        className="p-2 rounded-xl text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Hapus Tier"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Pricing Matrix Table */}
                  <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#F2E5D8] space-y-2.5">
                    <div className="text-[11px] font-bold text-[#8C6D58] uppercase tracking-wider">
                      Penyesuaian Biaya per Varian Rasa:
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-white rounded-xl border border-[#ECD9C8]">
                        <p className="text-[10px] text-[#8C7362]">Classic</p>
                        <p className="text-xs font-black text-[#321F13]">
                          Rp {tier.priceClassic.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[9px] text-emerald-600 font-semibold">
                          (Normal Rp 3.500)
                        </p>
                      </div>

                      <div className="p-2 bg-white rounded-xl border border-[#ECD9C8]">
                        <p className="text-[10px] text-[#8C7362]">Premium</p>
                        <p className="text-xs font-black text-[#321F13]">
                          Rp {tier.pricePremium.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[9px] text-emerald-600 font-semibold">
                          (Normal Rp 4.000)
                        </p>
                      </div>

                      <div className="p-2 bg-white rounded-xl border border-[#ECD9C8]">
                        <p className="text-[10px] text-[#8C7362]">Special</p>
                        <p className="text-xs font-black text-[#321F13]">
                          Rp {tier.priceSpecial.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[9px] text-emerald-600 font-semibold">
                          (Normal Rp 4.500)
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1 border-t border-[#F0DFD1]">
                      <span className="text-[#6B5242]">Saran Harga Jual Konsumen:</span>
                      <span className="font-bold text-[#3B281B]">
                        Rp {tier.suggestedRetailPrice.toLocaleString('id-ID')} / pcs
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#6B5242]">Estimasi Margin Untung Mitra:</span>
                      <span className="font-black text-[#2E8540]">
                        ~ {tier.estimatedMarginPercent}% (Rp {(tier.suggestedRetailPrice - tier.priceClassic).toLocaleString('id-ID')}/pcs)
                      </span>
                    </div>
                  </div>

                  {/* Free Facilities */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-[#3B281B]">Fasilitas & Layanan Khusus:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tier.freeFacilities.map((fac, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg font-medium"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F2E5D8] flex items-center justify-between text-xs text-[#8C7362]">
                  <span>Status Tier: <strong>{tier.active ? 'Aktif' : 'Non-aktif'}</strong></span>
                  <button
                    type="button"
                    onClick={() => setEditingTier(tier)}
                    className="text-[#C46A18] font-bold hover:underline cursor-pointer"
                  >
                    Ubah Biaya & Detail &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: DAFTAR MITRA AKTIF */}
      {/* ========================================================================= */}
      {activeSubTab === 'partners' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#ECD9C8]">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cari nama usaha, pemilik, alamat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-xs text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-xs font-semibold text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
              >
                <option value="all">Semua Kategori ({partners.length})</option>
                <option value="angkringan">Angkringan</option>
                <option value="kedai_kopi">Kedai Kopi</option>
                <option value="cafe">Cafe & Resto</option>
                <option value="toko_roti">Toko Roti</option>
              </select>
            </div>
          </div>

          {/* Partners Table / Cards */}
          <div className="space-y-4">
            {filteredPartners.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-[#ECD9C8] space-y-2">
                <Store className="h-10 w-10 mx-auto text-stone-300" />
                <p className="font-bold text-[#3B281B] text-sm">Tidak ada data mitra yang cocok</p>
              </div>
            ) : (
              filteredPartners.map((partner) => {
                const tier = partnerTiers.find((t) => t.id === partner.tierId);

                return (
                  <div
                    key={partner.id}
                    className="bg-white rounded-3xl border border-[#ECD9C8] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    {/* Left: Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-[#321F13]">
                          {partner.businessName}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF2E5] text-[#C46A18] border border-[#F5D8BF] uppercase">
                          {partner.category.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            partner.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {partner.status === 'active' ? 'Aktif Beroperasi' : 'Non-aktif'}
                        </span>
                      </div>

                      <p className="text-xs text-[#7A6455] flex items-center gap-3 flex-wrap">
                        <span>Pemilik: <strong>{partner.ownerName}</strong></span>
                        <span>•</span>
                        <span>Lokasi: <strong>{partner.address}, {partner.city}</strong></span>
                      </p>

                      <div className="flex items-center gap-3 text-xs text-[#8C6D58] flex-wrap pt-1">
                        <span className="bg-[#FFFDF9] px-2.5 py-1 rounded-lg border border-[#F0DFD1]">
                          Tier: <strong>{tier?.tierName || 'Custom'}</strong>
                        </span>
                        <span className="bg-[#FFFDF9] px-2.5 py-1 rounded-lg border border-[#F0DFD1]">
                          Suplai Harian: <strong className="text-[#C46A18]">{partner.dailySupplyPcs} Pcs</strong>
                        </span>
                        <span className="bg-[#FFFDF9] px-2.5 py-1 rounded-lg border border-[#F0DFD1]">
                          Sistem: <strong className="capitalize">{partner.paymentModel}</strong>
                        </span>
                        {partner.customDiscountPercent && partner.customDiscountPercent > 0 ? (
                          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                            Diskon Tambahan Khusus: {partner.customDiscountPercent}%
                          </span>
                        ) : null}
                      </div>

                      {partner.notes && (
                        <p className="text-[11px] text-[#9E8370] italic pt-0.5">
                          "{partner.notes}"
                        </p>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#F5E6D8]">
                      <a
                        href={`https://wa.me/${partner.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Halo Kak ${partner.ownerName} (${partner.businessName}), kami dari Dapur Pusat Gabin Fla ingin konfirmasi jadwal suplai harian (${partner.dailySupplyPcs} pcs) untuk besok pagi.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[#25D366]/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Kirim Chat WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Chat WA</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setEditingPartner(partner)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-[#FFF5EB] hover:text-[#C46A18] text-stone-700 transition-colors cursor-pointer"
                        title="Edit Data Mitra & Penyesuaian Biaya"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus mitra "${partner.businessName}" dari sistem?`)) {
                            deletePartner(partner.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-400 transition-colors cursor-pointer"
                        title="Hapus Mitra"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: PENGAJUAN MITRA BARU */}
      {/* ========================================================================= */}
      {activeSubTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#321F13] text-base">
              Daftar Pengajuan dari Formulir Toko / Cafe Online
            </h3>
            <span className="text-xs text-[#8C6D58]">
              Total {partnerApplications.length} Pengajuan
            </span>
          </div>

          <div className="space-y-4">
            {partnerApplications.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-[#ECD9C8] space-y-2">
                <Clock className="h-10 w-10 mx-auto text-stone-300" />
                <p className="font-bold text-[#321F13] text-sm">Belum ada pengajuan kemitraan baru</p>
                <p className="text-xs text-stone-500">Pengajuan yang diisi di formulir publik akan muncul di sini.</p>
              </div>
            ) : (
              partnerApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl border border-[#ECD9C8] p-5 sm:p-6 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F5E6D8]">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-[#321F13]">{app.businessName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF2E5] text-[#C46A18] uppercase">
                        {app.category.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'pending'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    </div>

                    <span className="text-[11px] text-stone-400">
                      Diajukan: {new Date(app.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#7A6455]">
                    <div>
                      <span className="text-stone-400">Penanggung Jawab:</span>
                      <p className="font-bold text-[#3B281B]">{app.ownerName}</p>
                    </div>
                    <div>
                      <span className="text-stone-400">No. WhatsApp:</span>
                      <p className="font-bold text-[#3B281B]">{app.whatsapp}</p>
                    </div>
                    <div>
                      <span className="text-stone-400">Estimasi Kebutuhan:</span>
                      <p className="font-bold text-[#C46A18]">{app.estimatedDailyPcs} Pcs / Hari</p>
                    </div>
                  </div>

                  <div className="text-xs text-[#7A6455] bg-[#FFFDF9] p-3 rounded-2xl border border-[#F2E5D8]">
                    <span className="text-stone-400">Alamat Tempat Usaha:</span>
                    <p className="font-semibold text-[#3B281B] mt-0.5">{app.address}, {app.city}</p>
                    {app.notes && (
                      <p className="text-[11px] text-stone-500 italic mt-1">
                        Catatan: "{app.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                    <a
                      href={`https://wa.me/${app.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Halo Kak ${app.ownerName}, kami dari Gabin Fla ingin menindaklanjuti pengajuan kemitraan untuk ${app.businessName}. Kapan bisa kami jadwalkan pengiriman tester gabin fla?`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[#25D366]/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Hubungi via WA</span>
                    </a>

                    {app.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setApprovingApp(app);
                            setApproveDailyPcs(app.estimatedDailyPcs || 30);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#E88C38] hover:bg-[#D57924] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Setujui & Jadikan Mitra Aktif</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updatePartnerApplicationStatus(app.id, 'rejected')}
                          className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 font-bold text-xs transition-all cursor-pointer"
                        >
                          Tolak
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: SURAT JALAN & DROP-OFF HARIAN */}
      {/* ========================================================================= */}
      {activeSubTab === 'dispatch' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#ECD9C8]">
            <div>
              <h3 className="font-bold text-[#321F13] text-base">
                Surat Jalan & Jadwal Pengiriman Pagi
              </h3>
              <p className="text-xs text-[#8C7362]">
                Total Suplai Pagi Ini: <strong>{totalDailyPcsDispatched} pcs</strong> untuk <strong>{activePartners} lokasi mitra</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={copyDispatchText}
              className="px-4 py-2.5 rounded-2xl bg-[#3B281B] hover:bg-[#25170E] text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Copy className="h-4 w-4" />
              <span>Salin Rekap untuk Driver / Kurir</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((p) => {
              if (p.status !== 'active') return null;
              const tier = partnerTiers.find((t) => t.id === p.tierId);

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-5 border border-[#ECD9C8] shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-[#321F13]">{p.businessName}</h4>
                      <span className="text-xs font-black text-[#C46A18] bg-[#FFF2E5] px-2 py-0.5 rounded-lg border border-[#F5D8BF]">
                        {p.dailySupplyPcs} pcs
                      </span>
                    </div>

                    <p className="text-xs text-[#7A6455]">
                      {p.address}, {p.city}
                    </p>

                    <div className="text-[11px] text-[#8C6D58] bg-[#FFFDF9] p-2.5 rounded-xl border border-[#F2E5D8] space-y-1">
                      <div>Jadwal: <strong>{p.supplySchedule}</strong></div>
                      <div>Sistem: <strong className="capitalize">{p.paymentModel}</strong></div>
                      <div>Kontak: <strong>{p.whatsapp} ({p.ownerName})</strong></div>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${p.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Driver kami sedang menuju lokasi ${p.businessName} membawa suplai ${p.dailySupplyPcs} pcs gabin fla fresh. Mohon ditunggu ya Kak!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Info Driver Meluncur</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT / ADD TIER */}
      {/* ========================================================================= */}
      {(editingTier || isAddingTier) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#ECD9C8] space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0DDD0]">
              <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#321F13]">
                {editingTier ? 'Edit Penyesuaian Biaya Tier' : 'Tambah Tier Harga Baru'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingTier(null);
                  setIsAddingTier(false);
                }}
                className="p-2 rounded-xl text-stone-400 hover:bg-[#FFF5EB] hover:text-[#3B281B] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTier} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3B281B]">Nama Tier Kemitraan</label>
                <input
                  type="text"
                  required
                  value={editingTier ? editingTier.tierName : tierForm.tierName}
                  onChange={(e) => {
                    if (editingTier) setEditingTier({ ...editingTier, tierName: e.target.value });
                    else setTierForm({ ...tierForm, tierName: e.target.value });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3B281B]">Kategori Usaha</label>
                  <select
                    value={editingTier ? editingTier.category : tierForm.category}
                    onChange={(e) => {
                      const val = e.target.value as PartnerCategory;
                      if (editingTier) setEditingTier({ ...editingTier, category: val });
                      else setTierForm({ ...tierForm, category: val });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
                  >
                    <option value="angkringan">Angkringan / Warung</option>
                    <option value="kedai_kopi">Kedai Kopi Santai</option>
                    <option value="cafe">Cafe & Resto</option>
                    <option value="toko_roti">Toko Roti / Oleh-oleh</option>
                    <option value="reseller_kantin">Reseller / Kantin</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3B281B]">Min. Order (Pcs)</label>
                  <input
                    type="number"
                    min="5"
                    value={editingTier ? editingTier.minOrderPcs : tierForm.minOrderPcs}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingTier) setEditingTier({ ...editingTier, minOrderPcs: val });
                      else setTierForm({ ...tierForm, minOrderPcs: val });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
                  />
                </div>
              </div>

              {/* Wholesale Prices */}
              <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#F2E5D8] space-y-3">
                <p className="text-xs font-bold text-[#8C6D58]">Harga Grosir Pasokan per Varian (Rp/pcs):</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-600">Varian Classic</label>
                    <input
                      type="number"
                      step="100"
                      value={editingTier ? editingTier.priceClassic : tierForm.priceClassic}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingTier) setEditingTier({ ...editingTier, priceClassic: val });
                        else setTierForm({ ...tierForm, priceClassic: val });
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#E0CCBC] text-xs font-bold text-[#3B281B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-600">Varian Premium</label>
                    <input
                      type="number"
                      step="100"
                      value={editingTier ? editingTier.pricePremium : tierForm.pricePremium}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingTier) setEditingTier({ ...editingTier, pricePremium: val });
                        else setTierForm({ ...tierForm, pricePremium: val });
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#E0CCBC] text-xs font-bold text-[#3B281B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-600">Varian Special</label>
                    <input
                      type="number"
                      step="100"
                      value={editingTier ? editingTier.priceSpecial : tierForm.priceSpecial}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingTier) setEditingTier({ ...editingTier, priceSpecial: val });
                        else setTierForm({ ...tierForm, priceSpecial: val });
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#E0CCBC] text-xs font-bold text-[#3B281B]"
                    />
                  </div>
                </div>
              </div>

              {/* Retail and Margin */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3B281B]">Saran Harga Jual (Rp)</label>
                  <input
                    type="number"
                    step="500"
                    value={editingTier ? editingTier.suggestedRetailPrice : tierForm.suggestedRetailPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingTier) setEditingTier({ ...editingTier, suggestedRetailPrice: val });
                      else setTierForm({ ...tierForm, suggestedRetailPrice: val });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3B281B]">Model Pembayaran</label>
                  <select
                    value={editingTier ? editingTier.paymentModel : tierForm.paymentModel}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      if (editingTier) setEditingTier({ ...editingTier, paymentModel: val });
                      else setTierForm({ ...tierForm, paymentModel: val });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                  >
                    <option value="konsinyasi">Titip Jual (Konsinyasi)</option>
                    <option value="beli_putus">Beli Putus</option>
                    <option value="tempo_mingguan">Tempo Mingguan</option>
                  </select>
                </div>
              </div>

              {/* Fasilitas & Layanan Khusus */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3B281B]">Fasilitas & Layanan Khusus (Pisahkan koma)</label>
                <input
                  type="text"
                  placeholder="Contoh: Toples Display Kaca, Gratis Ongkir, Spanduk"
                  value={editingTier ? editingTier.freeFacilities.join(', ') : tierForm.freeFacilities.join(', ')}
                  onChange={(e) => {
                    const arr = e.target.value.split(',').map(s => s.trimStart());
                    if (editingTier) setEditingTier({ ...editingTier, freeFacilities: arr });
                    else setTierForm({ ...tierForm, freeFacilities: arr });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B] focus:outline-none focus:ring-2 focus:ring-[#E88C38]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#F0DDD0]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTier(null);
                    setIsAddingTier(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#E88C38] hover:bg-[#D57924] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Simpan Penyesuaian Biaya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT / ADD PARTNER */}
      {/* ========================================================================= */}
      {(editingPartner || isAddingPartner) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#ECD9C8] space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0DDD0]">
              <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#321F13]">
                {editingPartner ? 'Edit Data Mitra' : 'Tambah Mitra Baru'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingPartner(null);
                  setIsAddingPartner(false);
                }}
                className="p-2 rounded-xl text-stone-400 hover:bg-[#FFF5EB] hover:text-[#3B281B] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3B281B]">Nama Tempat Usaha</label>
                  <input
                    type="text"
                    required
                    value={editingPartner ? editingPartner.businessName : partnerForm.businessName}
                    onChange={(e) => {
                      if (editingPartner) setEditingPartner({ ...editingPartner, businessName: e.target.value });
                      else setPartnerForm({ ...partnerForm, businessName: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3B281B]">Nama Pemilik / PIC</label>
                  <input
                    type="text"
                    required
                    value={editingPartner ? editingPartner.ownerName : partnerForm.ownerName}
                    onChange={(e) => {
                      if (editingPartner) setEditingPartner({ ...editingPartner, ownerName: e.target.value });
                      else setPartnerForm({ ...partnerForm, ownerName: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3B281B]">No. WhatsApp Aktif</label>
                  <input
                    type="tel"
                    required
                    value={editingPartner ? editingPartner.whatsapp : partnerForm.whatsapp}
                    onChange={(e) => {
                      if (editingPartner) setEditingPartner({ ...editingPartner, whatsapp: e.target.value });
                      else setPartnerForm({ ...partnerForm, whatsapp: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3B281B]">Pilih Tier Penyesuaian Biaya</label>
                  <select
                    value={editingPartner ? editingPartner.tierId : partnerForm.tierId}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (editingPartner) setEditingPartner({ ...editingPartner, tierId: val });
                      else setPartnerForm({ ...partnerForm, tierId: val });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                  >
                    {partnerTiers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.tierName} (Rp {t.priceClassic}/pcs)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3B281B]">Kebutuhan Suplai Harian (Pcs)</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={editingPartner ? editingPartner.dailySupplyPcs : partnerForm.dailySupplyPcs}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingPartner) setEditingPartner({ ...editingPartner, dailySupplyPcs: val });
                      else setPartnerForm({ ...partnerForm, dailySupplyPcs: val });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3B281B]">Diskon Tambahan Khusus (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    placeholder="0"
                    value={
                      editingPartner
                        ? editingPartner.customDiscountPercent || 0
                        : partnerForm.customDiscountPercent || 0
                    }
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingPartner) setEditingPartner({ ...editingPartner, customDiscountPercent: val });
                      else setPartnerForm({ ...partnerForm, customDiscountPercent: val });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3B281B]">Jadwal Pengantaran</label>
                <input
                  type="text"
                  value={editingPartner ? editingPartner.supplySchedule : partnerForm.supplySchedule}
                  onChange={(e) => {
                    if (editingPartner) setEditingPartner({ ...editingPartner, supplySchedule: e.target.value });
                    else setPartnerForm({ ...partnerForm, supplySchedule: e.target.value });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3B281B]">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  required
                  value={editingPartner ? editingPartner.address : partnerForm.address}
                  onChange={(e) => {
                    if (editingPartner) setEditingPartner({ ...editingPartner, address: e.target.value });
                    else setPartnerForm({ ...partnerForm, address: e.target.value });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#F0DDD0]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPartner(null);
                    setIsAddingPartner(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#E88C38] hover:bg-[#D57924] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Simpan Data Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: APPROVE APPLICATION */}
      {/* ========================================================================= */}
      {approvingApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#ECD9C8] space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0DDD0]">
              <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#321F13]">
                Konfirmasi Persetujuan Mitra
              </h3>
              <button
                type="button"
                onClick={() => setApprovingApp(null)}
                className="p-2 rounded-xl text-stone-400 hover:bg-[#FFF5EB] hover:text-[#3B281B] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#F2E5D8] space-y-2 text-xs">
              <p className="font-bold text-[#3B281B] text-sm">{approvingApp.businessName}</p>
              <p className="text-stone-600">Pemilik: {approvingApp.ownerName} • WA: {approvingApp.whatsapp}</p>
              <p className="text-stone-600">Alamat: {approvingApp.address}, {approvingApp.city}</p>
            </div>

            <form onSubmit={handleApproveAppSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3B281B]">Pilih Tier Penyesuaian Biaya</label>
                <select
                  value={approveTierId}
                  onChange={(e) => setApproveTierId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                >
                  {partnerTiers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tierName} (Rp {t.priceClassic}/pcs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3B281B]">Jumlah Suplai Harian (Pcs)</label>
                <input
                  type="number"
                  min="10"
                  step="5"
                  value={approveDailyPcs}
                  onChange={(e) => setApproveDailyPcs(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3B281B]">Jadwal Drop-Off Rutin</label>
                <input
                  type="text"
                  value={approveSchedule}
                  onChange={(e) => setApproveSchedule(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E0CCBC] text-sm text-[#3B281B]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#F0DDD0]">
                <button
                  type="button"
                  onClick={() => setApprovingApp(null)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Resmikan Jadi Mitra Aktif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};