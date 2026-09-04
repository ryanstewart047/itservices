'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ThemeSwitcher from '@/components/layout/ThemeSwitcher';
import BackToTop from '@/components/layout/BackToTop';
import NewsletterPopup from '@/components/layout/NewsletterPopup';
import AIChatBot from '@/components/ai/AIChatBot';
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt';
import GlobalFormHandler from '@/components/forms/GlobalFormHandler';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    // Completely standalone admin page: no site header, no site footer, no chatbot, no popups
    return <>{children}</>;
  }

  return (
    <>
      <ThemeSwitcher />
      <div className="page-wrapper">
        <Header />
        <main className="content-wrapper">{children}</main>
        <Footer />
      </div>
      <BackToTop />
      <AIChatBot />
      <NewsletterPopup />
      <PWAInstallPrompt />
      <GlobalFormHandler />
    </>
  );
}
