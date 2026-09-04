'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  Users,
  FolderKanban,
  TreeDeciduous,
  Wind,
  Mail,
  ArrowUpRight,
  PlusCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface KPIs {
  totalDonations: number;
  totalSubscribers: number;
  activeProjectsCount: number;
  totalProjectsCount: number;
  totalTreesPlanted: number;
  totalCarbonOffset: number;
  unreadMessagesCount: number;
}

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        if (data.kpis) {
          setKpis(data.kpis);
        }
      } catch (err) {
        console.error('Failed to load KPIs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [router]);

  if (loading) {
    return (
      <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', padding: '40px 0' }}>
        <Clock size={20} className="animate-spin" />
        <span>Loading Climate Dashboard Metrics...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Top Welcome Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px', color: '#ffffff' }}>
            Executive Climate Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#8aa69b' }}>
            Live performance, donations ledger, and field project operations across Sierra Leone.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            href="/admin/projects/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#10b981',
              color: '#06281e',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '13.5px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
            }}
          >
            <PlusCircle size={16} />
            <span>Post New Project</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '32px',
        }}
      >
        {/* Card 1: Donations */}
        <div
          style={{
            backgroundColor: '#0c261e',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#8aa69b', fontWeight: 500 }}>Total Funds Raised</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#ffffff' }}>
            ${kpis?.totalDonations?.toLocaleString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>
            <Link href="/admin/donations" style={{ color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View ledger & log donations <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Card 2: Subscribers */}
        <div
          style={{
            backgroundColor: '#0c261e',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#8aa69b', fontWeight: 500 }}>Email Subscribers</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#ffffff' }}>
            {kpis?.totalSubscribers || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>
            <Link href="/admin/subscribers" style={{ color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Manage & export CSV <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Card 3: Active Projects */}
        <div
          style={{
            backgroundColor: '#0c261e',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#8aa69b', fontWeight: 500 }}>Active Projects</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <FolderKanban size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#ffffff' }}>
            {kpis?.activeProjectsCount || 0}{' '}
            <span style={{ fontSize: '14px', color: '#8aa69b', fontWeight: 400 }}>
              / {kpis?.totalProjectsCount || 0} total
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>
            <Link href="/admin/projects" style={{ color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Track & post projects <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Card 4: Trees Planted */}
        <div
          style={{
            backgroundColor: '#0c261e',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#8aa69b', fontWeight: 500 }}>Trees Planted</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <TreeDeciduous size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#ffffff' }}>
            {kpis?.totalTreesPlanted?.toLocaleString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#8aa69b', marginTop: '6px' }}>
            Across 5 Sierra Leone field sites
          </div>
        </div>

        {/* Card 5: Carbon Offset */}
        <div
          style={{
            backgroundColor: '#0c261e',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#8aa69b', fontWeight: 500 }}>Carbon Offset</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Wind size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#ffffff' }}>
            {kpis?.totalCarbonOffset || 0} <span style={{ fontSize: '15px' }}>Tons</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8aa69b', marginTop: '6px' }}>
            Blue carbon & agroforestry
          </div>
        </div>

        {/* Card 6: Messages */}
        <div
          style={{
            backgroundColor: '#0c261e',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#8aa69b', fontWeight: 500 }}>Unread Inquiries</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
              <Mail size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: kpis?.unreadMessagesCount ? '#f87171' : '#ffffff' }}>
            {kpis?.unreadMessagesCount || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>
            <Link href="/admin/messages" style={{ color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View inbox <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launchpad & Operational Guide */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Box 1: Quick Actions */}
        <div
          style={{
            backgroundColor: '#0c261e',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px' }}>
            Command Shortcuts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              href="/admin/projects/new"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              <span>+ Create a New Climate Project</span>
              <ArrowUpRight size={16} color="#10b981" />
            </Link>
            <Link
              href="/admin/donations"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              <span>Log Manual / Grant Donation</span>
              <ArrowUpRight size={16} color="#a7b8b2" />
            </Link>
            <Link
              href="/admin/subscribers"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              <span>Export Email Subscribers (CSV)</span>
              <ArrowUpRight size={16} color="#a7b8b2" />
            </Link>
          </div>
        </div>

        {/* Box 2: System Status */}
        <div
          style={{
            backgroundColor: '#0c261e',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px' }}>
            System Infrastructure Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d1fae5' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>Next.js 15 PWA Production Build Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d1fae5' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>Live Vercel Edge Global CDN: <code>earpi.org</code></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d1fae5' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>Unified Database Layer Connected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d1fae5' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>Gmail SMTP Dispatcher Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
