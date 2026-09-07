'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Users,
  HeartHandshake,
  Mail,
  ExternalLink,
  LogOut,
  Leaf,
  Send,
  Activity,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Projects & Tracker', href: '/admin/projects', icon: FolderKanban, exact: true },
    { name: 'Field Tracking', href: '/admin/field-tracking', icon: Activity, exact: true },
    { name: 'Post New Project', href: '/admin/projects/new', icon: PlusCircle, exact: true },
    { name: 'Subscribers', href: '/admin/subscribers', icon: Users, exact: true },
    { name: 'Send Newsletter', href: '/admin/newsletter', icon: Send, exact: true },
    { name: 'Donations & Ledger', href: '/admin/donations', icon: HeartHandshake, exact: true },
    { name: 'Inquiries & Inbox', href: '/admin/messages', icon: Mail, exact: true },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#06281e',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06281e',
          }}
        >
          <Leaf size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, letterSpacing: '-0.3px', color: '#fff' }}>
            EARPI Admin
          </h2>
          <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 500 }}>
            Climate Command Center
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#ffffff' : '#a7b8b2',
                backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={18} color={isActive ? '#10b981' : '#a7b8b2'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div
        style={{
          padding: '16px 14px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 12px',
            borderRadius: '6px',
            fontSize: '12.5px',
            color: '#a7b8b2',
            textDecoration: 'none',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        >
          <span>Live Site Preview</span>
          <ExternalLink size={14} />
        </Link>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: '6px',
            fontSize: '12.5px',
            color: '#ef4444',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
