import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Clock, Phone, Send, Navigation, Store, CheckCircle, Shield } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const { locations } = useApp();
  const [selectedLocId, setSelectedLocId] = useState(locations[0]?.id || 'loc-jogja-pusat');

  const selectedLoc = locations.find((l) => l.id === selectedLocId) || locations[0];

  return (
    <section id="locations-section" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E6] border border-[#FCDDBF] px-4 py-1 text-xs font-bold text-[#C46A18] uppercase tracking-wider">
          <MapPin className="h-3.5 w-3.5" />
          Titik Pengambilan
        </div>
        <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-extrabold text-[#2F1C11] tracking-tight">
          Lokasi Pick-up & Dapur Produksi
        </h2>
        <p className="text-[#6B5242] text-sm sm:text-base">
          Ambil pesanan Anda dalam keadaan hangat dan fresh langsung dari dapur kami. Pilih cabang terdekat dari domisili Anda.
        </p>

        {/* Location Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 pt-3 flex-wrap">
          {locations.filter((l) => l.active).map((loc) => (
            <button
              key={loc.id}
              id={`tab-location-${loc.id}`}
              type="button"
              onClick={() => setSelectedLocId(loc.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                selectedLocId === loc.id
                  ? 'bg-[#3B281B] text-white shadow-md scale-102'
                  : 'bg-white text-[#664F40] border border-[#ECD7C4] hover:bg-[#FFF5EB]'
              }`}
            >
              <Store className="h-4 w-4 text-[#E88C38]" />
              <span>{loc.name}</span>
              {loc.isMainBranch && (
                <span className="text-[10px] bg-[#E88C38] text-white px-1.5 py-0.2 rounded-md">
                  Pusat
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Location Details Layout */}
      {selectedLoc && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Card Info */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-[#ECD9C7] p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F5E6D8]">
                <div>
                  <span className="text-xs font-bold text-[#C46A18] uppercase tracking-wider">
                    {selectedLoc.tag}
                  </span>
                  <h3 className="font-['Playfair_Display',serif] text-2xl font-extrabold text-[#321F13] mt-0.5">
                    {selectedLoc.name}
                  </h3>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Buka Hari Ini
                </span>
              </div>

              {/* Info Items */}
              <div className="space-y-3.5 text-xs sm:text-sm text-[#5C4537]">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-[#FFF5EC] border border-[#FAD8BD] flex items-center justify-center text-[#C46A18] flex-shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#3B281B] block">Alamat Lengkap</span>
                    <p className="text-[#705849] leading-relaxed">{selectedLoc.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-[#FFF5EC] border border-[#FAD8BD] flex items-center justify-center text-[#C46A18] flex-shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#3B281B] block">Jam Operasional Pengambilan</span>
                    <p className="text-[#705849]">{selectedLoc.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-[#FFF5EC] border border-[#FAD8BD] flex items-center justify-center text-[#C46A18] flex-shrink-0 mt-0.5">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#3B281B] block">Telepon / WhatsApp Cabang</span>
                    <p className="text-[#705849]">{selectedLoc.phone}</p>
                  </div>
                </div>
              </div>

              {/* Pickup Note box */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#F5E2D2] text-xs text-[#7A6455] space-y-1">
                <p className="font-bold text-[#3B281B] flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-[#E88C38]" />
                  Panduan Pengambilan Pesanan:
                </p>
                <p>• Harap membawa bukti konfirmasi / nomor order WhatsApp.</p>
                <p>• Pelunasan 50% sisa pembayaran dapat dibayar tunai atau QRIS saat pick-up.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                id={`maps-direct-btn-${selectedLoc.id}`}
                href={selectedLoc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#3B281B] hover:bg-[#23150C] text-white font-bold text-xs shadow-md transition-all active:scale-98"
              >
                <Navigation className="h-4 w-4 text-[#F5B056]" />
                <span>Petunjuk Arah (Maps)</span>
              </a>

              <a
                id={`wa-branch-direct-btn-${selectedLoc.id}`}
                href={`https://wa.me/${selectedLoc.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${selectedLoc.name}, saya ingin menanyakan jadwal pick-up pesanan Gabin Fla.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs shadow-md transition-all active:scale-98"
              >
                <Send className="h-4 w-4" />
                <span>Chat Admin Cabang</span>
              </a>
            </div>
          </div>

          {/* Right: Map Embed View */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-[#ECD9C7] shadow-md bg-stone-100 min-h-[320px] relative">
            <iframe
              title={`Peta Lokasi ${selectedLoc.name}`}
              className="w-full h-full min-h-[350px] border-0"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedLoc.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              loading="lazy"
            />
          </div>
        </div>
      )}
    </section>
  );
};
