'use client';

import { useState } from 'react';
import { Lock, KeyRound, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#a7b8b2', marginBottom: 7 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Lock
          size={16}
          style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#6b8a7d' }}
        />
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder || '••••••••'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete="new-password"
          style={{
            width: '100%',
            padding: '12px 40px 12px 38px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 10,
            color: '#fff',
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b8a7d',
            padding: 2,
          }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setFeedback({ type: 'error', message: 'New password must be at least 8 characters.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: data.message || 'Password changed successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to change password.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <KeyRound size={22} color="#10b981" />
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff' }}>
            Admin Settings
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: 13.5, color: '#8aa69b' }}>
          Manage your administrative credentials. Changes are stored securely on the server.
        </p>
      </div>

      {/* Change Password card */}
      <div
        style={{
          backgroundColor: '#0c261e',
          border: '1px solid rgba(16,185,129,0.18)',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {/* Card header */}
        <div
          style={{
            padding: '18px 24px',
            background: 'linear-gradient(135deg,#064e3b,#065f46)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <ShieldCheck size={18} color="#34d399" />
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>
            Change Admin Password
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Security notice */}
          <div
            style={{
              padding: '11px 14px',
              borderRadius: 9,
              background: 'rgba(16,185,129,0.07)',
              border: '1px solid rgba(16,185,129,0.18)',
              marginBottom: 22,
              fontSize: 12.5,
              color: '#8aa69b',
              lineHeight: 1.6,
            }}
          >
            🔒 &nbsp;The new password is stored securely on the server — it is <strong style={{ color: '#a7f3d0' }}>never exposed</strong> in client-side JavaScript or browser dev tools.
          </div>

          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Enter your current password"
          />
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Min. 8 characters"
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter new password"
          />

          {/* Password strength hint */}
          {newPassword.length > 0 && (
            <div style={{ marginBottom: 18, fontSize: 12, color: newPassword.length >= 12 ? '#34d399' : newPassword.length >= 8 ? '#fbbf24' : '#f87171' }}>
              {newPassword.length >= 12 ? '✓ Strong password' : newPassword.length >= 8 ? '⚠ Acceptable — consider making it longer' : '✗ Too short (min 8 characters)'}
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 9,
                padding: '11px 14px',
                borderRadius: 9,
                background: feedback.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${feedback.type === 'success' ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
                color: feedback.type === 'success' ? '#34d399' : '#fca5a5',
                fontSize: 13,
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              {feedback.type === 'success' ? <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} /> : <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />}
              <span>{feedback.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              backgroundColor: loading ? 'rgba(16,185,129,0.4)' : '#10b981',
              color: '#061a14',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.2s',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Updating Password…
              </>
            ) : (
              <>
                <KeyRound size={16} />
                Update Admin Password
              </>
            )}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
      </div>

      {/* Info card */}
      <div
        style={{
          marginTop: 20,
          backgroundColor: '#0c261e',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: '18px 22px',
          fontSize: 13,
          color: '#8aa69b',
          lineHeight: 1.7,
        }}
      >
        <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#a7c9bc' }}>How password storage works:</p>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>The password you set here is saved to your secure Neon PostgreSQL database.</li>
          <li>It takes priority over the environment variable, so changes take effect <strong style={{ color: '#a7f3d0' }}>immediately</strong> without redeployment.</li>
          <li>The password is <strong style={{ color: '#a7f3d0' }}>never bundled into client JS</strong> — it only lives on the server.</li>
          <li>If you ever need to reset access, set <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4 }}>ADMIN_PASSWORD</code> in your Vercel dashboard and it will override the DB value.</li>
        </ul>
      </div>
    </div>
  );
}
