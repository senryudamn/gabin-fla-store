import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
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

const MainAppContent: React.FC = () => {
  const { view } = useApp();

  if (view === 'admin-login') {
    return (
      <>
        <AdminLogin />
        <ToastContainer />
      </>
    );
  }

  if (view === 'admin-dashboard') {
    return (
      <>
        <AdminDashboard />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-between selection:bg-[#E88C38] selection:text-white">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 1. Artisanal Hero + 3D Gabin Interactive Studio */}
        <HeroSection />

        {/* 2. Interactive 10-Slot Bakery Box Builder */}
        <BoxBuilder />

        {/* 3. Sensory Taste Recommender / Quiz */}
        <TasteQuiz />

        {/* 4. Story: Apa itu Gabin Fla? */}
        <StorySection />

        {/* 5. Artisanal 4-Step Craft & Baking Process */}
        <CraftProcess />

        {/* 6. Varian Menu & Harga Showcase with 3D Preview links & Steppers */}
        <FlavorShowcase />

        {/* 7. Real Customer Reviews & Social UGC Wall */}
        <ReviewsSection />

        {/* 8. Automated Order Form (Min 10 Pcs, Dynamic Discount, 50% DP, WhatsApp dispatch) */}
        <OrderForm />

        {/* 9. B2B Wholesale Partnership for Toko, Kedai, Angkringan & Cafe */}
        <PartnershipSection />

        {/* 10. Branch Pick-up Locations & Maps */}
        <LocationSection />
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <Footer />

      {/* Global Notification Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
