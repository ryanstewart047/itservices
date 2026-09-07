'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Search, Trash2, Download, Mail, Clock, AlertCircle } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: string;
  source?: string;
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/subscribers');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setSubscribers(data.subscribers || []);
      setLoading(false);
    }
    load();
  }, [router]);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Remove subscriber ${email}?`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/subscribers?id=${id}`, { method: 'DELETE' });
    if (res.ok) setSubscribers((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(null);
  };

  const exportCSV = () => {
    const header = 'Name,Email,Source,Status,Joined';
    const rows = subscribers.map((s) =>
      `"${s.name || ''}","${s.email}","${s.source || ''}","${s.status}","${new Date(s.createdAt).toLocaleDateString()}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earpi-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px' }}>Email Subscribers</h1>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#8aa69b' }}>
            {subscribers.length} total subscribers. Manage and export your mailing list.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            href="/admin/newsletter"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: '#10b981',
              borderRadius: '8px',
              color: '#06281e',
              fontSize: '13.5px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
            }}
          >
            <Mail size={16} />
            Compose Newsletter
          </Link>
          <button
            onClick={exportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#0c261e', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '8px', color: '#10b981', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600 }}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '380px', marginBottom: '20px' }}>
        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b8a7d' }} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 12px 10px 34px', backgroundColor: '#0c261e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {loading ? (
        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} /> Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ backgroundColor: '#0c261e', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#8aa69b', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <AlertCircle size={30} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p style={{ margin: 0 }}>No subscribers found.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#0c261e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.2)', color: '#a7b8b2', textAlign: 'left' }}>
                <th style={{ padding: '13px 16px' }}>Subscriber</th>
                <th style={{ padding: '13px 16px' }}>Source</th>
                <th style={{ padding: '13px 16px' }}>Status</th>
                <th style={{ padding: '13px 16px' }}>Joined</th>
                <th style={{ padding: '13px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
                        {(sub.name || sub.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: '#ffffff' }}>{sub.name || <em style={{ color: '#6b8a7d' }}>No name</em>}</div>
                        <div style={{ fontSize: '12px', color: '#8aa69b', display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={11} />{sub.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#a7b8b2' }}>{sub.source || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 600, backgroundColor: sub.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)', color: sub.status === 'active' ? '#34d399' : '#ef4444' }}>
                      {sub.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#8aa69b', fontSize: '12.5px' }}>{new Date(sub.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(sub.id, sub.email)}
                      disabled={deletingId === sub.id}
                      style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
