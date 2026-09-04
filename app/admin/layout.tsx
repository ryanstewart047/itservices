import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'EARPI Admin Portal | Climate Command Center',
  description: 'Manage projects, subscribers, donations, and inquiries for EARPI.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b1915', color: '#f3f4f6' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>{children}</main>
    </div>
  );
}
