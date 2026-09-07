'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const CATEGORIES = ['Reforestation', 'Agroforestry', 'Clean Energy', 'Education', 'Clean Water'];
const STATUSES = ['Active', 'Upcoming', 'Completed'];

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [customGalleryUrl, setCustomGalleryUrl] = useState('');
  const [customDocName, setCustomDocName] = useState('');
  const [customDocUrl, setCustomDocUrl] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    description: '',
    category: 'Reforestation',
    location: 'Sierra Leone',
    status: 'Active',
    fundingGoal: '',
    fundingRaised: '',
    treesTarget: '',
    treesPlanted: '',
    carbonOffsetTons: '',
    featured: false,
    coverImage: '',
    galleryImages: [] as string[],
    documents: [] as { name: string; url: string; size?: string; uploadedAt?: string }[],
  });

  useEffect(() => {
    if (!id) return;
    async function fetchProject() {
      try {
        const res = await fetch(`/api/admin/projects/${id}`);
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        if (!res.ok) {
          setError('Project not found (404)');
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.project) {
          const p = data.project;
          setForm({
            title: p.title || '',
            slug: p.slug || '',
            summary: p.summary || '',
            description: p.description || '',
            category: p.category || 'Reforestation',
            location: p.location || 'Sierra Leone',
            status: p.status || 'Active',
            fundingGoal: p.fundingGoal !== undefined ? String(p.fundingGoal) : '',
            fundingRaised: p.fundingRaised !== undefined ? String(p.fundingRaised) : '',
            treesTarget: p.treesTarget !== undefined ? String(p.treesTarget) : '',
            treesPlanted: p.treesPlanted !== undefined ? String(p.treesPlanted) : '',
            carbonOffsetTons: p.carbonOffsetTons !== undefined ? String(p.carbonOffsetTons) : '',
            featured: Boolean(p.featured),
            coverImage: p.coverImage || '',
            galleryImages: Array.isArray(p.galleryImages) ? p.galleryImages : [],
            documents: Array.isArray(p.documents) ? p.documents : [],
          });
        }
      } catch (err) {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id, router]);

  const update = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'photo');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        update('coverImage', data.url);
      } else {
        setError(`Cover upload failed: ${data.error}`);
      }
    } catch {
      setError('Cover upload failed. Try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingPhoto(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', 'photo');
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success) uploadedUrls.push(data.url);
      }
      update('galleryImages', [...form.galleryImages, ...uploadedUrls]);
    } catch {
      setError('Gallery upload failed. Try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const addGalleryUrl = () => {
    if (!customGalleryUrl.trim()) return;
    update('galleryImages', [...form.galleryImages, customGalleryUrl.trim()]);
    setCustomGalleryUrl('');
  };

  const removeGalleryImage = (url: string) => {
    update('galleryImages', form.galleryImages.filter((img) => img !== url));
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingDoc(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', 'doc');
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success) {
          update('documents', [
            ...form.documents,
            { name: file.name, url: data.url, size: data.size, uploadedAt: data.uploadedAt },
          ]);
        }
      }
    } catch {
      setError('Document upload failed. Try again.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const addDocUrl = () => {
    if (!customDocUrl.trim()) return;
    const name = customDocName.trim() || 'Project Resource';
    update('documents', [
      ...form.documents,
      { name, url: customDocUrl.trim(), uploadedAt: new Date().toISOString() },
    ]);
    setCustomDocName('');
    setCustomDocUrl('');
  };

  const removeDocument = (url: string) => {
    update('documents', form.documents.filter((doc) => doc.url !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) {
      setError('Title and summary are required.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fundingGoal: Number(form.fundingGoal) || 0,
          fundingRaised: Number(form.fundingRaised) || 0,
          treesTarget: Number(form.treesTarget) || 0,
          treesPlanted: Number(form.treesPlanted) || 0,
          carbonOffsetTons: Number(form.carbonOffsetTons) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Project updated successfully! Field tracking data is live.');
        setTimeout(() => {
          router.push('/admin/projects');
          router.refresh();
        }, 1200);
      } else {
        setError(data.error || 'Failed to update project. Try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    backgroundColor: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#a7b8b2',
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.4px',
  };

  const sectionCardStyle = {
    backgroundColor: '#0c261e',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '24px',
    marginBottom: '24px',
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#10b981' }}>
        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: '#8aa69b' }}>Loading project data...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            href="/admin/projects"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: '#8aa69b',
              border: '1px solid rgba(255,255,255,0.08)',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px', color: '#ffffff' }}>
              Edit Project & Field Metrics
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#8aa69b' }}>
              Updating initiative ID: <code style={{ color: '#34d399' }}>{id}</code>
            </p>
          </div>
        </div>

        {form.slug && (
          <Link
            href={`/projects/${form.slug}`}
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#34d399',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={15} />
            <span>View Live on Site</span>
          </Link>
        )}
      </div>

      {/* Notifications */}
      {error && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '14px 18px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid #10b981',
            color: '#6ee7b7',
            padding: '14px 18px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div style={sectionCardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 18px' }}>
            Core Project Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Project Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. Yawri Bay Mangrove Sanctuary"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>URL Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => update('slug', e.target.value)}
                placeholder="e.g. yawri-bay-mangrove-sanctuary"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ backgroundColor: '#0c261e', color: '#fff' }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="e.g. Yawri Bay, Bonthe District"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Project Status</label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} style={{ backgroundColor: '#0c261e', color: '#fff' }}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Short Summary * (Card Overview)</label>
            <input
              type="text"
              value={form.summary}
              onChange={(e) => update('summary', e.target.value)}
              placeholder="One or two sentences explaining the initiative..."
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Full Project Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Detailed project context, methodology, community partners, and goals..."
              rows={7}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' }}
            />
          </div>
        </div>

        {/* Live Field Metrics & Impact Tracking */}
        <div style={sectionCardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 6px' }}>
            Live Field Metrics & Tracking
          </h2>
          <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#8aa69b' }}>
            These numbers power the live milestone progress bars and verified impact metrics on the website.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Funding Raised ($ USD)</label>
              <input
                type="number"
                min="0"
                value={form.fundingRaised}
                onChange={(e) => update('fundingRaised', e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Funding Target / Goal ($ USD)</label>
              <input
                type="number"
                min="0"
                value={form.fundingGoal}
                onChange={(e) => update('fundingGoal', e.target.value)}
                placeholder="50000"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Trees Planted to Date</label>
              <input
                type="number"
                min="0"
                value={form.treesPlanted}
                onChange={(e) => update('treesPlanted', e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Trees Target / Objective</label>
              <input
                type="number"
                min="0"
                value={form.treesTarget}
                onChange={(e) => update('treesTarget', e.target.value)}
                placeholder="10000"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Carbon Offset (Tons)</label>
              <input
                type="number"
                min="0"
                value={form.carbonOffsetTons}
                onChange={(e) => update('carbonOffsetTons', e.target.value)}
                placeholder="250"
                style={inputStyle}
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#d1fae5', fontSize: '14px', marginTop: '12px' }}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update('featured', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
            />
            <span>Feature this initiative on the homepage priority showcase</span>
          </label>
        </div>

        {/* Cover Photo & Imagery */}
        <div style={sectionCardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 16px' }}>
            Cover Image & Visuals
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Cover Photo</label>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {form.coverImage && (
                <div style={{ position: 'relative', width: '180px', height: '110px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <img src={form.coverImage} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: '240px' }}>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => update('coverImage', e.target.value)}
                  placeholder="Paste image URL (e.g. /assets/img/hero/slider-1.jpg or https://...)"
                  style={{ ...inputStyle, marginBottom: '8px' }}
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {uploadingPhoto ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span>Upload Local File</span>
                </button>
                <input
                  type="file"
                  ref={photoInputRef}
                  onChange={handleCoverUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <label style={labelStyle}>Field Photo Gallery</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {form.galleryImages.map((imgUrl, i) => (
                <div
                  key={i}
                  style={{
                    position: 'relative',
                    width: '100px',
                    height: '80px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <img src={imgUrl} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(imgUrl)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={customGalleryUrl}
                onChange={(e) => setCustomGalleryUrl(e.target.value)}
                placeholder="Or paste photo URL..."
                style={{ ...inputStyle, flex: 1, minWidth: '220px' }}
              />
              <button
                type="button"
                onClick={addGalleryUrl}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                <Plus size={15} />
                <span>Add URL</span>
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingPhoto}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  color: '#34d399',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                <Upload size={15} />
                <span>Upload Photos</span>
              </button>
              <input
                type="file"
                ref={galleryInputRef}
                onChange={handleGalleryUpload}
                accept="image/*"
                multiple
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Documents & Reports */}
        <div style={sectionCardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 16px' }}>
            Attached Documents, Audits & PDFs
          </h2>

          {form.documents.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {form.documents.map((doc, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={16} color="#60a5fa" />
                    <div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#93c5fd', fontSize: '13.5px', textDecoration: 'none', fontWeight: 500 }}
                      >
                        {doc.name}
                      </a>
                      {doc.size && (
                        <span style={{ fontSize: '11px', color: '#6b8a7d', marginLeft: '8px' }}>
                          ({doc.size})
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(doc.url)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={customDocName}
              onChange={(e) => setCustomDocName(e.target.value)}
              placeholder="Document Title (e.g. 2025 Audit PDF)"
              style={inputStyle}
            />
            <input
              type="text"
              value={customDocUrl}
              onChange={(e) => setCustomDocUrl(e.target.value)}
              placeholder="Document URL (https://...)"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={addDocUrl}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              <Plus size={15} />
              <span>Attach URL</span>
            </button>
            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              disabled={uploadingDoc}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                backgroundColor: 'rgba(96, 165, 250, 0.15)',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                borderRadius: '8px',
                color: '#93c5fd',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              <Upload size={15} />
              <span>Upload PDF / File</span>
            </button>
            <input
              type="file"
              ref={docInputRef}
              onChange={handleDocUpload}
              multiple
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', marginTop: '20px' }}>
          <Link
            href="/admin/projects"
            style={{
              padding: '12px 22px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: '#8aa69b',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: '8px',
              backgroundColor: '#10b981',
              border: 'none',
              color: '#06281e',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
            }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? 'Saving Updates...' : 'Save & Publish Updates'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
