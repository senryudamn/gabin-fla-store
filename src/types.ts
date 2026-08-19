export interface Flavor {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  category: 'classic' | 'premium' | 'special';
  flaColorHex: string;
  crackerColorHex?: string;
  sugarDots?: boolean;
  available: boolean;
  stockCount?: number;
  sweetness: number; // 1-5
  richness: number; // 1-5
  ingredients: string[];
  isPopular?: boolean;
}

export interface DiscountRule {
  id: string;
  minQuantity: number;
  discountPerPack: number; // e.g. 3000 discount for every 10 pcs
  label: string;
  description: string;
  active: boolean;
}

export interface BranchLocation {
  id: string;
  name: string;
  tag: string;
  address: string;
  city: string;
  subdistrict: string;
  phone: string;
  whatsapp: string;
  hours: string;
  mapsUrl: string;
  mapsEmbedQuery: string;
  isMainBranch?: boolean;
  active: boolean;
}

export interface CartItem {
  flavorId: string;
  quantity: number;
}

export type OrderStatus = 'menunggu_dp' | 'dp_diterima' | 'proses_produksi' | 'siap_diambil' | 'selesai' | 'dibatalkan';

export interface OrderItemSummary {
  flavorId: string;
  flavorName: string;
  price: number;
  quantity: number;
  itemTotal: number;
}

export interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  whatsappNumber: string;
  pickupLocationId: string;
  pickupLocationName: string;
  pickupDate: string;
  pickupTime: string;
  items: OrderItemSummary[];
  totalPcs: number;
  subtotal: number;
  discount: number;
  appliedDiscountNote?: string;
  totalPrice: number;
  dpAmount: number;
  remainingAmount: number;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'owner' | 'manager' | 'staff';
  avatar?: string;
  provider?: 'google' | 'email';
}

export interface AnalyticsData {
  todayVisits: number;
  totalOrdersCount: number;
  totalRevenue: number;
  topFlavorName: string;
  trafficHistory: { date: string; visitors: number; orders: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
}

// B2B PARTNERSHIP TYPES
export type PartnerCategory = 'angkringan' | 'kedai_kopi' | 'cafe' | 'toko_roti' | 'reseller_kantin';

export interface PartnerPricingTier {
  id: string;
  tierName: string;
  category: PartnerCategory;
  priceClassic: number; // e.g. 2300 (Normal 3500)
  pricePremium: number; // e.g. 2700 (Normal 4000)
  priceSpecial: number; // e.g. 3000 (Normal 4500)
  suggestedRetailPrice: number; // e.g. 3500 - 4500
  estimatedMarginPercent: number; // e.g. 35 - 45%
  minOrderPcs: number; // e.g. 20 pcs
  paymentModel: 'konsinyasi' | 'beli_putus' | 'tempo_mingguan';
  freeFacilities: string[];
  active: boolean;
}

export interface Partner {
  id: string;
  businessName: string;
  ownerName: string;
  category: PartnerCategory;
  whatsapp: string;
  address: string;
  city: string;
  tierId: string;
  customDiscountPercent?: number; // Optional special custom discount adjustment in admin
  dailySupplyPcs: number;
  supplySchedule: string;
  preferredFlavors: string[];
  paymentModel: 'konsinyasi' | 'beli_putus' | 'tempo_mingguan';
  status: 'active' | 'pending' | 'inactive';
  registeredAt: string;
  totalSuppliedPcs: number;
  totalRevenueValue: number;
  notes?: string;
}

export interface PartnerApplication {
  id: string;
  businessName: string;
  ownerName: string;
  category: PartnerCategory;
  whatsapp: string;
  address: string;
  city: string;
  estimatedDailyPcs: number;
  notes?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}
