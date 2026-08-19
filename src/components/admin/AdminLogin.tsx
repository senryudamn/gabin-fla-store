import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/mockData';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginWithGoogle, setView } = useApp();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await loginWithGoogle();
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 py-12">
      {/* Background radial soft light */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#FFEADA]/60 via-transparent to-transparent" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Back button */}
        <button
          type="button"
          onClick={() => setView('store')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#6E5748] hover:text-[#3B281B] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Halaman Toko</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-[#ECD9C7] p-6 sm:p-8 shadow-xl space-y-8">
          {/* Logo & Title */}
          <div className="text-center space-y-3">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-[#FFF5EB] border border-[#ECD3BC] p-1.5 shadow-sm overflow-hidden flex items-center justify-center">
              <img
                src={BRAND_ASSETS.logo}
                alt="Gabin Isi Fla Logo"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover rounded-xl"
              />
            </div>

            <h2 className="font-['Playfair_Display',serif] text-2xl font-extrabold text-[#321F13]">
              Portal Admin & CMS
            </h2>
            <p className="text-xs text-[#7A6455]">
              Silakan masuk menggunakan akun Google Anda untuk mengelola menu, pesanan, dan operasional dapur Gabin Fla.
            </p>
          </div>

          {/* GOOGLE SIGN-IN PRIMARY BUTTON */}
          <div className="space-y-4 pt-2">
            <button
              id="google-admin-login-btn"
              type="button"
              disabled={isGoogleLoading}
              onClick={handleGoogleLogin}
              className="w-full py-4 px-4 rounded-2xl bg-white hover:bg-[#F8F9FA] border-2 border-[#4285F4]/40 hover:border-[#4285F4] text-[#3c4043] font-bold text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              {/* Official Google 'G' Icon */}
              <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isGoogleLoading ? 'Memverifikasi Google...' : 'Masuk dengan Akun Google'}</span>
            </button>

            {/* Security Note */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <p>
                Akses ke panel admin dilindungi oleh sistem enkripsi autentikasi Google Firebase. Hanya email yang telah terdaftar yang dapat masuk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};