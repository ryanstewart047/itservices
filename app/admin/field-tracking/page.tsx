'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  Edit2,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TreeDeciduous,
  DollarSign,
  Wind,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Project } from '@/lib/db';

export default function FieldTrackingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Local editable draft state keyed by project id
  const [drafts, setDrafts] = useState<{
    [id: string]: {
      fundingRaised: number;
      treesPlanted: number;
      carbonOffsetTons: number;
      status: 'Active' | 'Upcoming' | 'Completed';
    };
  }>({});

  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
        const initialDrafts: any = {};
        data.projects.forEach((p: Project) => {
          initialDrafts[p.id] = {
            fundingRaised: p.fundingRaised || 0,
            treesPlanted: p.treesPlanted || 0,
            carbonOffsetTons: p.carbonOffsetTons || 0,
            status: p.status || 'Active',
          };
        });
        setDrafts(initialDrafts);
      }
    } catch (err) {
      setErrorMsg('Failed to load project records');
    } finally {
      setLoading(false);
    }
  };

  const handleDraftChange = (id: string, field: string, value: any) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleQuickSave = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;

    setSavingId(id);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fundingRaised: Number(draft.fundingRaised) || 0,
          treesPlanted: Number(draft.treesPlanted) || 0,
          carbonOffsetTons: Number(draft.carbonOffsetTons) || 0,
          status: draft.status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.map((p) => (p.id === id ? ({ ...p, ...draft } as Project) : p)));
        setSuccessMsg(`Field metrics for project updated successfully!`);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(data.error || 'Failed to update metrics');
      }
    } catch {
      setErrorMsg('Network error while saving metrics');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px', color: '#ffffff' }}>
            Field Tracking & Impact Metrics
          </h1>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#8aa69b' }}>
            Update ground-truth field data in real time. Modifications instantly reflect on public milestone counters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            href="/admin/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#d1fae5',
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <FolderKanban size={15} />
            <span>All Projects Table</span>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid #10b981',
            color: '#6ee7b7',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', padding: '40px 0' }}>
          <Loader2 size={20} className="animate-spin" />
          <span>Loading field tracking initiatives...</span>
        </div>
      ) : projects.length === 0 ? (
        <div
          style={{
            backgroundColor: '#0c261e',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#8aa69b',
            border: '1px dashed rgba(255,255,255,0.1)',
          }}
        >
          <AlertCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.6 }} />
          <p>No active projects found. Create a project first.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {projects.map((proj) => {
            const draft = drafts[proj.id] || {
              fundingRaised: proj.fundingRaised || 0,
              treesPlanted: proj.treesPlanted || 0,
              carbonOffsetTons: proj.carbonOffsetTons || 0,
              status: proj.status || 'Active',
            };

            const fundingGoal = proj.fundingGoal || 1;
            const fundingPct = Math.min(100, Math.round(((draft.fundingRaised || 0) / fundingGoal) * 100));

            const treesTarget = proj.treesTarget || 1;
            const treesPct = Math.min(100, Math.round(((draft.treesPlanted || 0) / treesTarget) * 100));

            return (
              <div
                key={proj.id}
                style={{
                  backgroundColor: '#0c261e',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '22px 24px',
                }}
              >
                {/* Project Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '18px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          color: '#34d399',
                          textTransform: 'uppercase',
                        }}
                      >
                        {proj.category}
                      </span>
                      <span style={{ fontSize: '12px', color: '#8aa69b' }}>• {proj.location}</span>
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                      {proj.title}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link
                      href={`/projects/${proj.slug}`}
                      target="_blank"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '7px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#a7b8b2',
                        fontSize: '12.5px',
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={14} />
                      <span>Live Site</span>
                    </Link>

                    <Link
                      href={`/admin/projects/${proj.id}/edit`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '7px 14px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        color: '#34d399',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <Edit2 size={14} />
                      <span>Full Editor</span>
                    </Link>
                  </div>
                </div>

                {/* Live Fields Edit Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '14px',
                    padding: '16px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    marginBottom: '16px',
                  }}
                >
                  {/* Funding Raised */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a7b8b2', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Funding Raised ($ USD)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={draft.fundingRaised}
                      onChange={(e) => handleDraftChange(proj.id, 'fundingRaised', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        color: '#10b981',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#8aa69b', marginTop: '4px', display: 'block' }}>
                      Goal: ${proj.fundingGoal?.toLocaleString()} ({fundingPct}%)
                    </span>
                  </div>

                  {/* Trees Planted */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a7b8b2', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Trees Planted
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={draft.treesPlanted}
                      onChange={(e) => handleDraftChange(proj.id, 'treesPlanted', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        color: '#34d399',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#8aa69b', marginTop: '4px', display: 'block' }}>
                      Target: {proj.treesTarget?.toLocaleString()} ({treesPct}%)
                    </span>
                  </div>

                  {/* Carbon Offset */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a7b8b2', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Carbon Offset (Tons)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={draft.carbonOffsetTons}
                      onChange={(e) => handleDraftChange(proj.id, 'carbonOffsetTons', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        color: '#60a5fa',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#8aa69b', marginTop: '4px', display: 'block' }}>
                      Blue carbon sequestration metric
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a7b8b2', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Status
                    </label>
                    <select
                      value={draft.status}
                      onChange={(e) => handleDraftChange(proj.id, 'status', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '13.5px',
                        outline: 'none',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <span style={{ fontSize: '11px', color: '#8aa69b', marginTop: '4px', display: 'block' }}>
                      Current field operation state
                    </span>
                  </div>
                </div>

                {/* Progress bars & Save Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                      <div style={{ width: `${fundingPct}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '3px', transition: 'width 0.3s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8aa69b' }}>
                      <span>Funding Progress: {fundingPct}%</span>
                      <span>Trees Planted: {treesPct}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickSave(proj.id)}
                    disabled={savingId === proj.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      borderRadius: '6px',
                      backgroundColor: '#10b981',
                      color: '#06281e',
                      border: 'none',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    {savingId === proj.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>{savingId === proj.id ? 'Updating...' : 'Save Field Metrics'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
