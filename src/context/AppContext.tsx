import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Flavor,
  DiscountRule,
  BranchLocation,
  Order,
  CartItem,
  AdminUser,
  AnalyticsData,
  OrderItemSummary,
  Partner,
  PartnerPricingTier,
  PartnerApplication,
} from '../types';
import {
  INITIAL_FLAVORS,
  INITIAL_DISCOUNT_RULES,
  INITIAL_LOCATIONS,
  INITIAL_ORDERS,
  INITIAL_ANALYTICS,
  INITIAL_PARTNER_TIERS,
  INITIAL_PARTNERS,
  INITIAL_PARTNER_APPLICATIONS,
} from '../data/mockData';

// --- FIREBASE IMPORTS ---
import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  // Storefront Data
  flavors: Flavor[];
  discountRules: DiscountRule[];
  locations: BranchLocation[];
  orders: Order[];
  analytics: AnalyticsData;

  // B2B Partnership Data & Pricing Tiers
  partnerTiers: PartnerPricingTier[];
  partners: Partner[];
  partnerApplications: PartnerApplication[];

  // Cart & Order
  cart: CartItem[];
  addToCart: (flavorId: string, quantity?: number) => boolean;
  removeFromCart: (flavorId: string) => void;
  updateCartQuantity: (flavorId: string, quantity: number) => boolean;
  clearCart: () => void;
  selectedFlavorCount: number;
  canAddFlavor: (flavorId: string) => boolean;
  cartTotalPcs: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartDiscountNote: string;
  cartTotal: number;
  cartDp: number;
  cartRemaining: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // 3D Preview State
  previewFlavorId: string;
  setPreviewFlavorId: (flavorId: string) => void;
  previewFlavor: Flavor;

  // Order Placement
  createOrder: (data: {
    customerName: string;
    whatsappNumber: string;
    pickupLocationId: string;
    pickupDate: string;
    pickupTime: string;
    notes?: string;
  }) => { order: Order; whatsappUrl: string } | null;

  // Navigation View
  view: 'store' | 'admin-login' | 'admin-dashboard';
  setView: (view: 'store' | 'admin-login' | 'admin-dashboard') => void;
  adminTab: 'menu' | 'locations' | 'discounts' | 'orders' | 'partners' | 'analytics';
  setAdminTab: (tab: 'menu' | 'locations' | 'discounts' | 'orders' | 'partners' | 'analytics') => void;

  // Admin Auth (Hanya menggunakan Google Firebase)
  adminUser: AdminUser | null;
  loginWithGoogle: () => void;
  logoutAdmin: () => void;

  // CMS Management Actions
  updateFlavor: (updated: Flavor) => void;
  addFlavor: (flavor: Omit<Flavor, 'id'>) => void;
  deleteFlavor: (flavorId: string) => void;
  toggleFlavorAvailability: (flavorId: string) => void;

  updateLocation: (updated: BranchLocation) => void;
  addLocation: (loc: Omit<BranchLocation, 'id'>) => void;
  deleteLocation: (locId: string) => void;

  updateDiscountRule: (updated: DiscountRule) => void;
  addDiscountRule: (rule: Omit<DiscountRule, 'id'>) => void;
  deleteDiscountRule: (ruleId: string) => void;

  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;

  // B2B Partner CMS Actions
  updatePartnerTier: (updated: PartnerPricingTier) => void;
  addPartnerTier: (tier: Omit<PartnerPricingTier, 'id'>) => void;
  deletePartnerTier: (tierId: string) => void;

  addPartner: (partner: Omit<Partner, 'id' | 'registeredAt' | 'totalSuppliedPcs' | 'totalRevenueValue'>) => void;
  updatePartner: (updated: Partner) => void;
  deletePartner: (partnerId: string) => void;

  submitPartnerApplication: (appData: Omit<PartnerApplication, 'id' | 'createdAt' | 'status'>) => string;
  updatePartnerApplicationStatus: (appId: string, status: 'pending' | 'approved' | 'rejected') => void;
  convertApplicationToPartner: (appId: string, tierId: string, dailyPcs: number, schedule: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;

  // Utility calculation
  calculateOrderPricing: (cartItems: CartItem[]) => {
    totalPcs: number;
    subtotal: number;
    discount: number;
    discountNote: string;
    total: number;
    dp: number;
    remaining: number;
    itemSummaries: OrderItemSummary[];
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const [flavors, setFlavors] = useState<Flavor[]>(() => {
    const saved = localStorage.getItem('gabin_flavors');
    return saved ? JSON.parse(saved) : INITIAL_FLAVORS;
  });

  const [discountRules, setDiscountRules] = useState<DiscountRule[]>(() => {
    const saved = localStorage.getItem('gabin_discounts');
    return saved ? JSON.parse(saved) : INITIAL_DISCOUNT_RULES;
  });

  const [locations, setLocations] = useState<BranchLocation[]>(() => {
    const saved = localStorage.getItem('gabin_locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gabin_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [partnerTiers, setPartnerTiers] = useState<PartnerPricingTier[]>(() => {
    const saved = localStorage.getItem('gabin_partner_tiers');
    return saved ? JSON.parse(saved) : INITIAL_PARTNER_TIERS;
  });

  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('gabin_partners');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>(() => {
    const saved = localStorage.getItem('gabin_partner_applications');
    return saved ? JSON.parse(saved) : INITIAL_PARTNER_APPLICATIONS;
  });

  // Initial cart: Diubah menjadi array kosong agar tidak ada menu dummy
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gabin_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return []; // Kembali sebagai array kosong
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [previewFlavorId, setPreviewFlavorId] = useState<string>('classic-vanilla');
  const [view, setView] = useState<'store' | 'admin-login' | 'admin-dashboard'>('store');
  const [adminTab, setAdminTab] = useState<'menu' | 'locations' | 'discounts' | 'orders' | 'partners' | 'analytics'>('menu');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('gabin_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [analytics] = useState<AnalyticsData>(INITIAL_ANALYTICS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- FIREBASE REAL-TIME SYNC ---
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Menggabungkan 6 rasa bawaan (built-in) dengan data dari Firebase
    unsubs.push(onSnapshot(collection(db, 'flavors'), (snap) => {
      const baseFlavorsMap = new Map(INITIAL_FLAVORS.map(f => [f.id, f]));
      
      if (!snap.empty) {
        snap.docs.forEach(d => {
          const data = d.data() as Flavor;
          baseFlavorsMap.set(data.id, data);
        });
      }
      
      setFlavors(Array.from(baseFlavorsMap.values()));
    }));
    
    unsubs.push(onSnapshot(collection(db, 'discountRules'), (snap) => {
      if (!snap.empty) setDiscountRules(snap.docs.map(d => d.data() as DiscountRule));
    }));
    unsubs.push(onSnapshot(collection(db, 'locations'), (snap) => {
      if (!snap.empty) setLocations(snap.docs.map(d => d.data() as BranchLocation));
    }));
    unsubs.push(onSnapshot(collection(db, 'orders'), (snap) => {
      if (!snap.empty) setOrders(snap.docs.map(d => d.data() as Order));
    }));
    unsubs.push(onSnapshot(collection(db, 'partnerTiers'), (snap) => {
      if (!snap.empty) setPartnerTiers(snap.docs.map(d => d.data() as PartnerPricingTier));
    }));
    unsubs.push(onSnapshot(collection(db, 'partners'), (snap) => {
      if (!snap.empty) setPartners(snap.docs.map(d => d.data() as Partner));
    }));
    unsubs.push(onSnapshot(collection(db, 'partnerApplications'), (snap) => {
      if (!snap.empty) setPartnerApplications(snap.docs.map(d => d.data() as PartnerApplication));
    }));

    return () => unsubs.forEach(unsub => unsub());
  }, []);

  // --- FIREBASE AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const adminData: AdminUser = {
          email: user.email || '',
          name: user.displayName || 'Admin',
          role: 'owner',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          provider: 'google',
        };
        setAdminUser(adminData);
      } else {
        setAdminUser(null); // Membersihkan cache jika Firebase menyatakan user log out
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync to localStorage (Offline Cache)
  useEffect(() => { localStorage.setItem('gabin_flavors', JSON.stringify(flavors)); }, [flavors]);
  useEffect(() => { localStorage.setItem('gabin_discounts', JSON.stringify(discountRules)); }, [discountRules]);
  useEffect(() => { localStorage.setItem('gabin_locations', JSON.stringify(locations)); }, [locations]);
  useEffect(() => { localStorage.setItem('gabin_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('gabin_partner_tiers', JSON.stringify(partnerTiers)); }, [partnerTiers]);
  useEffect(() => { localStorage.setItem('gabin_partners', JSON.stringify(partners)); }, [partners]);
  useEffect(() => { localStorage.setItem('gabin_partner_applications', JSON.stringify(partnerApplications)); }, [partnerApplications]);
  useEffect(() => { localStorage.setItem('gabin_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    if (adminUser) localStorage.setItem('gabin_admin_user', JSON.stringify(adminUser));
    else localStorage.removeItem('gabin_admin_user');
  }, [adminUser]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => { dismissToast(id); }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Preview flavor helper (Menambahkan safe fallback untuk database kosong)
  const safeFallbackFlavor: Flavor = {
    id: 'empty-state',
    name: 'Belum Ada Varian',
    subtitle: 'Menunggu Data',
    description: '',
    price: 0,
    image: '',
    category: 'classic',
    flaColorHex: '#FFF4D0', // Fallback warna agar 3D tidak error
    available: false,
    sweetness: 0,
    richness: 0,
    ingredients: []
  };
  const previewFlavor = flavors.find((f) => f.id === previewFlavorId) || flavors[0] || INITIAL_FLAVORS[0] || safeFallbackFlavor;

  // Pricing calculation helper
  const calculateOrderPricing = (cartItems: CartItem[]) => {
    let totalPcs = 0;
    let subtotal = 0;
    const itemSummaries: OrderItemSummary[] = [];

    cartItems.forEach((ci) => {
      const flavor = flavors.find((f) => f.id === ci.flavorId);
      if (flavor && ci.quantity > 0) {
        const itemTotal = flavor.price * ci.quantity;
        totalPcs += ci.quantity;
        subtotal += itemTotal;
        itemSummaries.push({
          flavorId: flavor.id,
          flavorName: flavor.name,
          price: flavor.price,
          quantity: ci.quantity,
          itemTotal,
        });
      }
    });

    let discount = 0;
    const discountNotes: string[] = [];

    // Calculate discount per 10 pcs
    const activePer10Rule = discountRules.find((r) => r.active && r.minQuantity === 10);
    if (activePer10Rule && totalPcs >= 10) {
      const batches = Math.floor(totalPcs / 10);
      const discountPer10 = batches * activePer10Rule.discountPerPack;
      discount += discountPer10;
      discountNotes.push(`Diskon Kelipatan 10 Pcs (${batches}x = Rp ${discountPer10.toLocaleString('id-ID')})`);
    }

    // Calculate jumbo discount (>=50 pcs)
    const activeJumboRule = discountRules.find((r) => r.active && r.minQuantity >= 50);
    if (activeJumboRule && totalPcs >= activeJumboRule.minQuantity) {
      discount += activeJumboRule.discountPerPack;
      discountNotes.push(`Bonus Jumbo 50+ Pcs (Rp ${activeJumboRule.discountPerPack.toLocaleString('id-ID')})`);
    }

    const total = Math.max(0, subtotal - discount);
    const dp = Math.round(total * 0.5);
    const remaining = total - dp;

    return {
      totalPcs,
      subtotal,
      discount,
      discountNote: discountNotes.join(' + ') || 'Harga Normal',
      total,
      dp,
      remaining,
      itemSummaries,
    };
  };

  // Cart Pricing summary
  const pricing = calculateOrderPricing(cart);
  const cartTotalPcs = pricing.totalPcs;
  const cartSubtotal = pricing.subtotal;
  const cartDiscount = pricing.discount;
  const cartDiscountNote = pricing.discountNote;
  const cartTotal = pricing.total;
  const cartDp = pricing.dp;
  const cartRemaining = pricing.remaining;

  // 2-Flavor Constraint Helpers
  const activeCartItems = cart.filter((item) => item.quantity > 0);
  const selectedFlavorCount = activeCartItems.length;

  const canAddFlavor = (flavorId: string): boolean => {
    const isAlreadyInCart = activeCartItems.some((item) => item.flavorId === flavorId);
    if (isAlreadyInCart) return true;
    return selectedFlavorCount < 2;
  };

  const addToCart = (flavorId: string, quantity = 1): boolean => {
    const isAlreadyInCart = activeCartItems.some((item) => item.flavorId === flavorId);

    if (!isAlreadyInCart && selectedFlavorCount >= 2) {
      showToast(
        'Satu kotak dibatasi maksimal 2 varian rasa (misal: 5 Vanilla + 5 Cokelat). Hapus salah satu rasa terlebih dahulu.',
        'warning'
      );
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.flavorId === flavorId);
      if (existing) {
        return prev.map((item) =>
          item.flavorId === flavorId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { flavorId, quantity }];
    });

    const flavor = flavors.find((f) => f.id === flavorId);
    showToast(`+${quantity} ${flavor ? flavor.name : 'item'} dimasukkan ke kotak`, 'success');
    return true;
  };

  const removeFromCart = (flavorId: string) => {
    setCart((prev) => prev.filter((item) => item.flavorId !== flavorId));
    showToast('Varian rasa dihapus dari kotak', 'info');
  };

  const updateCartQuantity = (flavorId: string, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(flavorId);
      return true;
    }

    const isAlreadyInCart = activeCartItems.some((item) => item.flavorId === flavorId);
    if (!isAlreadyInCart && selectedFlavorCount >= 2) {
      showToast(
        'Satu kotak dibatasi maksimal 2 varian rasa. Hapus salah satu varian sebelum menambah rasa baru.',
        'warning'
      );
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.flavorId === flavorId);
      if (existing) {
        return prev.map((item) => (item.flavorId === flavorId ? { ...item, quantity } : item));
      }
      return [...prev, { flavorId, quantity }];
    });
    return true;
  };

  const clearCart = () => {
    setCart([]);
  };

  // Create Order & Build WhatsApp message
  const createOrder = (data: {
    customerName: string;
    whatsappNumber: string;
    pickupLocationId: string;
    pickupDate: string;
    pickupTime: string;
    notes?: string;
  }) => {
    const loc = locations.find((l) => l.id === data.pickupLocationId) || locations[0];
    const { totalPcs, subtotal, discount, discountNote, total, dp, remaining, itemSummaries } =
      calculateOrderPricing(cart);

    if (totalPcs < 10) {
      showToast('Minimal pemesanan adalah 10 pcs gabin fla.', 'warning');
      return null;
    }

    if (itemSummaries.length > 2) {
      showToast('Pesanan melebihi batas 2 varian rasa per kotak.', 'error');
      return null;
    }

    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `GBN-${new Date().getFullYear()}-${orderNum}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderCode,
      customerName: data.customerName,
      whatsappNumber: data.whatsappNumber,
      pickupLocationId: loc ? loc.id : 'loc-jogja-pusat',
      pickupLocationName: loc ? loc.name : 'Dapur Pusat - Kotabaru Jogja',
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      items: itemSummaries,
      totalPcs,
      subtotal,
      discount,
      appliedDiscountNote: discount > 0 ? discountNote : undefined,
      totalPrice: total,
      dpAmount: dp,
      remainingAmount: remaining,
      notes: data.notes,
      status: 'menunggu_dp',
      createdAt: new Date().toISOString(),
    };

    // Optimistic Update & Firebase Sync
    setOrders((prev) => [newOrder, ...prev]);
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(console.error);

    // Construct WhatsApp message
    const itemsText = itemSummaries
      .map((it) => `• ${it.flavorName}: ${it.quantity} pcs (Rp ${it.itemTotal.toLocaleString('id-ID')})`)
      .join('\n');

    const message = `Halo Admin Gabin Isi Fla, saya ingin mengonfirmasi pesanan:

📋 *KODE PESANAN:* ${orderCode}
👤 *Nama Pemesan:* ${data.customerName}
📱 *WhatsApp:* ${data.whatsappNumber}

📦 *Rincian Pesanan (Maks 2 Rasa):*
${itemsText}
✨ *Total Kuantitas:* ${totalPcs} pcs

💰 *Subtotal:* Rp ${subtotal.toLocaleString('id-ID')}
🏷️ *Diskon:* ${discount > 0 ? `Rp ${discount.toLocaleString('id-ID')} (${discountNote})` : 'Rp 0'}
💵 *TOTAL AKHIR:* Rp ${total.toLocaleString('id-ID')}
💳 *DP 50% yang Ditransfer:* Rp ${dp.toLocaleString('id-ID')}
🤝 *Sisa Pelunasan saat Ambil:* Rp ${remaining.toLocaleString('id-ID')}

📍 *Lokasi Pick-up:* ${loc ? loc.name : 'Dapur Pusat Kotabaru'}
📅 *Tanggal Pick-up:* ${data.pickupDate}
⏰ *Waktu Pengambilan:* ${data.pickupTime} WIB
${data.notes ? `📝 *Catatan Khusus:* ${data.notes}\n` : ''}
Mohon kirimkan nomor rekening / QRIS untuk pembayaran DP 50% agar pesanan segera diproduksi. Terima kasih!`;

    const targetWaNumber = loc && loc.whatsapp ? loc.whatsapp.replace(/\D/g, '') : '6282311724554';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${targetWaNumber}?text=${encodedMessage}`;

    showToast('Pesanan berhasil dibuat! Mengarahkan ke WhatsApp...', 'success');

    return { order: newOrder, whatsappUrl };
  };

  // Google Authentication Handler for Admin Mode
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const adminData: AdminUser = {
        email: user.email || '',
        name: user.displayName || 'Admin',
        role: 'owner',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        provider: 'google',
      };
      setAdminUser(adminData);
      setView('admin-dashboard');
      showToast(`Berhasil masuk dengan Akun Google: ${user.email}`, 'success');
    } catch (error: any) {
      console.error(error);
      showToast('Gagal login dengan Google.', 'error');
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
    } catch (e) { console.error(e); }
    setAdminUser(null);
    setView('store');
    showToast('Anda telah keluar dari Portal Admin.', 'info');
  };

  // CMS Flavor Actions
  const updateFlavor = (updated: Flavor) => {
    setFlavors((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    setDoc(doc(db, 'flavors', updated.id), updated).catch(console.error);
    showToast(`Varian "${updated.name}" berhasil diperbarui`, 'success');
  };

  const addFlavor = (flavorData: Omit<Flavor, 'id'>) => {
    const id = `flavor-${Date.now()}`;
    const newFlavor: Flavor = { ...flavorData, id };
    setFlavors((prev) => [...prev, newFlavor]);
    setDoc(doc(db, 'flavors', id), newFlavor).catch(console.error);
    showToast(`Varian baru "${newFlavor.name}" berhasil ditambahkan ke menu`, 'success');
  };

  const deleteFlavor = (flavorId: string) => {
    setFlavors((prev) => prev.filter((f) => f.id !== flavorId));
    deleteDoc(doc(db, 'flavors', flavorId)).catch(console.error);
    showToast('Varian berhasil dihapus dari menu', 'info');
  };

  const toggleFlavorAvailability = (flavorId: string) => {
    const flavor = flavors.find((f) => f.id === flavorId);
    if (flavor) {
      const nextState = !flavor.available;
      setFlavors((prev) => prev.map((f) => (f.id === flavorId ? { ...f, available: nextState } : f)));
      updateDoc(doc(db, 'flavors', flavorId), { available: nextState }).catch(console.error);
      showToast(`Status "${flavor.name}" diubah menjadi: ${nextState ? 'Tersedia' : 'Habis / Nonaktif'}`, nextState ? 'success' : 'warning');
    }
  };

  // CMS Location Actions
  const updateLocation = (updated: BranchLocation) => {
    setLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setDoc(doc(db, 'locations', updated.id), updated).catch(console.error);
    showToast(`Lokasi cabang "${updated.name}" berhasil diperbarui`, 'success');
  };

  const addLocation = (locData: Omit<BranchLocation, 'id'>) => {
    const id = `loc-${Date.now()}`;
    const newLoc: BranchLocation = { ...locData, id };
    setLocations((prev) => [...prev, newLoc]);
    setDoc(doc(db, 'locations', id), newLoc).catch(console.error);
    showToast(`Lokasi cabang baru "${newLoc.name}" ditambahkan`, 'success');
  };

  const deleteLocation = (locId: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== locId));
    deleteDoc(doc(db, 'locations', locId)).catch(console.error);
    showToast('Lokasi cabang dihapus', 'info');
  };

  // CMS Discount Actions
  const updateDiscountRule = (updated: DiscountRule) => {
    setDiscountRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setDoc(doc(db, 'discountRules', updated.id), updated).catch(console.error);
    showToast(`Aturan promo "${updated.label}" diperbarui`, 'success');
  };

  const addDiscountRule = (ruleData: Omit<DiscountRule, 'id'>) => {
    const id = `disc-${Date.now()}`;
    const newRule: DiscountRule = { ...ruleData, id };
    setDiscountRules((prev) => [...prev, newRule]);
    setDoc(doc(db, 'discountRules', id), newRule).catch(console.error);
    showToast(`Aturan diskon baru "${newRule.label}" ditambahkan`, 'success');
  };

  const deleteDiscountRule = (ruleId: string) => {
    setDiscountRules((prev) => prev.filter((r) => r.id !== ruleId));
    deleteDoc(doc(db, 'discountRules', ruleId)).catch(console.error);
    showToast('Aturan diskon dihapus', 'info');
  };

  // CMS Orders Actions
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    updateDoc(doc(db, 'orders', orderId), { status }).catch(console.error);
    showToast(`Status pesanan berhasil diperbarui ke: ${status.toUpperCase()}`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    deleteDoc(doc(db, 'orders', orderId)).catch(console.error);
    showToast('Data pesanan berhasil dihapus', 'info');
  };

  // CMS Partner Pricing Tier Actions
  const updatePartnerTier = (updated: PartnerPricingTier) => {
    setPartnerTiers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setDoc(doc(db, 'partnerTiers', updated.id), updated).catch(console.error);
    showToast(`Penyesuaian biaya untuk tier "${updated.tierName}" berhasil disimpan`, 'success');
  };

  const addPartnerTier = (tierData: Omit<PartnerPricingTier, 'id'>) => {
    const id = `tier-${Date.now()}`;
    const newTier: PartnerPricingTier = { ...tierData, id };
    setPartnerTiers((prev) => [...prev, newTier]);
    setDoc(doc(db, 'partnerTiers', id), newTier).catch(console.error);
    showToast(`Tier kemitraan baru "${newTier.tierName}" berhasil ditambahkan`, 'success');
  };

  const deletePartnerTier = (tierId: string) => {
    setPartnerTiers((prev) => prev.filter((t) => t.id !== tierId));
    deleteDoc(doc(db, 'partnerTiers', tierId)).catch(console.error);
    showToast('Tier kemitraan berhasil dihapus', 'info');
  };

  // CMS Partner Actions
  const addPartner = (partnerData: Omit<Partner, 'id' | 'registeredAt' | 'totalSuppliedPcs' | 'totalRevenueValue'>) => {
    const id = `ptr-${Date.now().toString().slice(-4)}`;
    const newPartner: Partner = {
      ...partnerData,
      id,
      registeredAt: new Date().toISOString().split('T')[0],
      totalSuppliedPcs: 0,
      totalRevenueValue: 0,
    };
    setPartners((prev) => [newPartner, ...prev]);
    setDoc(doc(db, 'partners', id), newPartner).catch(console.error);
    showToast(`Mitra "${newPartner.businessName}" berhasil didaftarkan`, 'success');
  };

  const updatePartner = (updated: Partner) => {
    setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setDoc(doc(db, 'partners', updated.id), updated).catch(console.error);
    showToast(`Data kemitraan "${updated.businessName}" diperbarui`, 'success');
  };

  const deletePartner = (partnerId: string) => {
    setPartners((prev) => prev.filter((p) => p.id !== partnerId));
    deleteDoc(doc(db, 'partners', partnerId)).catch(console.error);
    showToast('Mitra berhasil dihapus dari sistem', 'info');
  };

  // Storefront & CMS Partner Application Actions
  const submitPartnerApplication = (appData: Omit<PartnerApplication, 'id' | 'createdAt' | 'status'>) => {
    const id = `app-${Date.now().toString().slice(-4)}`;
    const newApp: PartnerApplication = {
      ...appData,
      id,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setPartnerApplications((prev) => [newApp, ...prev]);
    setDoc(doc(db, 'partnerApplications', id), newApp).catch(console.error);
    showToast('Formulir kemitraan berhasil terkirim! Tim kami akan segera menghubungi Anda via WhatsApp.', 'success');
    return id;
  };

  const updatePartnerApplicationStatus = (appId: string, status: 'pending' | 'approved' | 'rejected') => {
    setPartnerApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
    updateDoc(doc(db, 'partnerApplications', appId), { status }).catch(console.error);
    showToast(`Status pengajuan mitra diubah menjadi: ${status.toUpperCase()}`, 'info');
  };

  const convertApplicationToPartner = (appId: string, tierId: string, dailyPcs: number, schedule: string) => {
    const application = partnerApplications.find((a) => a.id === appId);
    if (!application) return;

    const newPartner: Partner = {
      id: `ptr-${Date.now().toString().slice(-4)}`,
      businessName: application.businessName,
      ownerName: application.ownerName,
      category: application.category,
      whatsapp: application.whatsapp,
      address: application.address,
      city: application.city,
      tierId,
      dailySupplyPcs: dailyPcs || application.estimatedDailyPcs || 30,
      supplySchedule: schedule || 'Setiap Hari - Pukul 07.30 WIB',
      preferredFlavors: ['classic-vanilla', 'espresso-blend'],
      paymentModel: 'konsinyasi',
      status: 'active',
      registeredAt: new Date().toISOString().split('T')[0],
      totalSuppliedPcs: 0,
      totalRevenueValue: 0,
      notes: `Dikonversi dari pendaftaran online. ${application.notes || ''}`,
    };

    setPartners((prev) => [newPartner, ...prev]);
    setPartnerApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status: 'approved' } : a)));
    
    // Firebase sync
    setDoc(doc(db, 'partners', newPartner.id), newPartner).catch(console.error);
    updateDoc(doc(db, 'partnerApplications', appId), { status: 'approved' }).catch(console.error);
    
    showToast(`Pengajuan disetujui & ${newPartner.businessName} resmi menjadi Mitra Aktif!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        flavors,
        discountRules,
        locations,
        orders,
        analytics,
        partnerTiers,
        partners,
        partnerApplications,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        selectedFlavorCount,
        canAddFlavor,
        cartTotalPcs,
        cartSubtotal,
        cartDiscount,
        cartDiscountNote,
        cartTotal,
        cartDp,
        cartRemaining,
        isCartOpen,
        setIsCartOpen,
        previewFlavorId,
        setPreviewFlavorId,
        previewFlavor,
        createOrder,
        view,
        setView,
        adminTab,
        setAdminTab,
        adminUser,
        loginWithGoogle,
        logoutAdmin,
        updateFlavor,
        addFlavor,
        deleteFlavor,
        toggleFlavorAvailability,
        updateLocation,
        addLocation,
        deleteLocation,
        updateDiscountRule,
        addDiscountRule,
        deleteDiscountRule,
        updateOrderStatus,
        deleteOrder,
        updatePartnerTier,
        addPartnerTier,
        deletePartnerTier,
        addPartner,
        updatePartner,
        deletePartner,
        submitPartnerApplication,
        updatePartnerApplicationStatus,
        convertApplicationToPartner,
        toasts,
        showToast,
        dismissToast,
        calculateOrderPricing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};