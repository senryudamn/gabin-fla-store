import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/mockData';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, loginWithGoogle, setView } = useApp();
  const [email, setEmail] = useState('akbariimam8@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = (targetEmail = 'akbariimam8@gmail.com', targetName = 'Akbari Imam') => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      loginWithGoogle(targetEmail, targetName);
      setIsGoogleLoading(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    loginAdmin(email, password);
    setIsSubmitting(false);
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
        <div className="bg-white rounded-3xl border border-[#ECD9C7] p-6 sm:p-8 shadow-xl space-y-6">
          {/* Logo & Title */}
          <div className="text-center space-y-2">
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
              Masuk dengan akun Google Anda untuk mengelola menu, pesanan, dan operasional dapur.
            </p>
          </div>

          {/* GOOGLE SIGN-IN PRIMARY BUTTON */}
          <div className="space-y-3">
            <button
              id="google-admin-login-btn"
              type="button"
              disabled={isGoogleLoading}
              onClick={() => handleGoogleLogin('akbariimam8@gmail.com', 'Akbari Imam')}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-[#F8F9FA] border-2 border-[#4285F4]/40 hover:border-[#4285F4] text-[#3c4043] font-bold text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer group"
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

            {/* Google Account Tag Badge */}
            <div className="p-2.5 rounded-xl bg-[#E8F0FE] border border-[#D2E3FC] flex items-center justify-between text-xs text-[#1967D2]">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#1A73E8]" />
                <span>Akun Terverifikasi: <strong>akbariimam8@gmail.com</strong></span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-[#1A73E8] text-white px-2 py-0.5 rounded-full">
                Owner
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E8DCD1]"></div>
            <span className="flex-shrink mx-3 text-xs text-[#9E8675] font-semibold">
              atau gunakan email sandi
            </span>
            <div className="flex-grow border-t border-[#E8DCD1]"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4A3427] block">
                Email Akun Admin
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-[#A68F80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-login-email"
                  type="email"
                  required
                  placeholder="akbariimam8@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DECBC0] text-sm focus:outline-none focus:ring-2 focus:ring-[#E88C38] bg-[#FFFCF8]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4A3427] block">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-[#A68F80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DECBC0] text-sm focus:outline-none focus:ring-2 focus:ring-[#E88C38] bg-[#FFFCF8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A68F80] hover:text-[#4A3427] p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#3B281B] hover:bg-[#23150C] text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-[#F5B056]" />
              <span>Masuk via Kata Sandi</span>
            </button>
          </form>

          {/* Quick Access Info */}
          <div className="p-3.5 rounded-2xl bg-[#FFF5EC] border border-[#F5D8BF] space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#3B281B]">
              <KeyRound className="h-3.5 w-3.5 text-[#E88C38]" />
              <span>Pilihan Akun Cepat:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleGoogleLogin('akbariimam8@gmail.com', 'Akbari Imam')}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#ECD3BC] text-[11px] font-semibold text-[#664F40] hover:bg-[#FAF0E6]"
              >
                Google: akbariimam8@gmail.com
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@gabin.id');
                  setPassword('admin123');
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#ECD3BC] text-[11px] font-semibold text-[#664F40] hover:bg-[#FAF0E6]"
              >
                Demo: admin@gabin.id
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
