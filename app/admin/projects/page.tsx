'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  FileText,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Project } from '@/lib/db';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete project');
      }
    } catch {
      alert('Network error while deleting project');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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
            Projects & Field Tracking
          </h1>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#8aa69b' }}>
            Manage active initiatives, update funding and tree milestones, and attach photos and documents.
          </p>
        </div>

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
          }}
        >
          <PlusCircle size={16} />
          <span>Post New Project</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b8a7d',
            }}
          />
          <input
            type="text"
            placeholder="Search projects by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              backgroundColor: '#0c261e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '13.5px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px 16px',
            backgroundColor: '#0c261e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '13.5px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="All">All Categories</option>
          <option value="Reforestation">Reforestation</option>
          <option value="Agroforestry">Agroforestry</option>
          <option value="Clean Energy">Clean Energy</option>
          <option value="Education">Education</option>
          <option value="Clean Water">Clean Water</option>
        </select>
      </div>

      {/* Projects Table / Cards */}
      {loading ? (
        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', padding: '40px 0' }}>
          <Clock size={18} className="animate-spin" />
          <span>Loading Projects...</span>
        </div>
      ) : filtered.length === 0 ? (
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
          <AlertCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: '15px' }}>No projects match your search criteria.</p>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#0c261e',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.2)', color: '#a7b8b2' }}>
                <th style={{ padding: '14px 16px' }}>Project</th>
                <th style={{ padding: '14px 16px' }}>Category</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px' }}>Funding Progress</th>
                <th style={{ padding: '14px 16px' }}>Trees</th>
                <th style={{ padding: '14px 16px' }}>Documents</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((proj) => {
                const fundingPct = proj.fundingGoal > 0 ? Math.min(100, Math.round((proj.fundingRaised / proj.fundingGoal) * 100)) : 0;

                return (
                  <tr
                    key={proj.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* Project Title & Cover */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={proj.coverImage || '/assets/img/project/project-01.jpg'}
                          alt={proj.title}
                          style={{
                            width: '52px',
                            height: '42px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#ffffff', maxWidth: '300px' }}>
                            {proj.title}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#8aa69b' }}>{proj.location}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          fontWeight: 500,
                        }}
                      >
                        {proj.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          backgroundColor:
                            proj.status === 'Active'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : proj.status === 'Completed'
                              ? 'rgba(59, 130, 246, 0.2)'
                              : 'rgba(234, 179, 8, 0.2)',
                          color:
                            proj.status === 'Active'
                              ? '#34d399'
                              : proj.status === 'Completed'
                              ? '#60a5fa'
                              : '#facc15',
                        }}
                      >
                        {proj.status}
                      </span>
                    </td>

                    {/* Funding Progress */}
                    <td style={{ padding: '14px 16px', minWidth: '160px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#a7b8b2', marginBottom: '4px' }}>
                        <span>${proj.fundingRaised?.toLocaleString()}</span>
                        <span>{fundingPct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${fundingPct}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '3px' }} />
                      </div>
                    </td>

                    {/* Trees */}
                    <td style={{ padding: '14px 16px', color: '#d1fae5' }}>
                      {proj.treesPlanted ? proj.treesPlanted.toLocaleString() : '-'}
                    </td>

                    {/* Documents */}
                    <td style={{ padding: '14px 16px' }}>
                      {proj.documents && proj.documents.length > 0 ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#60a5fa', fontSize: '12px' }}>
                          <FileText size={14} />
                          <span>{proj.documents.length} PDF</span>
                        </span>
                      ) : (
                        <span style={{ color: '#6b8a7d', fontSize: '12px' }}>None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <Link
                          href={`/projects/${proj.slug}`}
                          target="_blank"
                          title="View on site"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            color: '#a7b8b2',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                          }}
                        >
                          <ExternalLink size={15} />
                        </Link>

                        <Link
                          href={`/admin/projects/${proj.id}/edit`}
                          title="Edit project"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            color: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          }}
                        >
                          <Edit2 size={15} />
                        </Link>

                        <button
                          onClick={() => handleDelete(proj.id, proj.title)}
                          disabled={deletingId === proj.id}
                          title="Delete project"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            color: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
