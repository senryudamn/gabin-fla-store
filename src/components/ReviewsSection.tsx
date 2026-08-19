import React from 'react';
import { Star, Heart, Instagram, MessageSquare } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
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
            <span className="text-xs text-[#8A7160]">• Segera Hadir</span>
          </div>
        </div>

        {/* Tempat Kosong untuk Fitur Komentar Mendatang */}
        <div className="bg-white rounded-3xl border-2 border-dashed border-[#ECD9C7] p-10 sm:p-16 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
          <div className="h-16 w-16 rounded-full bg-[#FFF5EC] flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-[#E88C38]/60" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#321F13] text-lg">Belum Ada Ulasan Ditampilkan</h3>
            <p className="text-[#8A7160] text-sm max-w-md mx-auto">
              Ruang ini telah disiapkan. Fitur ulasan dan komentar pelanggan secara langsung akan segera diintegrasikan ke dalam sistem.
            </p>
          </div>
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