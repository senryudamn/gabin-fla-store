import React from 'react';
import { Star, Sparkles, Heart, Quote, Instagram, ShieldCheck } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      author: 'Anisa Dian Pratiwi',
      city: 'Yogyakarta',
      rating: 5,
      date: '2 hari yang lalu',
      favoriteFlavor: 'Kyoto Uji Matcha & Vanilla',
      content: 'Fla matchanya beneran wangi dan rasanya ga abal-abal! Ga terlalu manis dan biskuitnya tetap garing walaupun dimakan sore hari. Nagih banget buat temen ngeteh.',
      badge: 'Verified Pick-up Kotabaru',
    },
    {
      id: 2,
      author: 'Dimas Wicaksono',
      city: 'Sleman',
      rating: 5,
      date: 'Kemarin',
      favoriteFlavor: 'Espresso Robusta Roast',
      content: 'Kopi robustanya berasa banget, aromanya nendang pas digigit. Pesan 20 pcs buat acara kantor langsung ludes dalam 10 menit. Packagingnya juga rapi banget.',
      badge: 'Verified Pick-up Kaliurang',
    },
    {
      id: 3,
      author: 'Clara Michelle',
      city: 'Bantul',
      rating: 5,
      date: '3 hari yang lalu',
      favoriteFlavor: 'Red Velvet Cream Cheese',
      content: 'Isian flanya tebal dan creamy pol! Sensasi asam manis cream cheesenya bikin ga enek sama sekali. Udah order ketiga kalinya di Gabin Isi Fla.',
      badge: 'Langganan Setia',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FFF9F2] border-b border-[#F0DDCF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E6] border border-[#FCDDBF] px-4 py-1 text-xs font-bold text-[#C46A18] uppercase tracking-wider">
            <Heart className="h-3.5 w-3.5 fill-[#C46A18]" />
            Kata Pecinta Gabin Fla
          </div>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-extrabold text-[#2F1C11] tracking-tight">
            Ulasan Asli Pelanggan
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-[#321F13]">4.9 / 5.0</span>
            <span className="text-xs text-[#8A7160]">• 340+ Ulasan Puas</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-[#ECD9C7] p-6 shadow-xs flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8C7362]">{rev.date}</span>
                </div>

                <Quote className="h-6 w-6 text-[#E88C38]/40" />

                <p className="text-xs sm:text-sm text-[#5C4537] leading-relaxed italic">
                  "{rev.content}"
                </p>

                <div className="p-2 rounded-xl bg-[#FFF5EC] border border-[#FAD8BD] text-[10px] text-[#8C6D58] font-bold">
                  Favorit: <span className="text-[#C46A18]">{rev.favoriteFlavor}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F2E4D8] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#321F13]">{rev.author}</h4>
                  <p className="text-[10px] text-[#8A7160]">{rev.city}</p>
                </div>

                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  {rev.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Social Callout */}
        <div className="p-6 rounded-3xl bg-[#321F13] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F5B056]">
              <Instagram className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Bagikan Momen Nikmatmu di Instagram</h4>
              <p className="text-xs text-[#D9C4B6]">
                Tag <span className="text-[#FAD082] font-semibold">@gabin_isifla</span> & gunakan tagar #GabinFlaJogja untuk kesempatan dapat voucher diskon!
              </p>
            </div>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-xl bg-[#E88C38] hover:bg-[#D57924] text-white font-bold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            Follow @gabin_isifla
          </a>
        </div>
      </div>
    </section>
  );
};
