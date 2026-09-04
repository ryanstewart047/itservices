'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';

const CATEGORIES = ['Reforestation', 'Agroforestry', 'Clean Energy', 'Education', 'Clean Water'];
const STATUSES = ['Active', 'Upcoming', 'Completed'];

export default function NewProjectPage() {
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
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

  const removeGalleryImage = (url: string) => {
    update('galleryImages', form.galleryImages.filter((img) => img !== url));
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
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
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
        router.push('/admin/projects');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save project. Try again.');
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
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block' as const,
    fontSize: '12px',
    fontWeight: 600 as const,
    color: '#a7b8b2',
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.4px',
  };

  const sectionStyle = {
    backgroundColor: '#0c261e',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
  };

  return (
    <div style={{ maxWidth: '840px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link
          href="/admin/projects"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#a7b8b2',
            textDecoration: 'none',
            fontSize: '13.5px',
          }}
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
        Post New Climate Project
      </h1>
      <p style={{ color: '#8aa69b', fontSize: '13.5px', marginBottom: '28px' }}>
        Add project details, upload cover images, gallery photos, and PDF documents.
      </p>

      {error && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13.5px',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Basic Information */}
        <div style={sectionStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981', margin: '0 0 20px' }}>
            📋 Project Information
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Project Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Coastal Mangrove Ecosystem Restoration"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Category *</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                style={inputStyle}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status *</label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                style={inputStyle}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="e.g. Yawri Bay, Sierra Leone"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Summary * (one or two sentences)</label>
            <textarea
              value={form.summary}
              onChange={(e) => update('summary', e.target.value)}
              placeholder="Brief description shown on project cards..."
              required
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>Full Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Comprehensive project description, impact narrative, communities served..."
              rows={8}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update('featured', e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
            />
            <span style={{ fontSize: '13.5px', color: '#a7b8b2' }}>
              Feature on Homepage (shows in the featured projects section)
            </span>
          </label>
        </div>

        {/* Section 2: Impact Metrics */}
        <div style={sectionStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981', margin: '0 0 20px' }}>
            📊 Impact Metrics & Funding Targets
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Funding Goal (USD)</label>
              <input
                type="number"
                value={form.fundingGoal}
                onChange={(e) => update('fundingGoal', e.target.value)}
                placeholder="e.g. 45000"
                min="0"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Funds Raised (USD)</label>
              <input
                type="number"
                value={form.fundingRaised}
                onChange={(e) => update('fundingRaised', e.target.value)}
                placeholder="e.g. 31200"
                min="0"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Trees Target</label>
              <input
                type="number"
                value={form.treesTarget}
                onChange={(e) => update('treesTarget', e.target.value)}
                placeholder="e.g. 50000"
                min="0"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Trees Planted</label>
              <input
                type="number"
                value={form.treesPlanted}
                onChange={(e) => update('treesPlanted', e.target.value)}
                placeholder="e.g. 34850"
                min="0"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Carbon Offset (tons/yr)</label>
              <input
                type="number"
                value={form.carbonOffsetTons}
                onChange={(e) => update('carbonOffsetTons', e.target.value)}
                placeholder="e.g. 640"
                min="0"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Cover Image */}
        <div style={sectionStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981', margin: '0 0 20px' }}>
            🖼️ Cover Image
          </h3>

          {form.coverImage ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={form.coverImage}
                alt="Cover"
                style={{ width: '280px', height: '180px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #10b981' }}
              />
              <button
                type="button"
                onClick={() => update('coverImage', '')}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(239,68,68,0.9)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 6px',
                  cursor: 'pointer',
                  color: '#fff',
                }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 20px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '2px dashed rgba(16, 185, 129, 0.4)',
                  borderRadius: '10px',
                  color: '#10b981',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {uploadingPhoto ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                <span>{uploadingPhoto ? 'Uploading...' : 'Click to upload cover photo'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 4: Photo Gallery */}
        <div style={sectionStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981', margin: '0 0 20px' }}>
            📸 Photo Gallery (Multiple Images)
          </h3>

          {form.galleryImages.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              {form.galleryImages.map((img) => (
                <div key={img} style={{ position: 'relative' }}>
                  <img
                    src={img}
                    alt="Gallery"
                    style={{ width: '110px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(img)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      backgroundColor: 'rgba(239,68,68,0.85)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 4px',
                      cursor: 'pointer',
                      color: '#fff',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploadingPhoto}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              backgroundColor: 'rgba(16, 185, 129, 0.07)',
              border: '2px dashed rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              color: '#a7b8b2',
              cursor: 'pointer',
              fontSize: '13.5px',
            }}
          >
            {uploadingPhoto ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span>{uploadingPhoto ? 'Uploading...' : 'Add gallery photos (multiple allowed)'}</span>
          </button>
        </div>

        {/* Section 5: Documents */}
        <div style={sectionStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981', margin: '0 0 20px' }}>
            📄 Project Documents (PDF, Word)
          </h3>

          {form.documents.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {form.documents.map((doc) => (
                <div
                  key={doc.url}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#93c5fd', fontSize: '13.5px' }}>
                    <FileText size={16} />
                    <span>{doc.name}</span>
                    {doc.size && <span style={{ color: '#6b8a7d', fontSize: '12px' }}>({doc.size})</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(doc.url)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={docInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            onChange={handleDocUpload}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => docInputRef.current?.click()}
            disabled={uploadingDoc}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              backgroundColor: 'rgba(59, 130, 246, 0.07)',
              border: '2px dashed rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: '#a7b8b2',
              cursor: 'pointer',
              fontSize: '13.5px',
            }}
          >
            {uploadingDoc ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            <span>{uploadingDoc ? 'Uploading...' : 'Upload PDF reports or project briefs'}</span>
          </button>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 28px',
              backgroundColor: '#10b981',
              color: '#06281e',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saving ? 'Saving Project...' : 'Publish Project'}</span>
          </button>

          <Link
            href="/admin/projects"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 28px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: '#a7b8b2',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontSize: '15px',
              textDecoration: 'none',
            }}
          >
            <X size={18} />
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
