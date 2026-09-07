'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, TreeDeciduous, DollarSign, FileText, Wind, ArrowRight, Filter } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  location: string;
  status: string;
  fundingGoal: number;
  fundingRaised: number;
  treesTarget: number;
  treesPlanted: number;
  carbonOffsetTons: number;
  coverImage: string;
  documents: { name: string; url: string }[];
  featured: boolean;
}

const CATEGORIES = ['All', 'Reforestation', 'Agroforestry', 'Clean Energy', 'Education', 'Clean Water'];
const STATUSES = ['All', 'Active', 'Upcoming', 'Completed'];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Active: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
  Upcoming: { bg: 'rgba(234, 179, 8, 0.15)', color: '#facc15' },
  Completed: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
};

const CATEGORY_ICONS: Record<string, string> = {
  Reforestation: '🌳',
  Agroforestry: '🌾',
  'Clean Energy': '☀️',
  Education: '📚',
  'Clean Water': '💧',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    async function load() {
      const params = new URLSearchParams();
      if (category !== 'All') params.set('category', category);
      if (status !== 'All') params.set('status', status);
      const res = await fetch(`/api/projects?${params.toString()}`);
      const data = await res.json();
      setProjects(data.projects || []);
      setLoading(false);
    }
    load();
  }, [category, status]);

  return (
    <main>
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0a7154 100%)',
          padding: '80px 20px 60px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', border: '1px solid rgba(16,185,129,0.3)' }}>
            🌍 EARPI Field Initiatives · Sierra Leone
          </span>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, color: '#ffffff', margin: '0 0 16px', lineHeight: 1.2 }}>
            Our Climate Action Projects
          </h1>
          <p style={{ fontSize: '17px', color: '#a7f3d0', margin: '0 0 28px', lineHeight: 1.7 }}>
            Every initiative is a direct response to an ecological crisis. Track our progress — trees planted, carbon sequestered, communities transformed.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section style={{ backgroundColor: '#0b1915', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8aa69b', fontSize: '13px' }}>
            <Filter size={15} />
            <span>Filter:</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: `1px solid ${category === c ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                  backgroundColor: category === c ? 'rgba(16,185,129,0.15)' : 'transparent',
                  color: category === c ? '#10b981' : '#a7b8b2',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {c !== 'All' && CATEGORY_ICONS[c]} {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: `1px solid ${status === s ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                  backgroundColor: status === s ? 'rgba(16,185,129,0.1)' : 'transparent',
                  color: status === s ? '#10b981' : '#a7b8b2',
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section style={{ backgroundColor: '#0b1915', padding: '48px 20px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#10b981' }}>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8aa69b' }}>No projects found for this filter.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
              {projects.map((proj) => {
                const fundingPct = proj.fundingGoal > 0 ? Math.min(100, Math.round((proj.fundingRaised / proj.fundingGoal) * 100)) : 0;
                const statusColor = STATUS_COLORS[proj.status] || STATUS_COLORS.Active;

                return (
                  <div
                    key={proj.id}
                    style={{
                      backgroundColor: '#0c261e',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Cover Image */}
                    <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                      <img
                        src={proj.coverImage || '/assets/img/project/project-01.jpg'}
                        alt={proj.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,26,20,0.85) 0%, transparent 60%)' }} />
                      <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '6px' }}>
                        <span style={{ backgroundColor: statusColor.bg, color: statusColor.color, padding: '4px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 700, border: `1px solid ${statusColor.color}40` }}>{proj.status}</span>
                        <span style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#d1fae5', padding: '4px 10px', borderRadius: '12px', fontSize: '11.5px' }}>{CATEGORY_ICONS[proj.category]} {proj.category}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8aa69b', fontSize: '12px', marginBottom: '8px' }}>
                        <MapPin size={13} />
                        <span>{proj.location}</span>
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px', lineHeight: 1.35 }}>{proj.title}</h3>
                      <p style={{ fontSize: '13.5px', color: '#a7b8b2', margin: '0 0 16px', lineHeight: 1.6, flex: 1 }}>{proj.summary}</p>

                      {/* Impact Stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: '10px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#10b981', fontSize: '15px', fontWeight: 'bold' }}>
                            <TreeDeciduous size={13} /> {proj.treesPlanted ? proj.treesPlanted.toLocaleString() : '0'}
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#6b8a7d', marginTop: '2px' }}>Trees</div>
                        </div>
                        <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#60a5fa', fontSize: '15px', fontWeight: 'bold' }}>
                            <Wind size={13} /> {proj.carbonOffsetTons}t
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#6b8a7d', marginTop: '2px' }}>CO₂/yr</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#34d399', fontSize: '15px', fontWeight: 'bold' }}>
                            <DollarSign size={13} /> {fundingPct}%
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#6b8a7d', marginTop: '2px' }}>Funded</div>
                        </div>
                      </div>

                      {/* Funding Progress Bar */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#8aa69b', marginBottom: '5px' }}>
                          <span>${proj.fundingRaised?.toLocaleString()} raised</span>
                          <span>Goal: ${proj.fundingGoal?.toLocaleString()}</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${fundingPct}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px', transition: 'width 0.8s ease' }} />
                        </div>
                      </div>

                      {/* Docs & CTA */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {proj.documents && proj.documents.length > 0 && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#60a5fa' }}>
                            <FileText size={13} /> {proj.documents.length} Document{proj.documents.length > 1 ? 's' : ''}
                          </span>
                        )}
                        <Link
                          href={`/projects/${proj.slug}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            backgroundColor: '#10b981',
                            color: '#06281e',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '13px',
                            textDecoration: 'none',
                            marginLeft: 'auto',
                          }}
                        >
                          View Project <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
