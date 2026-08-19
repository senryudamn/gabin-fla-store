import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, HelpCircle, Check, ArrowRight, RotateCcw, Heart } from 'lucide-react';

export const TasteQuiz: React.FC = () => {
  const { addToCart, setPreviewFlavorId, showToast } = useApp();
  const [step, setStep] = useState<number>(1);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSweetness, setSelectedSweetness] = useState<string | null>(null);

  const moods = [
    { id: 'classic', label: '☕ Santai Sore Hari & Nostalgia', desc: 'Rasa gurih manis hangat yang ramah di lidah', match: 'classic-vanilla' },
    { id: 'coffee', label: '⚡ Butuh Fokus & Mood Booster', desc: 'Aroma kopi pekat sangrai nusantara', match: 'espresso-blend' },
    { id: 'zen', label: '🍵 Ketenangan & Cita Rasa Jepang', desc: 'Aroma matcha hijau Uji yang calming', match: 'kyoto-matcha' },
    { id: 'treat', label: '🍰 Me-Time Mewah & Cream Cheese', desc: 'Kombinasi velvet merah & keju lembut', match: 'red-velvet' },
    { id: 'fruity', label: '🍓 Segar Ceria & Asam Manis', desc: 'Sensasi buah stroberi & bluberi segar', match: 'mixed-berry' },
  ];

  const handleSelectMood = (moodId: string) => {
    setSelectedMood(moodId);
    setStep(2);
  };

  const getRecommendation = () => {
    const chosen = moods.find((m) => m.id === selectedMood);
    return chosen ? chosen.match : 'classic-vanilla';
  };

  const recommendedId = getRecommendation();

  const resetQuiz = () => {
    setStep(1);
    setSelectedMood(null);
    setSelectedSweetness(null);
  };

  return (
    <section className="py-10 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-br from-[#2D1B11] to-[#3F2516] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative soft ambient flares */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#E88C38]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-[#F5B056]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E88C38] text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-['Playfair_Display',serif] text-xl sm:text-2xl font-bold">
                  Bingung Pilih Varian Rasa?
                </h3>
                <p className="text-xs text-[#DEC8BA]">
                  Temukan kombinasi Gabin Fla yang paling cocok dengan selera & mood Anda hari ini.
                </p>
              </div>
            </div>

            {step > 1 && (
              <button
                type="button"
                onClick={resetQuiz}
                className="inline-flex items-center gap-1.5 text-xs text-[#F2DFD3] hover:text-white font-semibold"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Ulangi Pilihan</span>
              </button>
            )}
          </div>

          {/* STEP 1: Mood Choice */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <p className="text-xs sm:text-sm font-semibold text-[#F7EAE1]">
                Pertanyaan: Mood atau suasana seperti apa yang sedang Anda inginkan?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {moods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMood(m.id)}
                    className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-[#E88C38] text-left transition-all hover:scale-102 flex flex-col justify-between space-y-2 group"
                  >
                    <span className="text-sm font-bold text-white group-hover:text-[#FAD082] transition-colors">
                      {m.label}
                    </span>
                    <span className="text-xs text-[#D9C4B6]">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Recommended Flavor Result */}
          {step === 2 && (
            <div className="space-y-5 animate-in zoom-in-95 duration-300">
              <div className="p-5 sm:p-6 rounded-2xl bg-white/10 border border-[#E88C38]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FAD082]">
                    Rekomendasi Terbaik untuk Anda:
                  </span>
                  <h4 className="font-['Playfair_Display',serif] text-2xl font-black text-white">
                    {recommendedId === 'classic-vanilla' && 'Classic Vanilla Custard'}
                    {recommendedId === 'espresso-blend' && 'Espresso Robusta Roast'}
                    {recommendedId === 'kyoto-matcha' && 'Kyoto Uji Matcha'}
                    {recommendedId === 'red-velvet' && 'Red Velvet Cream Cheese'}
                    {recommendedId === 'mixed-berry' && 'Mixed Berry Blast'}
                  </h4>
                  <p className="text-xs text-[#E5D2C5] max-w-lg">
                    Varian ini memiliki keseimbangan manis dan kelembutan fla yang paling pas untuk menemani aktivitas Anda.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewFlavorId(recommendedId);
                      const el = document.getElementById('interactive-3d-experience');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors"
                  >
                    Lihat 3D
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(recommendedId, 5);
                      showToast('5 pcs rasa rekomendasi dimasukkan ke keranjang!', 'success');
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E88C38] hover:bg-[#D57924] text-white font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Heart className="h-3.5 w-3.5 fill-white" />
                    <span>+ Tambah 5 Pcs ke Pesanan</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
