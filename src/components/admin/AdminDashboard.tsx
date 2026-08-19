import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/mockData';
import { Flavor, BranchLocation, DiscountRule, Order, OrderStatus } from '../../types';
import { AdminPartnershipManager } from './AdminPartnershipManager';
import {
  Coffee,
  MapPin,
  Tag,
  ClipboardList,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Send,
  Eye,
  LogOut,
  ExternalLink,
  Store,
  Sparkles,
  DollarSign,
  TrendingUp,
  Users,
  Smartphone,
  Monitor,
  Download,
  AlertCircle,
  Truck,
  Building2,
  Clock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    adminUser,
    logoutAdmin,
    setView,
    adminTab,
    setAdminTab,
    flavors,
    updateFlavor,
    addFlavor,
    deleteFlavor,
    toggleFlavorAvailability,
    locations,
    updateLocation,
    addLocation,
    deleteLocation,
    discountRules,
    updateDiscountRule,
    addDiscountRule,
    deleteDiscountRule,
    orders,
    updateOrderStatus,
    deleteOrder,
    analytics,
    showToast,
  } = useApp();

  // Modals state
  const [flavorModalOpen, setFlavorModalOpen] = useState(false);
  const [editingFlavor, setEditingFlavor] = useState<Flavor | null>(null);

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<BranchLocation | null>(null);

  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountRule | null>(null);

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // New/Edit Flavor Form State (Disederhanakan menjadi 2 kategori)
  const [flavorForm, setFlavorForm] = useState({
    name: '',
    subtitle: '',
    description: '',
    price: 4000,
    image: '',
    badge: '',
    category: 'classic' as 'classic' | 'special',
    flaColorHex: '#FFF4D0',
    statusMode: 'tersedia' as 'tersedia' | 'habis' | 'coming_soon',
    sweetness: 3,
    richness: 4,
    ingredients: 'Susu Segar, Custard Base, Mentega',
  });

  // Open Flavor Modal
  const handleOpenFlavorModal = (flavor?: Flavor) => {
    if (flavor) {
      setEditingFlavor(flavor);
      
      // Tentukan statusMode berdasarkan available dan badge
      let mode: 'tersedia' | 'habis' | 'coming_soon' = 'tersedia';
      if (!flavor.available) {
        if (flavor.badge?.toLowerCase().includes('coming soon') || flavor.badge?.toLowerCase().includes('segera hadir')) {
          mode = 'coming_soon';
        } else {
          mode = 'habis';
        }
      }

      setFlavorForm({
        name: flavor.name,
        subtitle: flavor.subtitle,
        description: flavor.description,
        price: flavor.price,
        image: flavor.image,
        badge: flavor.badge || '',
        // Otomatis mapping kategori premium lama menjadi special (Signature)
        category: (flavor.category === 'premium' || flavor.category === 'special') ? 'special' : 'classic',
        flaColorHex: flavor.flaColorHex,
        statusMode: mode,
        sweetness: flavor.sweetness,
        richness: flavor.richness,
        ingredients: flavor.ingredients.join(', '),
      });
    } else {
      setEditingFlavor(null);
      setFlavorForm({
        name: '',
        subtitle: '',
        description: '',
        price: 4000,
        image: BRAND_ASSETS.storyHero,
        badge: 'New Flavor',
        category: 'special',
        flaColorHex: '#E59B3C',
        statusMode: 'tersedia',
        sweetness: 3,
        richness: 4,
        ingredients: 'Susu Segar, Custard Base, Mentega',
      });
    }
    setFlavorModalOpen(true);
  };

  const handleSaveFlavor = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredientsArray = flavorForm.ingredients.split(',').map((s) => s.trim()).filter(Boolean);

    let finalAvailable = true;
    let finalBadge = flavorForm.badge;

    if (flavorForm.statusMode === 'habis') {
      finalAvailable = false;
    } else if (flavorForm.statusMode === 'coming_soon') {
      finalAvailable = false;
      finalBadge = 'Coming Soon';
    }

    const payload = {
      name: flavorForm.name,
      subtitle: flavorForm.subtitle,
      description: flavorForm.description,
      price: flavorForm.price,
      image: flavorForm.image,
      badge: finalBadge,
      category: flavorForm.category,
      flaColorHex: flavorForm.flaColorHex,
      available: finalAvailable,
      sweetness: flavorForm.sweetness,
      richness: flavorForm.richness,
      ingredients: ingredientsArray,
    };

    if (editingFlavor) {
      updateFlavor({
        ...editingFlavor,
        ...payload,
      });
    } else {
      addFlavor(payload);
    }
    setFlavorModalOpen(false);
  };

  // Location Form State
  const [locForm, setLocForm] = useState({
    name: '',
    tag: '',
    address: '',
    city: 'Yogyakarta',
    subdistrict: '',
    phone: '',
    whatsapp: '',
    hours: 'Senin - Minggu: 08.00 - 18.00 WIB',
    mapsUrl: '',
    mapsEmbedQuery: '',
    active: true,
    isMainBranch: false,
  });

  const handleOpenLocationModal = (loc?: BranchLocation) => {
    if (loc) {
      setEditingLocation(loc);
      setLocForm({
        name: loc.name,
        tag: loc.tag,
        address: loc.address,
        city: loc.city,
        subdistrict: loc.subdistrict,
        phone: loc.phone,
        whatsapp: loc.whatsapp,
        hours: loc.hours,
        mapsUrl: loc.mapsUrl,
        mapsEmbedQuery: loc.mapsEmbedQuery,
        active: loc.active,
        isMainBranch: loc.isMainBranch || false,
      });
    } else {
      setEditingLocation(null);
      setLocForm({
        name: '',
        tag: 'Pick-up Point',
        address: '',
        city: 'Yogyakarta',
        subdistrict: '',
        phone: '+62 823-1172-4554',
        whatsapp: '6282311724554',
        hours: 'Senin - Minggu: 09.00 - 19.00 WIB',
        mapsUrl: 'https://maps.google.com',
        mapsEmbedQuery: 'Yogyakarta',
        active: true,
        isMainBranch: false,
      });
    }
    setLocationModalOpen(true);
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLocation) {
      updateLocation({
        ...editingLocation,
        ...locForm,
      });
    } else {
      addLocation(locForm);
    }
    setLocationModalOpen(false);
  };

  // Discount Form State
  const [discForm, setDiscForm] = useState({
    minQuantity: 10,
    discountPerPack: 3000,
    label: '',
    description: '',
    active: true,
  });

  const handleOpenDiscountModal = (rule?: DiscountRule) => {
    if (rule) {
      setEditingDiscount(rule);
      setDiscForm({
        minQuantity: rule.minQuantity,
        discountPerPack: rule.discountPerPack,
        label: rule.label,
        description: rule.description,
        active: rule.active,
      });
    } else {
      setEditingDiscount(null);
      setDiscForm({
        minQuantity: 20,
        discountPerPack: 6000,
        label: 'Diskon Spesial 20 Pcs',
        description: 'Potongan Rp 6.000 untuk pembelian minimal 20 pcs.',
        active: true,
      });
    }
    setDiscountModalOpen(true);
  };

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDiscount) {
      updateDiscountRule({
        ...editingDiscount,
        ...discForm,
      });
    } else {
      addDiscountRule(discForm);
    }
    setDiscountModalOpen(false);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  // Export CSV
  const exportOrdersCSV = () => {
    const headers = 'Kode Order,Nama Pelanggan,No WhatsApp,Lokasi Ambil,Tanggal Ambil,Waktu,Total Pcs,Total Harga (Rp),DP 50% (Rp),Status,Tanggal Dibuat\n';
    const rows = orders
      .map(
        (o) =>
          `"${o.orderCode}","${o.customerName}","${o.whatsappNumber}","${o.pickupLocationName}","${o.pickupDate}","${o.pickupTime}",${o.totalPcs},${o.totalPrice},${o.dpAmount},"${o.status}","${o.createdAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pesanan_gabin_fla_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data pesanan berhasil diexport ke file CSV!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#332216]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E8DCD1] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[#FFF5EB] border border-[#ECD3BC] p-1 shadow-xs flex items-center justify-center">
              <img
                src={BRAND_ASSETS.logo}
                alt="Logo"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-[#321F13]">
                  Dashboard CMS Dapur
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {adminUser?.role === 'owner' ? 'Owner Access' : 'Manager'}
                </span>
              </div>
              <p className="text-xs text-[#8A7160]">
                {adminUser?.name || 'Administrator'} ({adminUser?.email || 'akbariimam8@gmail.com'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="admin-to-store-btn"
              type="button"
              onClick={() => setView('store')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF5EB] hover:bg-[#FBECE0] border border-[#ECD3BC] text-xs font-bold text-[#6B513F] transition-colors cursor-pointer"
            >
              <Store className="h-4 w-4 text-[#E88C38]" />
              <span className="hidden sm:inline">Halaman Toko</span>
            </button>

            <button
              id="admin-logout-btn"
              type="button"
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-[#F0E4D8]">
          <button
            type="button"
            onClick={() => setAdminTab('menu')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              adminTab === 'menu'
                ? 'border-[#E88C38] text-[#C46A18]'
                : 'border-transparent text-[#705849] hover:text-[#321F13]'
            }`}
          >
            <Coffee className="h-4 w-4" />
            <span>Manajemen Menu ({flavors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('locations')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              adminTab === 'locations'
                ? 'border-[#E88C38] text-[#C46A18]'
                : 'border-transparent text-[#705849] hover:text-[#321F13]'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Cabang & Pick-up ({locations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('discounts')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              adminTab === 'discounts'
                ? 'border-[#E88C38] text-[#C46A18]'
                : 'border-transparent text-[#705849] hover:text-[#321F13]'
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Aturan Diskon ({discountRules.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('orders')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              adminTab === 'orders'
                ? 'border-[#E88C38] text-[#C46A18]'
                : 'border-transparent text-[#705849] hover:text-[#321F13]'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>Pesanan Masuk ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('partners')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              adminTab === 'partners'
                ? 'border-[#E88C38] text-[#C46A18]'
                : 'border-transparent text-[#705849] hover:text-[#321F13]'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Mitra & Suplai B2B</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('analytics')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              adminTab === 'analytics'
                ? 'border-[#E88C38] text-[#C46A18]'
                : 'border-transparent text-[#705849] hover:text-[#321F13]'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analitik & Statistik</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: MANAJEMEN MENU */}
        {adminTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#321F13]">Daftar Menu & Varian Rasa</h2>
                <p className="text-xs text-[#7A6455]">
                  Kelola harga, foto, deskripsi, warna lapisan 3D, dan ketersediaan stok gabin fla.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenFlavorModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E88C38] hover:bg-[#D57924] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Varian Baru</span>
              </button>
            </div>

            {/* Flavor Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flavors.map((flavor) => {
                const isComingSoon = !flavor.available && (flavor.badge?.toLowerCase().includes('coming soon') || flavor.badge?.toLowerCase().includes('segera hadir'));

                return (
                  <div
                    key={flavor.id}
                    className="bg-white rounded-3xl border border-[#ECD9C7] p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={flavor.image}
                            alt={flavor.name}
                            referrerPolicy="no-referrer"
                            className="h-14 w-14 rounded-2xl object-cover border border-[#ECD3BC] flex-shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-sm text-[#321F13]">{flavor.name}</h3>
                              <span
                                className="h-3 w-3 rounded-full border border-black/10"
                                style={{ backgroundColor: flavor.flaColorHex }}
                                title="Warna Fla 3D"
                              />
                            </div>
                            <p className="text-xs font-bold text-[#C46A18]">
                              Rp {flavor.price.toLocaleString('id-ID')} / pcs
                            </p>
                            <span className="text-[10px] text-[#8C7362]">{flavor.subtitle}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-[#6B5242] line-clamp-2">{flavor.description}</p>

                      {/* Stock & Status Toggle Indicator */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#F2E4D8] text-xs">
                        <span className="text-[#8A7160]">Status Ketersediaan:</span>
                        <button
                          type="button"
                          onClick={() => toggleFlavorAvailability(flavor.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                            flavor.available
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : isComingSoon
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {flavor.available ? 'Tersedia' : isComingSoon ? '✨ Segera Hadir' : 'Habis / Nonaktif'}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F2E4D8]">
                      <button
                        type="button"
                        onClick={() => handleOpenFlavorModal(flavor)}
                        className="px-3 py-1.5 rounded-xl bg-[#FFF5EB] hover:bg-[#FBECE0] text-xs font-bold text-[#6B513F] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5 text-[#E88C38]" />
                        <span>Edit</span>
                      </button>

                      {['classic-vanilla', 'espresso-blend', 'kyoto-matcha', 'red-velvet', 'mixed-berry', 'dark-chocolate'].includes(flavor.id) ? (
                        <button
                          type="button"
                          disabled
                          className="px-3 py-1.5 rounded-xl bg-stone-100 text-xs font-bold text-stone-400 flex items-center gap-1.5 cursor-not-allowed"
                          title="Varian bawaan tidak bisa dihapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Bawaan</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus varian ${flavor.name}?`)) {
                              deleteFlavor(flavor.id);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MANAJEMEN LOKASI */}
        {adminTab === 'locations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#321F13]">Manajemen Cabang & Pick-up Point</h2>
                <p className="text-xs text-[#7A6455]">
                  Atur titik pengambilan pesanan, jam buka, kontak WhatsApp cabang, dan alamat maps.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenLocationModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E88C38] hover:bg-[#D57924] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Cabang Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-white rounded-3xl border border-[#ECD9C7] p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#321F13]">{loc.name}</h3>
                        {loc.isMainBranch && (
                          <span className="text-[10px] bg-[#E88C38] text-white font-bold px-2 py-0.5 rounded-md">
                            Dapur Pusat
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#C46A18] font-semibold">{loc.tag}</p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        loc.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {loc.active ? 'Aktif' : 'Tutup Sementara'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-[#6B5242]">
                    <p><strong>Alamat:</strong> {loc.address}</p>
                    <p><strong>Jam Buka:</strong> {loc.hours}</p>
                    <p><strong>Telepon / WA:</strong> {loc.phone} ({loc.whatsapp})</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F2E4D8]">
                    <button
                      type="button"
                      onClick={() => handleOpenLocationModal(loc)}
                      className="px-3 py-1.5 rounded-xl bg-[#FFF5EB] hover:bg-[#FBECE0] text-xs font-bold text-[#6B513F] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5 text-[#E88C38]" />
                      <span>Edit Cabang</span>
                    </button>
                    {!loc.isMainBranch && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus cabang ${loc.name}?`)) {
                            deleteLocation(loc.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MANAJEMEN DISKON */}
        {adminTab === 'discounts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#321F13]">Aturan Promo & Diskon Pembelian</h2>
                <p className="text-xs text-[#7A6455]">
                  Konfigurasi diskon otomatis berdasarkan kelipatan kuantitas (misal kelipatan 10 pcs).
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenDiscountModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E88C38] hover:bg-[#D57924] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Aturan Diskon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discountRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white rounded-3xl border border-[#ECD9C7] p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-[#321F13]">{rule.label}</h3>
                      <p className="text-xs text-[#7A6455]">{rule.description}</p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        rule.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {rule.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FFF9F2] rounded-2xl border border-[#F5E6D8] space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#8C7362]">Syarat Minimal Kuantitas:</span>
                      <span className="font-bold text-[#3B281B]">{rule.minQuantity} pcs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8C7362]">Besaran Potongan:</span>
                      <span className="font-black text-[#C46A18]">
                        Rp {rule.discountPerPack.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F2E4D8]">
                    <button
                      type="button"
                      onClick={() => handleOpenDiscountModal(rule)}
                      className="px-3 py-1.5 rounded-xl bg-[#FFF5EB] hover:bg-[#FBECE0] text-xs font-bold text-[#6B513F] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5 text-[#E88C38]" />
                      <span>Edit Aturan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus promo ${rule.label}?`)) {
                          deleteDiscountRule(rule.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PESANAN MASUK */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#321F13]">Data Pesanan Pelanggan</h2>
                <p className="text-xs text-[#7A6455]">
                  Pantau pesanan masuk, verifikasi DP 50%, update status produksi & siap ambil.
                </p>
              </div>

              <button
                type="button"
                onClick={exportOrdersCSV}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-[#ECD3BC] hover:bg-[#FFF5EB] text-xs font-bold text-[#4A3324] shadow-xs transition-all cursor-pointer"
              >
                <Download className="h-4 w-4 text-[#E88C38]" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-[#8A7160] mr-1">Status:</span>
              {[
                { key: 'all', label: 'Semua Status' },
                { key: 'menunggu_dp', label: 'Menunggu DP' },
                { key: 'dp_diterima', label: 'DP Diterima' },
                { key: 'proses_produksi', label: 'Proses Produksi' },
                { key: 'siap_diambil', label: 'Siap Diambil' },
                { key: 'selesai', label: 'Selesai' },
              ].map((st) => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setOrderStatusFilter(st.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    orderStatusFilter === st.key
                      ? 'bg-[#3B281B] text-white'
                      : 'bg-white text-[#664F40] border border-[#ECD7C4] hover:bg-[#FFF5EB]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-[#ECD9C7] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF2E8] border-b border-[#ECD9C7] text-[#61493C] font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Kode & Pelanggan</th>
                      <th className="py-3.5 px-4">Cabang & Waktu Ambil</th>
                      <th className="py-3.5 px-4">Rincian Rasa</th>
                      <th className="py-3.5 px-4">Total & DP 50%</th>
                      <th className="py-3.5 px-4">Status Pesanan</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2E4D8]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400 text-sm">
                          Tidak ada data pesanan pada filter ini.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#FFFDF9] transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-[#C46A18] block">
                              {order.orderCode}
                            </span>
                            <span className="font-bold text-[#321F13] text-sm block">
                              {order.customerName}
                            </span>
                            <a
                              href={`https://wa.me/${order.whatsappNumber.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
                            >
                              <Send className="h-3 w-3" />
                              {order.whatsappNumber}
                            </a>
                          </td>

                          <td className="py-3.5 px-4 text-[#5C4537]">
                            <span className="font-semibold block">{order.pickupLocationName}</span>
                            <span className="text-[11px] text-[#8A7160]">
                              📅 {order.pickupDate} • ⏰ {order.pickupTime} WIB
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-[#321F13] block">
                              {order.totalPcs} pcs Gabin Fla
                            </span>
                            <div className="space-y-0.5 text-[11px] text-[#7A6455] max-w-xs">
                              {order.items.map((it, idx) => (
                                <p key={idx}>• {it.flavorName} ({it.quantity} pcs)</p>
                              ))}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-black text-sm text-[#321F13] block">
                              Rp {order.totalPrice.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[11px] text-emerald-700 font-bold block">
                              DP: Rp {order.dpAmount.toLocaleString('id-ID')}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order.id, e.target.value as OrderStatus)
                              }
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                                order.status === 'selesai'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : order.status === 'siap_diambil'
                                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                                  : order.status === 'proses_produksi'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : order.status === 'dp_diterima'
                                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                                  : 'bg-stone-100 text-stone-800 border-stone-300'
                              }`}
                            >
                              <option value="menunggu_dp">Menunggu DP 50%</option>
                              <option value="dp_diterima">DP Diterima</option>
                              <option value="proses_produksi">Proses Produksi</option>
                              <option value="siap_diambil">Siap Diambil</option>
                              <option value="selesai">Selesai</option>
                              <option value="dibatalkan">Dibatalkan</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Hapus pesanan ${order.orderCode}?`)) {
                                  deleteOrder(order.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Pesanan"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ANALITIK & STATISTIK */}
        {adminTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#321F13]">Analitik Penjualan & Pengunjung</h2>
              <p className="text-xs text-[#7A6455]">
                Ringkasan performa penjualan harian, tren rasa paling diminati, dan trafik pengguna.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-3xl border border-[#ECD9C7] p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8A7160]">Pengunjung Hari Ini</span>
                  <Users className="h-4 w-4 text-amber-600" />
                </div>
                <p className="text-2xl font-black text-[#321F13]">
                  {analytics.todayVisits.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#ECD9C7] p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8A7160]">Total Pesanan Masuk</span>
                  <ClipboardList className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl font-black text-[#321F13]">{orders.length} Pesanan</p>
              </div>

              <div className="bg-white rounded-3xl border border-[#ECD9C7] p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8A7160]">Estimasi Omzet</span>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-emerald-700">
                  Rp {orders.reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#ECD9C7] p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8A7160]">Varian Terlaris</span>
                  <Sparkles className="h-4 w-4 text-rose-600" />
                </div>
                <p className="text-lg font-black text-[#321F13] truncate">
                  {analytics.topFlavorName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MANAJEMEN MITRA & B2B */}
        {adminTab === 'partners' && <AdminPartnershipManager />}
      </main>

      {/* MODAL: ADD / EDIT FLAVOR (Dilengkapi Pilihan Status Mode & Kategori yang Disederhanakan) */}
      {flavorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#ECD9C7] p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#F2E4D8] pb-3">
              <h3 className="font-bold text-base text-[#321F13]">
                {editingFlavor ? 'Edit Varian Rasa' : 'Tambah Varian Rasa Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setFlavorModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFlavor} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4A3427]">Kategori Menu</label>
                  <select
                    value={flavorForm.category}
                    onChange={(e) => setFlavorForm({ ...flavorForm, category: e.target.value as 'classic' | 'special' })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] text-xs bg-[#FFFCF8] font-bold text-[#C46A18]"
                  >
                    <option value="classic">Classic Vanilla</option>
                    <option value="special">Signature Flavors</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#4A3427]">Nama Varian Rasa</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Belgian Dark Chocolate"
                    value={flavorForm.name}
                    onChange={(e) => setFlavorForm({ ...flavorForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] text-xs bg-[#FFFCF8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4A3427]">Subjudul / Tagline</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Resep Autentik"
                    value={flavorForm.subtitle}
                    onChange={(e) => setFlavorForm({ ...flavorForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] text-xs bg-[#FFFCF8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4A3427]">Harga per Pcs (Rp)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={500}
                    value={flavorForm.price}
                    onChange={(e) =>
                      setFlavorForm({ ...flavorForm, price: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] text-xs bg-[#FFFCF8]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4A3427]">Deskripsi Rasa</label>
                <textarea
                  rows={2}
                  required
                  value={flavorForm.description}
                  onChange={(e) => setFlavorForm({ ...flavorForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] text-xs bg-[#FFFCF8]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4A3427]">URL Foto Produk (Hotlink)</label>
                <input
                  type="url"
                  required
                  value={flavorForm.image}
                  onChange={(e) => setFlavorForm({ ...flavorForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] text-xs bg-[#FFFCF8]"
                />
              </div>

              {/* Status Mode Selector */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-[#FFF9F2] border border-[#F2E2D2]">
                <label className="font-bold text-[#4A3427] block">Status Tampilan Menu</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFlavorForm({ ...flavorForm, statusMode: 'tersedia' })}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      flavorForm.statusMode === 'tersedia'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    Tersedia
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlavorForm({ ...flavorForm, statusMode: 'coming_soon' })}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      flavorForm.statusMode === 'coming_soon'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    ✨ Coming Soon
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlavorForm({ ...flavorForm, statusMode: 'habis' })}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      flavorForm.statusMode === 'habis'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    Habis / Nonaktif
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4A3427]">Warna Fla 3D (Hex Code)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={flavorForm.flaColorHex}
                      onChange={(e) => setFlavorForm({ ...flavorForm, flaColorHex: e.target.value })}
                      className="h-8 w-12 rounded-lg border border-[#DECBC0] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={flavorForm.flaColorHex}
                      onChange={(e) => setFlavorForm({ ...flavorForm, flaColorHex: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-[#DECBC0] text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4A3427]">Badge Label (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Best Seller / Coming Soon"
                    value={flavorForm.badge}
                    onChange={(e) => setFlavorForm({ ...flavorForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] text-xs bg-[#FFFCF8]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4A3427]">Komposisi (Pisahkan koma)</label>
                <input
                  type="text"
                  value={flavorForm.ingredients}
                  onChange={(e) => setFlavorForm({ ...flavorForm, ingredients: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] text-xs bg-[#FFFCF8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F2E4D8]">
                <button
                  type="button"
                  onClick={() => setFlavorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#664F40] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E88C38] hover:bg-[#D57924] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Simpan Varian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT LOCATION */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#ECD9C7] p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#F2E4D8] pb-3">
              <h3 className="font-bold text-base text-[#321F13]">
                {editingLocation ? 'Edit Cabang Pengambilan' : 'Tambah Cabang Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setLocationModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#4A3427]">Nama Cabang</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Outlet Cabang - Kaliurang Sleman"
                  value={locForm.name}
                  onChange={(e) => setLocForm({ ...locForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] bg-[#FFFCF8]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4A3427]">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  required
                  value={locForm.address}
                  onChange={(e) => setLocForm({ ...locForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] bg-[#FFFCF8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4A3427]">Nomor Telepon</label>
                  <input
                    type="text"
                    required
                    value={locForm.phone}
                    onChange={(e) => setLocForm({ ...locForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] bg-[#FFFCF8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4A3427]">Nomor WhatsApp Cabang</label>
                  <input
                    type="text"
                    required
                    value={locForm.whatsapp}
                    onChange={(e) => setLocForm({ ...locForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] bg-[#FFFCF8]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4A3427]">Jam Operasional</label>
                <input
                  type="text"
                  required
                  value={locForm.hours}
                  onChange={(e) => setLocForm({ ...locForm, hours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] bg-[#FFFCF8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F2E4D8]">
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#664F40] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E88C38] hover:bg-[#D57924] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Simpan Cabang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT DISCOUNT */}
      {discountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#ECD9C7] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2E4D8] pb-3">
              <h3 className="font-bold text-base text-[#321F13]">
                {editingDiscount ? 'Edit Aturan Diskon' : 'Tambah Promo Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setDiscountModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDiscount} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#4A3427]">Nama / Label Diskon</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Diskon Paket 10 Pcs"
                  value={discForm.label}
                  onChange={(e) => setDiscForm({ ...discForm, label: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] bg-[#FFFCF8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4A3427]">Min. Pembelian (Pcs)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={discForm.minQuantity}
                    onChange={(e) =>
                      setDiscForm({ ...discForm, minQuantity: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] bg-[#FFFCF8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4A3427]">Potongan Diskon (Rp)</label>
                  <input
                    type="number"
                    min={500}
                    step={500}
                    required
                    value={discForm.discountPerPack}
                    onChange={(e) =>
                      setDiscForm({ ...discForm, discountPerPack: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] bg-[#FFFCF8]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4A3427]">Deskripsi Promo</label>
                <textarea
                  rows={2}
                  required
                  value={discForm.description}
                  onChange={(e) => setDiscForm({ ...discForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DECBC0] bg-[#FFFCF8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F2E4D8]">
                <button
                  type="button"
                  onClick={() => setDiscountModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#664F40] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E88C38] hover:bg-[#D57924] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Simpan Diskon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};