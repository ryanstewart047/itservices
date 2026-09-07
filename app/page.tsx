import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TreeDeciduous,
  Wind,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Heart,
  Sparkles,
  DollarSign,
  FileText,
  Users,
  Sun,
  Droplets,
  BookOpen,
  Sprout,
  Flame,
} from 'lucide-react';
import { getProjects, getSystemKPIs } from '@/lib/db';
import HomeNewsletterForm from '@/components/home/HomeNewsletterForm';
import HeroSlider from '@/components/home/HeroSlider';

export const metadata: Metadata = {
  title: 'EARPI | Earth Regenerative Projects International - Climate Action & Mangrove Reforestation',
  description:
    'USA 501(c)(3) registered non-profit leading community-driven blue carbon mangrove reforestation, regenerative agroforestry, and youth climate education across Sierra Leone.',
  openGraph: {
    title: 'EARPI - Regenerating Earth, Empowering Communities',
    description:
      'Explore active field initiatives, track mangrove reforestation milestones, and support grassroots climate resilience in Sierra Leone.',
    images: ['/assets/img/hero/hero-1.jpg'],
  },
};

export default async function HomePage() {
  const [projects, kpis] = await Promise.all([getProjects(), getSystemKPIs()]);

  const featuredProjects = projects.slice(0, 3);

  const pillars = [
    {
      number: '01',
      title: 'Ecosystem & Mangrove Restoration',
      description:
        'Restoring 500+ hectares of vital blue carbon mangrove buffer zones in Yawri Bay and Sherbro Island to protect coastal villages from sea surges.',
      icon: TreeDeciduous,
      link: '/priority-one',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    {
      number: '02',
      title: 'Clean Energy & Eco-Cookstoves',
      description:
        'Deploying fuel-efficient rocket stoves and solar home kits to eliminate firewood pressure on virgin rainforests and improve rural women’s health.',
      icon: Flame,
      link: '/priority-two',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      number: '03',
      title: 'Regenerative Agroforestry',
      description:
        'Planting native economic fruit and timber trees alongside organic staple crops to restore degraded soils and build smallholder food sovereignty.',
      icon: Sprout,
      link: '/priority-three',
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.1)',
    },
    {
      number: '04',
      title: 'Youth Climate Eco-Literacy',
      description:
        'Establishing school tree nurseries, green clubs, and environmental leadership forums across 20 secondary schools in Freetown and rural districts.',
      icon: BookOpen,
      link: '/priority-four',
      color: '#60a5fa',
      bg: 'rgba(96, 165, 250, 0.1)',
    },
    {
      number: '05',
      title: 'Solar Clean Water Security',
      description:
        'Constructing solar-pumped deep borehole filtration kiosks to provide disease-free drinking water to flood-vulnerable coastal settlements.',
      icon: Droplets,
      link: '/priority-five',
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.1)',
    },
  ];

  return (
    <main style={{ backgroundColor: '#071b15', color: '#f3f4f6', overflowX: 'hidden' }}>
      {/* ========================================================================= */}
      {/* 1. HERO SLIDER (Auto-advancing with 4 impact slides & unique messages) */}
      {/* ========================================================================= */}
      <HeroSlider />

      {/* ========================================================================= */}
      {/* 2. LIVE IMPACT METRICS BAR */}
      {/* ========================================================================= */}
      <section
        id="tracker"
        style={{
          backgroundColor: '#0a231b',
          borderTop: '1px solid rgba(16, 185, 129, 0.25)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '36px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            textAlign: 'center',
          }}
        >
          {/* Metric 1 */}
          <div style={{ padding: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: '#10b981',
                fontSize: 'clamp(28px, 4vw, 36px)',
                fontWeight: 900,
                marginBottom: '4px',
              }}
            >
              <TreeDeciduous size={28} />
              <span>{kpis.totalTreesPlanted ? kpis.totalTreesPlanted.toLocaleString() : '34,850'}+</span>
            </div>
            <div style={{ fontSize: '13px', color: '#8aa69b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Mangroves & Trees Planted
            </div>
          </div>

          {/* Metric 2 */}
          <div style={{ padding: '10px', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: '#60a5fa',
                fontSize: 'clamp(28px, 4vw, 36px)',
                fontWeight: 900,
                marginBottom: '4px',
              }}
            >
              <Wind size={28} />
              <span>{kpis.totalCarbonOffset || '640'} Tons</span>
            </div>
            <div style={{ fontSize: '13px', color: '#8aa69b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Blue Carbon Sequestered / Yr
            </div>
          </div>

          {/* Metric 3 */}
          <div style={{ padding: '10px', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: '#34d399',
                fontSize: 'clamp(28px, 4vw, 36px)',
                fontWeight: 900,
                marginBottom: '4px',
              }}
            >
              <MapPin size={28} />
              <span>8 Villages</span>
            </div>
            <div style={{ fontSize: '13px', color: '#8aa69b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Coastal Communities Fortified
            </div>
          </div>

          {/* Metric 4 */}
          <div style={{ padding: '10px', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: '#facc15',
                fontSize: 'clamp(28px, 4vw, 36px)',
                fontWeight: 900,
                marginBottom: '4px',
              }}
            >
              <DollarSign size={28} />
              <span>${kpis.totalDonations > 0 ? kpis.totalDonations.toLocaleString() : '0'}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#8aa69b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Live Verified Funds Raised
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LIVE PROJECT TRACKER SECTION */}
      {/* ========================================================================= */}
      <section id="tracker" style={{ padding: '90px 20px', backgroundColor: '#071b15' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              Live Field Monitoring
            </span>
            <h2
              style={{
                fontSize: 'clamp(26px, 4vw, 40px)',
                fontWeight: 900,
                color: '#ffffff',
                margin: '0 0 14px',
              }}
            >
              Active Climate Initiatives in Sierra Leone
            </h2>
            <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '16px', color: '#8aa69b', lineHeight: 1.6 }}>
              Every project is connected to our live database with transparent funding progress,
              ecological milestones, and downloadable field PDF briefs.
            </p>
          </div>

          {/* Projects Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '30px',
              marginBottom: '40px',
            }}
          >
            {featuredProjects.map((proj) => {
              const fundingPct =
                proj.fundingGoal > 0
                  ? Math.min(100, Math.round((proj.fundingRaised / proj.fundingGoal) * 100))
                  : 0;

              return (
                <div
                  key={proj.id}
                  style={{
                    backgroundColor: '#0c261e',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                    transition: 'transform 0.2s',
                  }}
                >
                  {/* Cover Photo */}
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img
                      src={proj.coverImage || '/assets/img/project/project-01.jpg'}
                      alt={proj.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to top, rgba(12, 38, 30, 0.95) 0%, transparent 60%)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        display: 'flex',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.9)',
                          color: '#06281e',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                        }}
                      >
                        {proj.status}
                      </span>
                      <span
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          color: '#d1fae5',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        {proj.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '24px 22px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#8aa69b',
                        fontSize: '12.5px',
                        marginBottom: '8px',
                      }}
                    >
                      <MapPin size={14} color="#10b981" />
                      <span>{proj.location}</span>
                    </div>

                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#ffffff',
                        margin: '0 0 10px',
                        lineHeight: 1.35,
                      }}
                    >
                      {proj.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '13.5px',
                        color: '#a7b8b2',
                        margin: '0 0 20px',
                        lineHeight: 1.6,
                        flex: 1,
                      }}
                    >
                      {proj.summary}
                    </p>

                    {/* Quick Ecological Indicators */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        padding: '12px 10px',
                        borderRadius: '10px',
                        marginBottom: '16px',
                        textAlign: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#10b981' }}>
                          {proj.treesPlanted ? proj.treesPlanted.toLocaleString() : '0'}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#6b8a7d', marginTop: '2px' }}>Trees</div>
                      </div>
                      <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#60a5fa' }}>
                          {proj.carbonOffsetTons}t
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#6b8a7d', marginTop: '2px' }}>CO₂/yr</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#34d399' }}>
                          {fundingPct}%
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#6b8a7d', marginTop: '2px' }}>Funded</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '18px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          color: '#8aa69b',
                          marginBottom: '6px',
                        }}
                      >
                        <span>${proj.fundingRaised?.toLocaleString()} raised</span>
                        <span>Goal: ${proj.fundingGoal?.toLocaleString()}</span>
                      </div>
                      <div
                        style={{
                          height: '7px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${fundingPct}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #10b981, #34d399)',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      {proj.documents && proj.documents.length > 0 ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#60a5fa' }}>
                          <FileText size={14} />
                          <span>{proj.documents.length} PDF Report</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#6b8a7d' }}>Community Mission</span>
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
                        }}
                      >
                        <span>View Details</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Projects Button */}
          <div style={{ textAlign: 'center' }}>
            <Link
              href="/projects"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 26px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14.5px',
                textDecoration: 'none',
              }}
            >
              <span>Explore All Initiatives & Filter by Category</span>
              <ArrowRight size={16} color="#10b981" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE 5 STRATEGIC PILLARS OF ACTION */}
      {/* ========================================================================= */}
      <section
        style={{
          padding: '90px 20px',
          backgroundColor: '#0a231b',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              Our Strategic Framework
            </span>
            <h2
              style={{
                fontSize: 'clamp(26px, 4vw, 40px)',
                fontWeight: 900,
                color: '#ffffff',
                margin: '0 0 14px',
              }}
            >
              5 Integrated Priorities for Earth Regeneration
            </h2>
            <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '16px', color: '#8aa69b', lineHeight: 1.6 }}>
              We connect ecological restoration with socio-economic empowerment, ensuring long-term
              grassroots stewardship of West Africa’s natural capital.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {pillars.map((p) => {
              const Icon = p.icon;

              return (
                <div
                  key={p.number}
                  style={{
                    backgroundColor: '#0c261e',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '18px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: p.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: p.color,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      style={{
                        fontSize: '22px',
                        fontWeight: 900,
                        color: 'rgba(255, 255, 255, 0.15)',
                      }}
                    >
                      {p.number}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#ffffff',
                      margin: '0 0 10px',
                      lineHeight: 1.35,
                    }}
                  >
                    {p.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '14px',
                      color: '#a7b8b2',
                      lineHeight: 1.6,
                      margin: '0 0 20px',
                      flex: 1,
                    }}
                  >
                    {p.description}
                  </p>

                  <Link
                    href={p.link}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: p.color,
                      fontWeight: 700,
                      fontSize: '13.5px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Read Priority Strategy</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHY SIERRA LEONE'S FRONTLINES MATTER */}
      {/* ========================================================================= */}
      <section style={{ padding: '90px 20px', backgroundColor: '#071b15' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '50px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Narrative */}
          <div>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '14px',
              }}
            >
              Grassroots Climate Resilience
            </span>
            <h2
              style={{
                fontSize: 'clamp(26px, 4vw, 40px)',
                fontWeight: 900,
                color: '#ffffff',
                margin: '0 0 20px',
                lineHeight: 1.2,
              }}
            >
              Why We Focus on West Africa’s Coastal Ecosystems
            </h2>
            <p style={{ fontSize: '15px', color: '#c6d8d0', lineHeight: 1.7, marginBottom: '18px' }}>
              Sierra Leone’s coastline is one of the most biodiverse blue carbon ecosystems in the world,
              yet rising sea levels, illegal sand mining, and severe mangrove logging threaten over 100
              fishing settlements.
            </p>
            <p style={{ fontSize: '15px', color: '#c6d8d0', lineHeight: 1.7, marginBottom: '24px' }}>
              EARPI trains local youth, women, and elders to construct community seedling nurseries,
              seed resilient native species, and replace fuel wood with solar energy and eco-stoves.
            </p>

            <blockquote
              style={{
                backgroundColor: '#0c261e',
                borderLeft: '4px solid #10b981',
                padding: '16px 20px',
                margin: '0 0 24px',
                borderRadius: '0 12px 12px 0',
                fontSize: '14.5px',
                fontStyle: 'italic',
                color: '#d1fae5',
                lineHeight: 1.6,
              }}
            >
              “True ecological regeneration only succeeds when local communities are its primary
              architects, guardians, and economic beneficiaries.”
              <footer style={{ fontStyle: 'normal', fontWeight: 'bold', color: '#10b981', marginTop: '6px', fontSize: '13px' }}>
                — Ryan Stewart, Executive Director of EARPI
              </footer>
            </blockquote>

            <Link
              href="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#10b981',
                color: '#06281e',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <span>Learn More About Our Team & Mission</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right Column: Imagery Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <img
              src="/assets/img/project/beach-cleaning.jpg"
              alt="Mangrove Field Restoration"
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            <img
              src="/assets/img/project/agri-2.jpg"
              alt="Community Agroforestry"
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', marginTop: '24px' }}
            />
            <img
              src="/assets/img/project/pro-04.jpg"
              alt="Clean Cookstoves Deployment"
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', marginTop: '-24px' }}
            />
            <img
              src="/assets/img/project/climate-letracy.jpg"
              alt="Youth Eco-Literacy Clubs"
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION / FIELD NEWSLETTER BANNER */}
      {/* ========================================================================= */}
      <section
        style={{
          padding: '80px 20px',
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0d9488 100%)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#10b981',
              color: '#06281e',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={28} />
          </div>

          <h2
            style={{
              fontSize: 'clamp(26px, 4.5vw, 42px)',
              fontWeight: 900,
              color: '#ffffff',
              margin: '0 0 14px',
              lineHeight: 1.2,
            }}
          >
            Join Our Global Climate Network
          </h2>

          <p style={{ fontSize: '16px', color: '#d1fae5', margin: '0 0 32px', lineHeight: 1.6 }}>
            Subscribe to receive quarterly field reports, blue carbon progress audits, and firsthand
            updates directly from our mangrove nurseries and agroforestry sites in Sierra Leone.
          </p>

          <HomeNewsletterForm />


        </div>
      </section>
    </main>
  );
}
