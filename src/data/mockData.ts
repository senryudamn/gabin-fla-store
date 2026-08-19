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

// Aset statis untuk logo dan gambar utama
export const BRAND_ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuzEXORBZQEF2XfXXvenjuEE9K8UfDMFJ6Cj2Yna7BnDm7Xh3kuBvHxYhjvTnFL7by5BxcToJ2Wx3tP9BwmOVfbKoxiK6a_ZMs18s0xQGc7565xG8ih6gRd_PP5mHMTIfiHyk7l1tW8mDr46rJsMrCoOcq0_HUJkeGOXGQ0OedI6kpzdUvoMXIENK5lDHTUzkwsUaIDg1OdvONKx8vXXUS7BQLVBQXs7U7bOGuf9HlfiAo6AnH48vH5g',
  storyHero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8QUuPqJAtWGUYJxGEdN6kRHFU0mVVAsZ7MeaXUUI_S8uTRGtHgKZCsYDzu3UItA4g0gbN6--m2nyKbv1KnaTTxubZvfDSLshrPxipp9myraD7rMNaE5h_fW-qM5aNg0PHRjsI2MNNybX8S29DNHTIgvYpgZR_NQ3x2oVTClHu1cQchwD5mhW2tjcDZiUOXKYK7eyb-J63sx7zCkBznVvNoZD6sLKjLECgWGjg6xLTGsWSsatHNaGvg',
};

