import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/lib/db';
import Link from 'next/link';
import {
  MapPin,
  TreeDeciduous,
  Wind,
  DollarSign,
  FileText,
  ArrowLeft,
  Download,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Heart,
} from 'lucide-react';

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
  const related = allProjects
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, 3);

  const fundingPct =
    project.fundingGoal > 0
      ? Math.min(100, Math.round((project.fundingRaised / project.fundingGoal) * 100))
      : 0;

  const STATUS_COLOR: Record<string, string> = {
    Active: '#34d399',
    Upcoming: '#facc15',
    Completed: '#60a5fa',
  };

  const statusColor = STATUS_COLOR[project.status] || '#34d399';

  return (
    <main style={{ backgroundColor: '#0a1f17', color: '#f3f4f6', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      {/* Responsive Stylesheet */}
      <style>{`
        .project-detail-layout {
          max-width: 1140px;
          margin: 0 auto;
          padding: 36px 18px 60px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: start;
        }

        @media (min-width: 992px) {
          .project-detail-layout {
            grid-template-columns: 1fr 340px;
            padding: 48px 24px 80px;
            gap: 40px;
          }
        }

        .project-hero-container {
          position: relative;
          min-height: 380px;
          display: flex;
          align-items: flex-end;
          padding: 60px 18px 32px;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .project-hero-container {
            min-height: 440px;
            padding: 80px 24px 40px;
          }
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 150px), 1fr));
          gap: 12px;
        }

        @media (min-width: 640px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 14px;
          }
        }

        .impact-grid-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @media (max-width: 380px) {
          .impact-grid-stats {
            grid-template-columns: 1fr;
          }
        }

        .related-projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
          gap: 20px;
        }

        .project-sidebar-sticky {
          position: static;
        }

        @media (min-width: 992px) {
          .project-sidebar-sticky {
            position: sticky;
            top: 90px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="project-hero-container">
        <img
          src={project.coverImage || '/assets/img/project/project-01.jpg'}
          alt={project.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            zIndex: 0,
          }}
        />

        {/* Cinematic readability overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(6,26,20,0.98) 0%, rgba(6,26,20,0.7) 45%, rgba(6,26,20,0.4) 100%)',
            zIndex: 1,
          }}
        />

        {/* Hero Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '1140px',
            margin: '0 auto',
          }}
        >
          {/* Back Link */}
          <Link
            href="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#a7f3d0',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              marginBottom: '16px',
              padding: '6px 12px',
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(6px)',
              width: 'fit-content',
            }}
          >
            <ArrowLeft size={14} /> Back to All Projects
          </Link>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px', alignItems: 'center' }}>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: statusColor,
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 700,
                border: `1px solid ${statusColor}50`,
                backdropFilter: 'blur(6px)',
              }}
            >
              ● {project.status}
            </span>
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: '#d1fae5',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {project.category}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(22px, 5.5vw, 38px)',
              fontWeight: 900,
              color: '#ffffff',
              margin: '0 0 10px',
              lineHeight: 1.22,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              wordBreak: 'break-word',
            }}
          >
            {project.title}
          </h1>

          {/* Location */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#a7f3d0',
              fontSize: '13.5px',
              fontWeight: 500,
            }}
          >
            <MapPin size={15} style={{ flexShrink: 0, color: '#34d399' }} />
            <span>{project.location}</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="project-detail-layout">
        {/* Left Column: Project Details */}
        <div style={{ minWidth: 0, width: '100%' }}>
          {/* Summary Card */}
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '14px',
              padding: 'clamp(16px, 4vw, 22px)',
              marginBottom: '28px',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(14.5px, 2.5vw, 16.5px)',
                color: '#d1fae5',
                lineHeight: 1.7,
                fontWeight: 500,
              }}
            >
              {project.summary}
            </p>
          </div>

          {/* Full Description */}
          {project.description && (
            <div style={{ marginBottom: '36px' }}>
              <h2
                style={{
                  fontSize: 'clamp(18px, 3.5vw, 22px)',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: '0 0 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                About This Initiative
              </h2>
              <div
                style={{
                  color: '#c6d8d0',
                  fontSize: '15px',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {project.description}
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          {project.galleryImages && project.galleryImages.length > 0 && (
            <div style={{ marginBottom: '36px' }}>
              <h2
                style={{
                  fontSize: 'clamp(18px, 3.5vw, 22px)',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: '0 0 16px',
                }}
              >
                📸 Field Photography
              </h2>
              <div className="gallery-grid">
                {project.galleryImages.map((img, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '4 / 3',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backgroundColor: '#0c261e',
                    }}
                  >
                    <img
                      src={img}
                      alt={`Field verification ${i + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Documents */}
          {project.documents && project.documents.length > 0 && (
            <div style={{ marginBottom: '36px' }}>
              <h2
                style={{
                  fontSize: 'clamp(18px, 3.5vw, 22px)',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: '0 0 16px',
                }}
              >
                📄 Project Documents &amp; Field Briefs
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {project.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      backgroundColor: 'rgba(59, 130, 246, 0.08)',
                      border: '1px solid rgba(59, 130, 246, 0.22)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      gap: '12px',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#93c5fd',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <FileText size={20} style={{ flexShrink: 0, color: '#60a5fa' }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '13.5px',
                            color: '#e0f2fe',
                            wordBreak: 'break-word',
                          }}
                        >
                          {doc.name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#7ba395', marginTop: '2px' }}>
                          Verified Field Document · PDF / Report
                        </div>
                      </div>
                    </div>
                    <Download size={18} color="#60a5fa" style={{ flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Impact Metrics & Actions */}
        <div className="project-sidebar-sticky" style={{ minWidth: 0, width: '100%' }}>
          {/* Impact Metrics Card */}
          <div
            style={{
              backgroundColor: '#0c261e',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '16px',
              padding: 'clamp(18px, 4vw, 24px)',
              marginBottom: '20px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 16px',
                letterSpacing: '-0.01em',
              }}
            >
              🌍 Field Impact Metrics
            </h3>

            {/* Funding Progress Bar */}
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  color: '#a7b8b2',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontWeight: 600 }}>Funding Progress</span>
                <span style={{ color: '#10b981', fontWeight: 800, fontSize: '14px' }}>{fundingPct}%</span>
              </div>
              <div
                style={{
                  height: '10px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${fundingPct}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #34d399)',
                    borderRadius: '6px',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#8aa69b',
                  marginTop: '6px',
                  flexWrap: 'wrap',
                  gap: '4px',
                }}
              >
                <span style={{ color: '#34d399', fontWeight: 700 }}>
                  ${project.fundingRaised?.toLocaleString()} raised
                </span>
                <span>of ${project.fundingGoal?.toLocaleString()} goal</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="impact-grid-stats">
              <div
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '12px 10px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <TreeDeciduous size={18} color="#10b981" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#10b981' }}>
                  {project.treesPlanted ? project.treesPlanted.toLocaleString() : '0'}
                </div>
                <div style={{ fontSize: '10.5px', color: '#8aa69b', marginTop: '2px' }}>Trees Planted</div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '12px 10px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <TreeDeciduous size={18} color="#6b8a7d" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#a7b8b2' }}>
                  {project.treesTarget ? project.treesTarget.toLocaleString() : '0'}
                </div>
                <div style={{ fontSize: '10.5px', color: '#8aa69b', marginTop: '2px' }}>Trees Target</div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '12px 10px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <Wind size={18} color="#60a5fa" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#60a5fa' }}>
                  {project.carbonOffsetTons}t
                </div>
                <div style={{ fontSize: '10.5px', color: '#8aa69b', marginTop: '2px' }}>CO₂/yr</div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '12px 10px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <DollarSign size={18} color="#34d399" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#34d399' }}>
                  ${project.fundingRaised ? project.fundingRaised.toLocaleString() : '0'}
                </div>
                <div style={{ fontSize: '10.5px', color: '#8aa69b', marginTop: '2px' }}>Total Raised</div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              href="/donation"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 20px',
                backgroundColor: '#10b981',
                color: '#06281e',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '15px',
                textDecoration: 'none',
                textAlign: 'center',
                boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)',
              }}
            >
              <Heart size={16} fill="#06281e" />
              <span>Support This Project</span>
            </Link>

            <Link
              href="/projects"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#a7b8b2',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                fontSize: '13.5px',
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              ← Back to All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Related Projects Section */}
      {related.length > 0 && (
        <section
          style={{
            backgroundColor: '#061a14',
            padding: '48px 18px 60px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize: 'clamp(20px, 4vw, 24px)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '24px',
              }}
            >
              Related Climate Projects
            </h2>
            <div className="related-projects-grid">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  style={{
                    display: 'block',
                    backgroundColor: '#0c261e',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden' }}>
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(12,38,30,0.85) 0%, transparent 60%)',
                      }}
                    />
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: '6px',
                        lineHeight: 1.35,
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#8aa69b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <MapPin size={12} color="#10b981" />
                      <span>{p.location}</span>
                    </div>
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
