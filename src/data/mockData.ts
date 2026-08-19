// src/data/mockData.ts
import {
  Flavor,
  DiscountRule,
  BranchLocation,
  Order,
  AnalyticsData,
  PartnerPricingTier,
  Partner,
  PartnerApplication,
} from '../types';

// Aset statis untuk logo dan gambar utama (Tetap dipertahankan)
export const BRAND_ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuzEXORBZQEF2XfXXvenjuEE9K8UfDMFJ6Cj2Yna7BnDm7Xh3kuBvHxYhjvTnFL7by5BxcToJ2Wx3tP9BwmOVfbKoxiK6a_ZMs18s0xQGc7565xG8ih6gRd_PP5mHMTIfiHyk7l1tW8mDr46rJsMrCoOcq0_HUJkeGOXGQ0OedI6kpzdUvoMXIENK5lDHTUzkwsUaIDg1OdvONKx8vXXUS7BQLVBQXs7U7bOGuf9HlfiAo6AnH48vH5g',
  storyHero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8QUuPqJAtWGUYJxGEdN6kRHFU0mVVAsZ7MeaXUUI_S8uTRGtHgKZCsYDzu3UItA4g0gbN6--m2nyKbv1KnaTTxubZvfDSLshrPxipp9myraD7rMNaE5h_fW-qM5aNg0PHRjsI2MNNybX8S29DNHTIgvYpgZR_NQ3x2oVTClHu1cQchwD5mhW2tjcDZiUOXKYK7eyb-J63sx7zCkBznVvNoZD6sLKjLECgWGjg6xLTGsWSsatHNaGvg',
};

// Semua data diubah menjadi Array kosong
export const INITIAL_FLAVORS: Flavor[] = [];
export const INITIAL_DISCOUNT_RULES: DiscountRule[] = [];
export const INITIAL_LOCATIONS: BranchLocation[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_PARTNER_TIERS: PartnerPricingTier[] = [];
export const INITIAL_PARTNERS: Partner[] = [];
export const INITIAL_PARTNER_APPLICATIONS: PartnerApplication[] = [];

// Analitik di-reset ke 0
export const INITIAL_ANALYTICS: AnalyticsData = {
  todayVisits: 0,
  todayOrders: 0,
  todayRevenue: 0,
  topFlavorId: '',
  topFlavorName: 'Belum ada data',
  trafficHistory: [],
  deviceBreakdown: [
    { device: 'Smartphone / Mobile', percentage: 0 },
    { device: 'Desktop / Laptop', percentage: 0 },
    { device: 'Tablet', percentage: 0 },
  ],
};