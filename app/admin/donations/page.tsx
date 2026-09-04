'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, DollarSign, Clock, AlertCircle, X, Loader2 } from 'lucide-react';

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  frequency: string;
  projectName?: string;
  paymentMethod: string;
  status: string;
  notes?: string;
  createdAt: string;
}

const EMPTY_FORM = { donorName: '', donorEmail: '', amount: '', currency: 'USD', frequency: 'one-time', projectName: '', paymentMethod: 'Manual Entry', status: 'completed', notes: '' };

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/donations');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setDonations(data.donations || []);
      setLoading(false);
    }
    load();
  }, [router]);

  const totalRaised = donations.filter((d) => d.status === 'completed').reduce((acc, d) => acc + Number(d.amount), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.donorName || !form.amount) { setError('Donor name and amount are required.'); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      const data = await res.json();
      if (data.success) {
        setDonations((prev) => [data.donation, ...prev]);
        setForm(EMPTY_FORM);
        setShowForm(false);
      } else { setError(data.error || 'Failed to save'); }
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this donation record?')) return;
    const res = await fetch(`/api/admin/donations?id=${id}`, { method: 'DELETE' });
    if (res.ok) setDonations((prev) => prev.filter((d) => d.id !== id));
  };

  const inputStyle = { width: '100%', padding: '10px 12px', backgroundColor: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px' }}>Donations & Funding Ledger</h1>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#8aa69b' }}>
            Total raised: <strong style={{ color: '#10b981' }}>${totalRaised.toLocaleString()} USD</strong> across {donations.length} records
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#10b981', color: '#06281e', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13.5px', cursor: 'pointer' }}
        >
          <Plus size={16} />
          Log Donation
        </button>
      </div>

      {/* Log Donation Form */}
      {showForm && (
        <div style={{ backgroundColor: '#0c261e', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#fff', margin: 0, fontSize: '16px' }}>Log New Donation / Grant</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#a7b8b2', cursor: 'pointer' }}><X size={18} /></button>
          </div>
          {error && <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a7b8b2', marginBottom: '5px', textTransform: 'uppercase' }}>Donor Name *</label>
                <input type="text" value={form.donorName} onChange={(e) => setForm((f) => ({ ...f, donorName: e.target.value }))} placeholder="e.g. John Smith" required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a7b8b2', marginBottom: '5px', textTransform: 'uppercase' }}>Donor Email</label>
                <input type="email" value={form.donorEmail} onChange={(e) => setForm((f) => ({ ...f, donorEmail: e.target.value }))} placeholder="email@example.com" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a7b8b2', marginBottom: '5px', textTransform: 'uppercase' }}>Amount (USD) *</label>
                <input type="number" min="0" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="e.g. 1000" required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a7b8b2', marginBottom: '5px', textTransform: 'uppercase' }}>Frequency</label>
                <select value={form.frequency} onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))} style={inputStyle}>
                  <option value="one-time">One-Time</option>
                  <option value="monthly">Monthly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a7b8b2', marginBottom: '5px', textTransform: 'uppercase' }}>Project (Optional)</label>
                <input type="text" value={form.projectName} onChange={(e) => setForm((f) => ({ ...f, projectName: e.target.value }))} placeholder="e.g. Coastal Mangrove Restoration" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a7b8b2', marginBottom: '5px', textTransform: 'uppercase' }}>Payment Method</label>
                <select value={form.paymentMethod} onChange={(e) => setForm((f) => ({ ...f, paymentMethod: e.target.value }))} style={inputStyle}>
                  <option value="Manual Entry">Manual Entry</option>
                  <option value="Bank Wire">Bank Wire</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Grant">Grant</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a7b8b2', marginBottom: '5px', textTransform: 'uppercase' }}>Notes (Optional)</label>
              <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Any special notes about this donation..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', backgroundColor: '#10b981', color: '#06281e', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <DollarSign size={16} />}
              <span>{saving ? 'Saving...' : 'Record Donation'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Donations Table */}
      {loading ? (
        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', padding: '30px 0' }}><Clock size={18} /> Loading...</div>
      ) : donations.length === 0 ? (
        <div style={{ backgroundColor: '#0c261e', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#8aa69b', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <AlertCircle size={30} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>No donations recorded yet. Log your first donation above.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#0c261e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.2)', color: '#a7b8b2' }}>
                <th style={{ padding: '13px 16px' }}>Donor</th>
                <th style={{ padding: '13px 16px' }}>Amount</th>
                <th style={{ padding: '13px 16px' }}>Project</th>
                <th style={{ padding: '13px 16px' }}>Method</th>
                <th style={{ padding: '13px 16px' }}>Status</th>
                <th style={{ padding: '13px 16px' }}>Date</th>
                <th style={{ padding: '13px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500, color: '#fff' }}>{d.donorName}</div>
                    <div style={{ fontSize: '11.5px', color: '#8aa69b' }}>{d.donorEmail}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '15px' }}>${Number(d.amount).toLocaleString()}</div>
                    <div style={{ fontSize: '11.5px', color: '#8aa69b' }}>{d.frequency}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#a7b8b2', maxWidth: '180px' }}>{d.projectName || <em style={{ color: '#6b8a7d' }}>General Fund</em>}</td>
                  <td style={{ padding: '12px 16px', color: '#a7b8b2' }}>{d.paymentMethod}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 600, backgroundColor: d.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)', color: d.status === 'completed' ? '#34d399' : '#facc15' }}>{d.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#8aa69b', fontSize: '12.5px' }}>{new Date(d.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(d.id)} style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
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
