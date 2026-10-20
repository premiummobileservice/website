import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BookingModal } from './components/common/BookingModal';

// Public Pages
import { HomePage } from './pages/website/HomePage';
import { ServicesPage } from './pages/website/ServicesPage';
import { ServiceDetailPage } from './pages/website/ServiceDetailPage';
import { AreasPage } from './pages/website/AreasPage';
import { AreaDetailPage } from './pages/website/AreaDetailPage';
import { HowItWorksPage } from './pages/website/HowItWorksPage';
import { AboutPage } from './pages/website/AboutPage';
import { ContactPage } from './pages/website/ContactPage';
import { BookRepairPage } from './pages/website/BookRepairPage';
import { PrivacyPolicyPage } from './pages/website/PrivacyPolicyPage';
import { TermsPage } from './pages/website/TermsPage';

// CRM Pages
import { CrmLayout } from './components/crm/CrmLayout';
import { CrmLoginPage } from './pages/crm/CrmLoginPage';
import { CrmDashboardPage } from './pages/crm/CrmDashboardPage';
import { CrmLeadsPage } from './pages/crm/CrmLeadsPage';
import { CrmJobsPage } from './pages/crm/CrmJobsPage';
import { CrmCallbacksPage } from './pages/crm/CrmCallbacksPage';
import { CrmRejectedPage } from './pages/crm/CrmRejectedPage';
import { CrmInvoicesPage } from './pages/crm/CrmInvoicesPage';
import { CrmCustomersPage } from './pages/crm/CrmCustomersPage';
import { CrmReportsPage } from './pages/crm/CrmReportsPage';
import { CrmUsersPage } from './pages/crm/CrmUsersPage';
import { CrmTechniciansPage } from './pages/crm/CrmTechniciansPage';
import { CrmSettingsPage } from './pages/crm/CrmSettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

// Protected Route Guard for Staff CRM
const ProtectedCrmRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/crm/login" replace />;
  }

  return <CrmLayout />;
};

// Website Layout with Navbar, Footer, and Global Booking Modal
const WebsiteLayout: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState<string | undefined>(undefined);
  const [modalArea, setModalArea] = useState<string | undefined>(undefined);

  const openBooking = (service?: string, area?: string) => {
    setModalService(service);
    setModalArea(area);
    setModalOpen(true);
  };

  React.useEffect(() => {
    const handleBookEvent = (e: Event) => {
      const customEvt = e as CustomEvent<{ service?: string; area?: string }>;
      openBooking(customEvt.detail?.service, customEvt.detail?.area);
    };
    window.addEventListener('pmr:book', handleBookEvent);
    return () => window.removeEventListener('pmr:book', handleBookEvent);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 selection:bg-indigo-500/20 selection:text-indigo-800">
      <Navbar onOpenBookingModal={() => openBooking()} />
      <main className="flex-1">
        <Outlet context={{ openBooking }} />
      </main>
      <Footer />
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultService={modalService}
        defaultArea={modalArea}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Toaster position="top-right" toastOptions={{ className: 'bg-slate-900 text-white border border-slate-800' }} />
            <Routes>
              {/* Public Website Routes */}
              <Route path="/" element={<WebsiteLayout />}>
                <Route
                  index
                  element={
                    <HomePage
                      onOpenBookingModal={(s, a) => {
                        const evt = new CustomEvent('pmr:book', { detail: { service: s, area: a } });
                        window.dispatchEvent(evt);
                      }}
                    />
                  }
                />
                <Route path="book-repair" element={<BookRepairPage />} />
                <Route
                  path="services"
                  element={
                    <ServicesPage
                      onOpenBookingModal={(s) => {
                        const evt = new CustomEvent('pmr:book', { detail: { service: s } });
                        window.dispatchEvent(evt);
                      }}
                    />
                  }
                />
                <Route path="services/:slug" element={<ServiceDetailPage />} />
                <Route
                  path="areas"
                  element={
                    <AreasPage
                      onOpenBookingModal={(a) => {
                        const evt = new CustomEvent('pmr:book', { detail: { area: a } });
                        window.dispatchEvent(evt);
                      }}
                    />
                  }
                />
                <Route
                  path="service-areas/bangalore"
                  element={
                    <AreasPage
                      onOpenBookingModal={(a) => {
                        const evt = new CustomEvent('pmr:book', { detail: { area: a } });
                        window.dispatchEvent(evt);
                      }}
                    />
                  }
                />
                <Route path="areas/:slug" element={<AreaDetailPage />} />
                <Route
                  path="how-it-works"
                  element={
                    <HowItWorksPage
                      onOpenBookingModal={() => {
                        const evt = new CustomEvent('pmr:book', { detail: {} });
                        window.dispatchEvent(evt);
                      }}
                    />
                  }
                />
                <Route
                  path="about"
                  element={
                    <AboutPage
                      onOpenBookingModal={() => {
                        const evt = new CustomEvent('pmr:book', { detail: {} });
                        window.dispatchEvent(evt);
                      }}
                    />
                  }
                />
                <Route path="contact" element={<ContactPage />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
                <Route path="terms" element={<TermsPage />} />
              </Route>

              {/* Staff CRM Routes */}
              <Route path="/crm/login" element={<CrmLoginPage />} />
              <Route path="/crm" element={<ProtectedCrmRoute />}>
                <Route index element={<Navigate to="/crm/dashboard" replace />} />
                <Route path="dashboard" element={<CrmDashboardPage />} />
                <Route path="leads" element={<CrmLeadsPage />} />
                <Route path="repairs" element={<CrmJobsPage />} />
                <Route path="jobs" element={<CrmJobsPage />} />
                <Route path="callbacks" element={<CrmCallbacksPage />} />
                <Route path="rejected" element={<CrmRejectedPage />} />
                <Route path="invoices" element={<CrmInvoicesPage />} />
                <Route path="customers" element={<CrmCustomersPage />} />
                <Route path="reports" element={<CrmReportsPage />} />
                <Route path="users" element={<CrmUsersPage />} />
                <Route path="technicians" element={<CrmTechniciansPage />} />
                <Route path="settings" element={<CrmSettingsPage />} />
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
