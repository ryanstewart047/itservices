import type { Metadata, Viewport } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ThemeSwitcher from '@/components/layout/ThemeSwitcher';
import BackToTop from '@/components/layout/BackToTop';
import NewsletterPopup from '@/components/layout/NewsletterPopup';
import AIChatBot from '@/components/ai/AIChatBot';
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt';
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: {
    default: 'EARPI | Earth Regenerative Projects International',
    template: '%s | EARPI - Earth Regenerative Projects International',
  },
  description:
    'Earth Regenerative Projects International (EARPI) is a registered non-profit corporation dedicated to ecosystem restoration, climate resilience, and sustainable development in Sierra Leone and worldwide.',
  manifest: '/manifest.json',
  icons: {
    icon: '/assets/img/favicon.png',
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EARPI',
  },
  keywords: [
    'EARPI',
    'Earth Regenerative Projects',
    'Sierra Leone climate change',
    'ecosystem restoration',
    'mangrove reforestation',
    'clean energy Africa',
    'agroforestry',
    'non-profit climate',
  ],
  authors: [{ name: 'EARPI Team', url: 'https://earpi.org' }],
  metadataBase: new URL('https://earpi.org'),
  openGraph: {
    title: 'EARPI - Earth Regenerative Projects International',
    description:
      'Catalyzing climate resilience, youth empowerment, and regenerative ecosystems in Sierra Leone and worldwide.',
    url: 'https://earpi.org',
    siteName: 'EARPI',
    images: [
      {
        url: '/assets/img/logo.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#338F7A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/flaticon.css" />
        <link rel="stylesheet" href="/assets/css/remixicon.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />
        <link rel="stylesheet" href="/assets/css/dark-theme.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700&family=Spline+Sans:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        <ServiceWorkerRegister />
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
      </body>
    </html>
  );
}
