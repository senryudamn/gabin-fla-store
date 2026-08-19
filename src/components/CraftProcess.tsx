import React from 'react';
import { ChefHat, Flame, Sparkles, Clock, CheckCircle2, Award, HeartHandshake } from 'lucide-react';

export const CraftProcess: React.FC = () => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Custard Slow-Cook',
      subtitle: 'Dimasak Perlahan 45 Menit',
      description: 'Susu murni segar, mentega premium, dan kuning telur diaduk tanpa henti dengan api kecil untuk menciptakan fla yang super lembut dan tidak menggumpal.',
      badge: 'Suhu 85°C',
    },
    {
      stepNumber: '02',
      title: 'Hand-Selected Crackers',
      subtitle: 'Biskuit Malkist Pilihan',
      description: 'Hanya kepingan biskuit renyah utuh tanpa retak yang dipilih, bertekstur kokoh untuk menopang ketebalan fla yang melimpah.',
      badge: '100% Utuh',
    },
    {
      stepNumber: '03',
      title: 'Isian Fla Tebal 35gr',
      subtitle: 'Porsi Melimpah & Padat',
      description: 'Setiap keping gabin diisi 35 gram adonan fla tebal sehingga memberikan sensasi lumer meluap di setiap gigitan pertama.',
      badge: 'Ekstra Tebal',
    },
    {
      stepNumber: '04',
      title: 'Golden Pan-Bake',
      subtitle: 'Kering Renyah Sempurna',
      description: 'Dipanaskan dengan minyak higienis dan ditiriskan sempurna tanpa meninggalkan minyak berlebih, ditaburi butiran kristal gula manis.',
      badge: 'Crispy & Non-Oily',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FFFDF9] border-b border-[#F0DDCF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E6] border border-[#FCDDBF] px-4 py-1 text-xs font-bold text-[#C46A18] uppercase tracking-wider">
            <ChefHat className="h-4 w-4" />
            Proses Pembuatan Artisanal
          </div>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-extrabold text-[#2F1C11] tracking-tight">
            Dari Dapur Kami, Fresh ke Tangan Anda
          </h2>
          <p className="text-[#695244] text-sm sm:text-base">
            Setiap keping Gabin Isi Fla diproduksi dengan ketelitian resep rumahan autentik tanpa bahan pengawet buatan.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-[#ECD9C7] p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden group"
            >
              {/* Giant background step number */}
              <span className="absolute -top-4 -right-2 text-6xl font-black text-[#F5ECE2] select-none group-hover:text-[#E88C38]/15 transition-colors">
                {st.stepNumber}
              </span>

              <div className="relative z-10 space-y-3">
                <span className="inline-block px-2.5 py-1 rounded-lg bg-[#FFF5EC] border border-[#FAD8BD] text-[10px] font-black text-[#C46A18] uppercase">
                  {st.badge}
                </span>
                <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-[#321F13]">
                  {st.title}
                </h3>
                <p className="text-xs font-bold text-[#C46A18]">{st.subtitle}</p>
                <p className="text-xs text-[#6B5242] leading-relaxed">{st.description}</p>
              </div>

              <div className="pt-2 border-t border-[#F5E6D8] flex items-center gap-1.5 text-[11px] font-semibold text-[#8A7160]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Standar Mutu Higienis</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
