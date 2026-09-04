import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/lib/db';
import Link from 'next/link';
import { MapPin, TreeDeciduous, Wind, DollarSign, FileText, ArrowLeft, Download, Calendar } from 'lucide-react';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found | EARPI' };
  return {
    title: `${project.title} | EARPI`,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary, images: [project.coverImage] },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getProjects();
  const related = allProjects.filter((p) => p.slug !== project.slug && p.category === project.category).slice(0, 3);

  const fundingPct = project.fundingGoal > 0 ? Math.min(100, Math.round((project.fundingRaised / project.fundingGoal) * 100)) : 0;

  const STATUS_COLOR: Record<string, string> = { Active: '#34d399', Upcoming: '#facc15', Completed: '#60a5fa' };

  return (
    <main style={{ backgroundColor: '#0a1f17', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        <img
          src={project.coverImage || '/assets/img/project/project-01.jpg'}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,26,20,1) 0%, rgba(6,26,20,0.5) 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '900px', padding: '0 20px' }}>
          <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#a7f3d0', fontSize: '13px', textDecoration: 'none', marginBottom: '14px' }}>
            <ArrowLeft size={15} /> Back to All Projects
          </Link>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: STATUS_COLOR[project.status] || '#34d399', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, border: `1px solid ${STATUS_COLOR[project.status] || '#34d399'}40` }}>{project.status}</span>
            <span style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: '#d1fae5', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>{project.category}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, color: '#ffffff', margin: '0 0 8px', lineHeight: 1.2 }}>{project.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a7f3d0', fontSize: '13px' }}>
            <MapPin size={14} /><span>{project.location}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 20px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }}>
        {/* Left Column */}
        <div>
          {/* Summary */}
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '20px 22px', marginBottom: '28px' }}>
            <p style={{ margin: 0, fontSize: '16px', color: '#a7f3d0', lineHeight: 1.7, fontWeight: 500 }}>{project.summary}</p>
          </div>

          {/* Full Description */}
          {project.description && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 14px' }}>About This Project</h2>
              <div style={{ color: '#c6d8d0', fontSize: '15px', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{project.description}</div>
            </div>
          )}

          {/* Photo Gallery */}
          {project.galleryImages && project.galleryImages.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 16px' }}>📸 Field Photography</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {project.galleryImages.map((img, i) => (
                  <img key={i} src={img} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }} />
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {project.documents && project.documents.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 16px' }}>📄 Project Documents</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {project.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '10px', textDecoration: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#93c5fd' }}>
                      <FileText size={20} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{doc.name}</div>
                        {doc.size && <div style={{ fontSize: '12px', color: '#6b8a7d' }}>{doc.size}{doc.uploadedAt && ` · Uploaded ${doc.uploadedAt}`}</div>}
                      </div>
                    </div>
                    <Download size={18} color="#60a5fa" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ position: 'sticky', top: '100px' }}>
          {/* Impact Metrics Card */}
          <div style={{ backgroundColor: '#0c261e', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '14px', padding: '22px', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 18px' }}>🌍 Field Impact Metrics</h3>

            {/* Funding Progress */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#a7b8b2', marginBottom: '6px' }}>
                <span>Funding Progress</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>{fundingPct}%</span>
              </div>
              <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${fundingPct}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '5px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#8aa69b', marginTop: '5px' }}>
                <span>${project.fundingRaised?.toLocaleString()} raised</span>
                <span>of ${project.fundingGoal?.toLocaleString()}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                <TreeDeciduous size={20} color="#10b981" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{project.treesPlanted?.toLocaleString() || 0}</div>
                <div style={{ fontSize: '11px', color: '#8aa69b' }}>Trees Planted</div>
              </div>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                <TreeDeciduous size={20} color="#6b8a7d" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#a7b8b2' }}>{project.treesTarget?.toLocaleString() || 0}</div>
                <div style={{ fontSize: '11px', color: '#8aa69b' }}>Trees Target</div>
              </div>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                <Wind size={20} color="#60a5fa" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#60a5fa' }}>{project.carbonOffsetTons}t</div>
                <div style={{ fontSize: '11px', color: '#8aa69b' }}>CO₂/year</div>
              </div>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                <DollarSign size={20} color="#34d399" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#34d399' }}>${project.fundingRaised?.toLocaleString() || 0}</div>
                <div style={{ fontSize: '11px', color: '#8aa69b' }}>Raised</div>
              </div>
            </div>
          </div>

          {/* Donate CTA */}
          <Link
            href="/donation"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '15px', backgroundColor: '#10b981', color: '#06281e', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', textDecoration: 'none', marginBottom: '12px', textAlign: 'center' }}
          >
            💚 Support This Project
          </Link>
          <Link
            href="/projects"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#a7b8b2', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '14px', textDecoration: 'none', textAlign: 'center' }}
          >
            ← View All Projects
          </Link>
        </div>
      </section>

      {/* Related Projects */}
      {related.length > 0 && (
        <section style={{ backgroundColor: '#061a14', padding: '48px 20px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', marginBottom: '24px' }}>Related Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {related.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} style={{ display: 'block', backgroundColor: '#0c261e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none' }}>
                  <img src={p.coverImage} alt={p.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: 1.3 }}>{p.title}</div>
                    <div style={{ fontSize: '12.5px', color: '#8aa69b' }}>{p.location}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
