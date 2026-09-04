'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#061a14', color: '#f3f4f6' }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b1915', color: '#f3f4f6' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto', minHeight: '100vh' }}>{children}</main>
    </div>
  );
}
