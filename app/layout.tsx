import type { Metadata, Viewport } from 'next';
import SiteShell from '@/components/layout/SiteShell';
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
    icon: [
      { url: '/assets/img/favicon.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
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
    <html lang="en" suppressHydrationWarning>
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
      <body suppressHydrationWarning>
        <ServiceWorkerRegister />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
