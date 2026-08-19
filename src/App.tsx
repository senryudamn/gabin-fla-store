import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { BRAND_ASSETS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BoxBuilder } from './components/BoxBuilder';
import { TasteQuiz } from './components/TasteQuiz';
import { StorySection } from './components/StorySection';
import { CraftProcess } from './components/CraftProcess';
import { FlavorShowcase } from './components/FlavorShowcase';
import { ReviewsSection } from './components/ReviewsSection';
import { OrderForm } from './components/OrderForm';
import { PartnershipSection } from './components/PartnershipSection';
import { LocationSection } from './components/LocationSection';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ToastContainer } from './components/ToastContainer';

// Komponen pembungkus agar setiap sesi muncul dengan animasi saat di-scroll
const FadeInScroll: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Layar Loading Awal
const SplashLoadingScreen: React.FC = () => (
  <motion.div
    key="splash-screen"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFFDF9]"
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FFEADA]/40 via-transparent to-transparent opacity-60" />
    
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 flex flex-col items-center gap-6"
    >
      <div className="h-24 w-24 rounded-3xl bg-[#FFF5EB] border-2 border-[#ECD3BC] p-2 shadow-xl overflow-hidden relative">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 bg-gradient-to-tr from-[#E88C38]/20 to-transparent blur-md" 
        />
        <img src={BRAND_ASSETS.logo} alt="Logo" className="w-full h-full object-cover rounded-2xl relative z-10" />
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="font-['Playfair_Display',serif] text-2xl font-black text-[#321F13] tracking-widest">
          GABIN ISI FLA
        </h1>
        <div className="flex items-center justify-center gap-1.5">
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} 
            className="w-1.5 h-1.5 rounded-full bg-[#E88C38]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} 
            className="w-1.5 h-1.5 rounded-full bg-[#E88C38]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} 
            className="w-1.5 h-1.5 rounded-full bg-[#E88C38]" 
          />
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const MainAppContent: React.FC = () => {
  const { view } = useApp();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Simulasi loading aset & inisialisasi Firebase/3D
    const timer = setTimeout(() => setIsInitializing(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isInitializing && <SplashLoadingScreen />}
      </AnimatePresence>

      {!isInitializing && (
        <>
          {view === 'admin-login' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AdminLogin />
              <ToastContainer />
            </motion.div>
          )}

          {view === 'admin-dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AdminDashboard />
              <ToastContainer />
            </motion.div>
          )}

          {view === 'store' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.5 }}
              className="min-h-screen bg-[#FFFDF9] flex flex-col justify-between selection:bg-[#E88C38] selection:text-white overflow-hidden"
            >
              <Navbar />

              <main className="flex-1">
                <HeroSection />
                <FadeInScroll><BoxBuilder /></FadeInScroll>
                <FadeInScroll><TasteQuiz /></FadeInScroll>
                <FadeInScroll><StorySection /></FadeInScroll>
                <FadeInScroll><CraftProcess /></FadeInScroll>
                <FadeInScroll><FlavorShowcase /></FadeInScroll>
                <FadeInScroll><ReviewsSection /></FadeInScroll>
                <FadeInScroll><OrderForm /></FadeInScroll>
                <FadeInScroll><PartnershipSection /></FadeInScroll>
                <FadeInScroll><LocationSection /></FadeInScroll>
              </main>

              <CartDrawer />
              <Footer />
              <ToastContainer />
            </motion.div>
          )}
        </>
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}