// 6 Varian Bawaan yang diproteksi
export const INITIAL_FLAVORS: Flavor[] = [
  {
    id: 'classic-vanilla',
    name: 'Classic Vanilla Custard',
    subtitle: 'Resep Autentik Tradisional',
    description: 'Fla susu vanilla lembut dan lumer dengan aroma harum vanilla asli Madagascar yang dipadukan dengan dua keping biskuit garing.',
    price: 3500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl3wZC4-JMg-3TxMgba_f1QDHgke2OfEqVnYHRrMoJi2nW0e3NJjZIZrJ5851m2gnF1A0mvCYYO6G3KtuGEkwGVS4iej5OUdViePRTV5HABYX9-oQhXmmZZvC8CoxIeU-VrFmZC86h79mO9svDTU__p6o9iALUkGPE74iZaPuX-nIG7waQnWNHmPiFAXxNf2fhRL1JkLxuTa5FkcTEIh5jYU4V30t5b48GPBAv_dx1IP0wHhmDAymq5g',
    badge: 'Paling Laris',
    category: 'classic',
    flaColorHex: '#FDF4DC',
    available: true,
    sweetness: 3,
    richness: 4,
    ingredients: ['Susu Segar Pilihan', 'Ekstrak Vanilla', 'Kuning Telur'],
  },
  {
    id: 'espresso-blend',
    name: 'Espresso Robusta Roast',
    subtitle: 'Aroma Kopi Robusta Pekat',
    description: 'Kombinasi elegan antara kelembutan fla custard dengan sari kopi Robusta lokal dan sentuhan cokelat pahit yang pas di lidah.',
    price: 4000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSe8OxLyjF63D_vpoXOkQEV26I2x5BUZQOfxVJQYkJtnrCWv9Pmj4P-4HwnIIiw_hHjlUk5HfUsH3lE0aWKebkqj0555GQSqA1JsfjWvmV_eBkPmfalIpokQg7IJoM7ShBAVO4A7KxVgbG65obkIQjtUlanGM_0DpalDly77e7DDEYJHGeauEg3XzxaK_qdOGKok5nfpgdTQR8W45GEpR2KGylsxF9U-njG9NNPHbCNRUqKmcY5qwJqQ',
    badge: 'Favorit Coffee Lovers',
    category: 'premium',
    flaColorHex: '#8C5A35',
    available: true,
    sweetness: 2,
    richness: 4,
    ingredients: ['Kopi Robusta Single Origin', 'Susu Murni', 'Dark Cocoa Powder'],
  },
  {
    id: 'kyoto-matcha',
    name: 'Kyoto Uji Matcha',
    subtitle: 'Matcha Hijau Autentik Jepang',
    description: 'Fla kental dengan bubuk matcha murni Uji, menghadirkan harmoni rasa pahit lembut, creamy, dan wangi daun teh hijau yang menenangkan.',
    price: 4500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJruekpDHqkrWqbzKTve9WTHBZtjIMfJSayetZaoatQSgcZNOlG7WwYnurgMxIPHa1ePw-w5lvG48w3hRkkfBK6OR4a3eD8hgU7ekE2x0ZdUPjfMgkXyrBGGglxW-NlCQ3t9qNWwSfX40gT6YNcg7y65Y17ss3DNHFIp29qrf0SIqPU85rHKxaiY4wk6KvBinQFOvsXXbSUeRaduZ70qOGz74Vf_yq_JqxecoHJ2VI0uqxbSiFPpXrBw',
    badge: 'Special Edition',
    category: 'special',
    flaColorHex: '#A3B86C',
    available: true,
    sweetness: 3,
    richness: 3,
    ingredients: ['Uji Matcha Powder', 'Susu Evaporasi', 'Gula Tebu']
  },
  {
    id: 'red-velvet',
    name: 'Red Velvet Cream Cheese',
    subtitle: 'Cream Cheese Asli & Velvet',
    description: 'Fla merah maroon khas red velvet lembut dengan sentuhan asam manis keju cream cheese gurih lezat yang meleleh di setiap gigitan.',
    price: 4500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhu_-TThoIclYf7Y1NPYeDQd7RK_yL2cWofVUzHNMhWDgVOj_ZhQJjoBjaSQOCv-LSaKAYGegOltHvDdkrwAyICw8aByQWRaNZYVpNIsJZeMBDEeX58n1BZYa5t27hlcIBkemuOuwfP50OvJZQTbyg_aWQvOqYTGhijxO0mipWTvTrYLshNfJ7V4gTcrfBzOxoL3ZtRkDw_oBVfBOC_koQMH-Mfo7UeS8293LS5Qy_k3ZTgE5vDKSkrQ',
    badge: 'Chef Signature',
    category: 'special',
    flaColorHex: '#B23A3A',
    available: true,
    sweetness: 4,
    richness: 5,
    ingredients: ['Cream Cheese Anchor', 'Red Velvet Powder', 'Susu Kental Manis']
  },
  {
    id: 'mixed-berry',
    name: 'Mixed Berry Blast',
    subtitle: 'Segar Buah Strawberry & Blueberry',
    description: 'Fla custard buah segar dengan puree stroberi dan blueberry asli, memberikan sensasi asam segar manis yang sangat memanjakan lidah.',
    price: 4500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB02fE7onlcDwS8xd--Fk34EBV33leYgYtnqXdrGzLsggh_JA5peYseBo3907B5MrStsTGWJ6S6KpoZ9l-1S2Je4tUGeYuVdGHa2JeT-VaBKk3aeWQpgKXxgmWubf75DUi6AbFhI3TInzCFHtn9tS0N919oG8w1lC-2fX2Kwdt8EfOK8g1g7dMGVJAv4yHiCkDiR4dlII0q7_IFc5YluvwkpbfPEJL_IvBH6zSEe7x6puzQIUIHmh2szA',
    badge: 'Fresh Fruity',
    category: 'special',
    flaColorHex: '#D47E96',
    available: true,
    sweetness: 3,
    richness: 3,
    ingredients: ['Puree Strawberry Asli', 'Blueberry Extract', 'Susu Rendah Lemak']
  },
  {
    id: 'dark-chocolate',
    name: 'Belgian Dark Chocolate',
    subtitle: 'Kakao Pekat Meleleh di Mulut',
    description: 'Fla cokelat Belgia pekat dengan tekstur silky halus, rasa cokelat mewah tidak terlalu manis yang membuat ketagihan.',
    price: 4000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl3wZC4-JMg-3TxMgba_f1QDHgke2OfEqVnYHRrMoJi2nW0e3NJjZIZrJ5851m2gnF1A0mvCYYO6G3KtuGEkwGVS4iej5OUdViePRTV5HABYX9-oQhXmmZZvC8CoxIeU-VrFmZC86h79mO9svDTU__p6o9iALUkGPE74iZaPuX-nIG7waQnWNHmPiFAXxNf2fhRL1JkLxuTa5FkcTEIh5jYU4V30t5b48GPBAv_dx1IP0wHhmDAymq5g',
    badge: 'Best Seller',
    category: 'premium',
    flaColorHex: '#4A2511',
    available: true,
    sweetness: 2,
    richness: 5,
    ingredients: ['Dark Cocoa 70%', 'Susu Sapi Segar', 'Krim Cokelat Kental']
  }
];

export const INITIAL_DISCOUNT_RULES: DiscountRule[] = [];
export const INITIAL_LOCATIONS: BranchLocation[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_PARTNER_TIERS: PartnerPricingTier[] = [];
export const INITIAL_PARTNERS: Partner[] = [];
export const INITIAL_PARTNER_APPLICATIONS: PartnerApplication[] = [];

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