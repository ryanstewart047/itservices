import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: 'Reforestation' | 'Agroforestry' | 'Clean Energy' | 'Education' | 'Clean Water';
  location: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  fundingGoal: number;
  fundingRaised: number;
  treesTarget: number;
  treesPlanted: number;
  carbonOffsetTons: number;
  coverImage: string;
  galleryImages: string[];
  documents: {
    name: string;
    url: string;
    size?: string;
    uploadedAt?: string;
  }[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  source?: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  frequency: 'one-time' | 'monthly' | 'annually';
  projectId?: string;
  projectName?: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface DatabaseSchema {
  projects: Project[];
  subscribers: Subscriber[];
  donations: Donation[];
  messages: ContactMessage[];
}

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Coastal Mangrove Ecosystem Restoration & Marine Protection',
    slug: 'coastal-mangrove-restoration',
    summary:
      'Restoring 500+ hectares of vital mangrove buffer zones along Yawri Bay and Sherbro Island to protect coastal communities from sea-level rise and storm surges.',
    description:
      'The coastline of Sierra Leone is experiencing rapid erosion and heightened vulnerability to tropical storms due to historical mangrove deforestation. EARPI is partnering directly with 8 indigenous coastal villages in Yawri Bay and Sherbro Island to establish community mangrove nurseries, cultivate resilient Rhizophora seedlings, and replant over 50,000 trees.\n\nThis project provides direct sustainable livelihoods through mangrove beekeeping, sustainable crab harvesting, and community ecotourism while sequestering over 640 tons of blue carbon annually.',
    category: 'Reforestation',
    location: 'Yawri Bay & Sherbro Island, Sierra Leone',
    status: 'Active',
    fundingGoal: 45000,
    fundingRaised: 0,
    treesTarget: 50000,
    treesPlanted: 34850,
    carbonOffsetTons: 640,
    coverImage: '/assets/img/project/project-01.jpg',
    galleryImages: [
      '/assets/img/project/project-02.jpg',
      '/assets/img/project/plant-trees.jpg',
      '/assets/img/project/beach-cleaning.jpg',
    ],
    documents: [
      {
        name: 'Mangrove Restoration Technical Brief 2026.pdf',
        url: '/assets/img/project/Climate change Awareness.pdf',
        size: '1.8 MB',
        uploadedAt: '2026-08-15',
      },
    ],
    featured: true,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-08-20T14:30:00.000Z',
  },
  {
    id: 'proj-2',
    title: 'Community Agroforestry & Regenerative Food Forests',
    slug: 'community-agroforestry-food-forests',
    summary:
      'Planting indigenous economic fruit and timber trees alongside regenerative staple crops to combat soil degradation and boost smallholder farmer food security.',
    description:
      'In Port Loko and Kambia districts, prolonged conventional slash-and-burn farming has depleted topsoil vitality. EARPI’s Agroforestry program introduces syntropic farming methods, multi-strata food forests (moringa, cashew, oil palm, breadfruit, and native timber), and biochar soil enrichment.\n\nOver 250 farming families have been trained in permaculture principles, dramatically increasing crop resilience against erratic dry seasons while building long-term carbon sinks.',
    category: 'Agroforestry',
    location: 'Port Loko District, Sierra Leone',
    status: 'Active',
    fundingGoal: 32000,
    fundingRaised: 0,
    treesTarget: 25000,
    treesPlanted: 16800,
    carbonOffsetTons: 320,
    coverImage: '/assets/img/project/agri-2.jpg',
    galleryImages: [
      '/assets/img/project/agri-3.jpg',
      '/assets/img/project/economic-tree.jpg',
      '/assets/img/project/pro-22.jpg',
    ],
    documents: [
      {
        name: 'Agroforestry Field Assessment Report.pdf',
        url: '/assets/img/project/Climate change Awareness.pdf',
        size: '2.4 MB',
        uploadedAt: '2026-07-12',
      },
    ],
    featured: true,
    createdAt: '2026-02-05T09:00:00.000Z',
    updatedAt: '2026-08-18T11:20:00.000Z',
  },
  {
    id: 'proj-3',
    title: 'Clean Energy Micro-Grids & Clean Cookstoves for Rural Women',
    slug: 'clean-energy-microgrids-cookstoves',
    summary:
      'Deploying solar community kits and fuel-efficient biomass cookstoves to eliminate kerosene reliance and decrease firewood collection pressures on virgin forests.',
    description:
      'Indoor air pollution from traditional wood fires is a leading health hazard for rural women and children in Sierra Leone. EARPI designs and distributes locally fabricated fuel-efficient rocket stoves and solar home lighting systems across underserved villages.\n\nThis project cuts household fuelwood demand by up to 60%, safeguarding regional woodlands and freeing up hours daily for women to pursue micro-enterprises.',
    category: 'Clean Energy',
    location: 'Kambia & Bo Districts, Sierra Leone',
    status: 'Active',
    fundingGoal: 28000,
    fundingRaised: 0,
    treesTarget: 5000,
    treesPlanted: 5000,
    carbonOffsetTons: 190,
    coverImage: '/assets/img/project/pro-04.jpg',
    galleryImages: [
      '/assets/img/project/pro-2.jpg',
      '/assets/img/project/pro-4.jpg',
    ],
    documents: [
      {
        name: 'Clean Cookstove Impact Metric Study.pdf',
        url: '/assets/img/project/Climate change Awareness.pdf',
        size: '1.2 MB',
        uploadedAt: '2026-06-30',
      },
    ],
    featured: true,
    createdAt: '2026-03-12T11:00:00.000Z',
    updatedAt: '2026-08-15T09:15:00.000Z',
  },
  {
    id: 'proj-4',
    title: 'Youth Green Climate Clubs & Eco-Literacy in Schools',
    slug: 'youth-green-climate-clubs',
    summary:
      'Empowering the next generation with environmental science education, tree nursery stewardship, and youth-led waste recycling clubs across 20 secondary schools.',
    description:
      'Education is the foundational driver of sustainable generational change. EARPI’s School Green Clubs supply educational kits, seedling beds, and waste management bins to schools in Freetown and the Western Area.\n\nStudents manage school nurseries, participate in regional green debate competitions, and spearhead beach cleaning campaigns to preserve marine ecosystems.',
    category: 'Education',
    location: 'Freetown & Western Area Rural, Sierra Leone',
    status: 'Active',
    fundingGoal: 18000,
    fundingRaised: 0,
    treesTarget: 10000,
    treesPlanted: 7600,
    carbonOffsetTons: 110,
    coverImage: '/assets/img/project/climate-letracy.jpg',
    galleryImages: [
      '/assets/img/project/climate-letracy01.jpg',
      '/assets/img/project/cleaning.jpg',
    ],
    documents: [
      {
        name: 'Youth Climate Curriculum Overview.pdf',
        url: '/assets/img/project/Climate change Awareness.pdf',
        size: '3.1 MB',
        uploadedAt: '2026-05-20',
      },
    ],
    featured: false,
    createdAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-08-10T16:45:00.000Z',
  },
  {
    id: 'proj-5',
    title: 'Solar-Powered Community Water Purification Kiosks',
    slug: 'solar-powered-water-kiosks',
    summary:
      'Installing solar-pumped deep borehole filtration units to deliver clean, disease-free drinking water to vulnerable flood-prone settlements.',
    description:
      'During heavy monsoon seasons, floodwaters contaminate surface wells with waterborne illnesses in coastal settlements. EARPI engineers solar-powered UV filtration kiosks that provide safe, reliable drinking water to over 8,000 residents without requiring diesel generator emissions.',
    category: 'Clean Water',
    location: 'Bullom Shore & Aberdeen Creek, Sierra Leone',
    status: 'Upcoming',
    fundingGoal: 35000,
    fundingRaised: 0,
    treesTarget: 2000,
    treesPlanted: 1200,
    carbonOffsetTons: 85,
    coverImage: '/assets/img/project/project-03.jpg',
    galleryImages: [
      '/assets/img/project/project-11.jpg',
      '/assets/img/project/round-table.jpg',
    ],
    documents: [],
    featured: false,
    createdAt: '2026-05-15T12:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
];

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'sub-1',
    email: 'climate.supporter@globalgreen.org',
    name: 'Eleanor Vance',
    status: 'active',
    source: 'Hero Form',
    createdAt: '2026-08-28T14:20:00.000Z',
  },
  {
    id: 'sub-2',
    email: 'kallon.mohammed@slclimate.gov.sl',
    name: 'Mohammed Kallon',
    status: 'active',
    source: 'Footer',
    createdAt: '2026-08-30T09:45:00.000Z',
  },
  {
    id: 'sub-3',
    email: 'sara.lindqvist@nordiceco.se',
    name: 'Sara Lindqvist',
    status: 'active',
    source: 'Newsletter Popup',
    createdAt: '2026-09-02T11:15:00.000Z',
  },
];

const INITIAL_DONATIONS: Donation[] = [];

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Dr. Alusine Kamara',
    email: 'akamara@njala.edu.sl',
    phone: '+232 76 554433',
    subject: 'Research Partnership on Blue Carbon Measurement',
    message:
      'We at Njala University Institute of Environmental Studies would like to partner with EARPI on carbon flux measurements across your Yawri Bay mangrove sites.',
    isRead: false,
    createdAt: '2026-09-02T13:40:00.000Z',
  },
  {
    id: 'msg-2',
    name: 'Claire Beauchamp',
    email: 'claire@earthshot-scouts.eu',
    subject: 'Youth Ambassador Collaboration for 2026 Summit',
    message:
      'We love your grassroots youth school clubs! Would love to feature Alimamy Sesay and EARPI student leads at our upcoming Youth Eco-Action forum.',
    isRead: true,
    createdAt: '2026-08-29T10:15:00.000Z',
  },
];

// ==========================================
// POSTGRES / NEON ENGINE
// ==========================================
function getDbUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

let pgInitialized = false;

async function getPgClient() {
  const url = getDbUrl();
  if (!url) return null;
  const sql = neon(url);
  if (!pgInitialized) {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          summary TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          location TEXT,
          status TEXT NOT NULL,
          funding_goal NUMERIC DEFAULT 0,
          funding_raised NUMERIC DEFAULT 0,
          trees_target NUMERIC DEFAULT 0,
          trees_planted NUMERIC DEFAULT 0,
          carbon_offset_tons NUMERIC DEFAULT 0,
          cover_image TEXT,
          gallery_images JSONB DEFAULT '[]'::jsonb,
          documents JSONB DEFAULT '[]'::jsonb,
          featured BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS subscribers (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          status TEXT DEFAULT 'active',
          source TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS donations (
          id TEXT PRIMARY KEY,
          donor_name TEXT NOT NULL,
          donor_email TEXT,
          amount NUMERIC NOT NULL,
          currency TEXT DEFAULT 'USD',
          frequency TEXT DEFAULT 'one-time',
          project_id TEXT,
          project_name TEXT,
          payment_method TEXT DEFAULT 'Manual Entry',
          status TEXT DEFAULT 'completed',
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          subject TEXT,
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;

      // Seed projects if empty
      const existingProjects = await sql`SELECT COUNT(*) as count FROM projects`;
      if (Number(existingProjects[0]?.count || 0) === 0) {
        for (const p of INITIAL_PROJECTS) {
          await sql`
            INSERT INTO projects (
              id, title, slug, summary, description, category, location, status,
              funding_goal, funding_raised, trees_target, trees_planted, carbon_offset_tons,
              cover_image, gallery_images, documents, featured, created_at, updated_at
            ) VALUES (
              ${p.id}, ${p.title}, ${p.slug}, ${p.summary}, ${p.description}, ${p.category}, ${p.location}, ${p.status},
              ${p.fundingGoal}, ${p.fundingRaised}, ${p.treesTarget}, ${p.treesPlanted}, ${p.carbonOffsetTons},
              ${p.coverImage}, ${JSON.stringify(p.galleryImages)}, ${JSON.stringify(p.documents)}, ${p.featured},
              ${p.createdAt}, ${p.updatedAt}
            ) ON CONFLICT (id) DO NOTHING
          `;
        }
      }

      pgInitialized = true;
    } catch (e) {
      console.error('Neon schema initialization error:', e);
    }
  }
  return sql;
}

// ==========================================
// LOCAL FILE FALLBACK ENGINE
// ==========================================
function readLocalDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData: DatabaseSchema = {
        projects: INITIAL_PROJECTS,
        subscribers: INITIAL_SUBSCRIBERS,
        donations: INITIAL_DONATIONS,
        messages: INITIAL_MESSAGES,
      };
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return {
      projects: INITIAL_PROJECTS,
      subscribers: INITIAL_SUBSCRIBERS,
      donations: INITIAL_DONATIONS,
      messages: INITIAL_MESSAGES,
    };
  }
}

function writeLocalDB(data: DatabaseSchema): boolean {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

// Mapper for SQL row to Project object
function mapProjectRow(r: any): Project {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    summary: r.summary,
    description: r.description || '',
    category: r.category,
    location: r.location || '',
    status: r.status,
    fundingGoal: Number(r.funding_goal) || 0,
    fundingRaised: Number(r.funding_raised) || 0,
    treesTarget: Number(r.trees_target) || 0,
    treesPlanted: Number(r.trees_planted) || 0,
    carbonOffsetTons: Number(r.carbon_offset_tons) || 0,
    coverImage: r.cover_image || '/assets/img/project/project-01.jpg',
    galleryImages: Array.isArray(r.gallery_images) ? r.gallery_images : typeof r.gallery_images === 'string' ? JSON.parse(r.gallery_images) : [],
    documents: Array.isArray(r.documents) ? r.documents : typeof r.documents === 'string' ? JSON.parse(r.documents) : [],
    featured: Boolean(r.featured),
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
  };
}

// -----------------------------
// PROJECT OPERATIONS
// -----------------------------
export async function getProjects(filter?: { category?: string; status?: string }): Promise<Project[]> {
  const sql = await getPgClient();
  if (sql) {
    try {
      let rows: any[] = [];
      if (filter?.category && filter.category !== 'All' && filter?.status && filter.status !== 'All') {
        rows = await sql`SELECT * FROM projects WHERE category ILIKE ${filter.category} AND status ILIKE ${filter.status} ORDER BY created_at DESC`;
      } else if (filter?.category && filter.category !== 'All') {
        rows = await sql`SELECT * FROM projects WHERE category ILIKE ${filter.category} ORDER BY created_at DESC`;
      } else if (filter?.status && filter.status !== 'All') {
        rows = await sql`SELECT * FROM projects WHERE status ILIKE ${filter.status} ORDER BY created_at DESC`;
      } else {
        rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
      }
      return rows.map(mapProjectRow);
    } catch (e) {
      console.error('Failed to query Neon Postgres, falling back to local file:', e);
    }
  }

  // Fallback to local DB
  const db = readLocalDB();
  let list = db.projects || [];
  if (filter?.category && filter.category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === filter.category!.toLowerCase());
  }
  if (filter?.status && filter.status !== 'All') {
    list = list.filter((p) => p.status.toLowerCase() === filter.status!.toLowerCase());
  }
  return list;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const sql = await getPgClient();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM projects WHERE slug = ${slug} OR id = ${slug} LIMIT 1`;
      if (rows.length > 0) {
        return mapProjectRow(rows[0]);
      }
      return null;
    } catch (e) {
      console.error('Error fetching project from Neon:', e);
    }
  }

  const db = readLocalDB();
  return db.projects?.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const id = `proj-${Date.now()}`;
  const now = new Date().toISOString();
  const newProject: Project = { ...data, id, createdAt: now, updatedAt: now };

  const sql = await getPgClient();
  if (sql) {
    try {
      await sql`
        INSERT INTO projects (
          id, title, slug, summary, description, category, location, status,
          funding_goal, funding_raised, trees_target, trees_planted, carbon_offset_tons,
          cover_image, gallery_images, documents, featured, created_at, updated_at
        ) VALUES (
          ${newProject.id}, ${newProject.title}, ${newProject.slug}, ${newProject.summary}, ${newProject.description},
          ${newProject.category}, ${newProject.location}, ${newProject.status},
          ${newProject.fundingGoal}, ${newProject.fundingRaised}, ${newProject.treesTarget}, ${newProject.treesPlanted},
          ${newProject.carbonOffsetTons}, ${newProject.coverImage}, ${JSON.stringify(newProject.galleryImages)},
          ${JSON.stringify(newProject.documents)}, ${newProject.featured}, ${newProject.createdAt}, ${newProject.updatedAt}
        )
      `;
      return newProject;
    } catch (e) {
      console.error('Failed to insert project into Neon:', e);
    }
  }

  const db = readLocalDB();
  db.projects = [newProject, ...(db.projects || [])];
  writeLocalDB(db);
  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const sql = await getPgClient();
  if (sql) {
    try {
      const existing = await getProjectBySlug(id);
      if (!existing) return null;
      const merged: Project = { ...existing, ...updates, updatedAt: new Date().toISOString() };
      await sql`
        UPDATE projects SET
          title = ${merged.title},
          slug = ${merged.slug},
          summary = ${merged.summary},
          description = ${merged.description},
          category = ${merged.category},
          location = ${merged.location},
          status = ${merged.status},
          funding_goal = ${merged.fundingGoal},
          funding_raised = ${merged.fundingRaised},
          trees_target = ${merged.treesTarget},
          trees_planted = ${merged.treesPlanted},
          carbon_offset_tons = ${merged.carbonOffsetTons},
          cover_image = ${merged.coverImage},
          gallery_images = ${JSON.stringify(merged.galleryImages)},
          documents = ${JSON.stringify(merged.documents)},
          featured = ${merged.featured},
          updated_at = ${merged.updatedAt}
        WHERE id = ${id} OR slug = ${id}
      `;
      return merged;
    } catch (e) {
      console.error('Failed to update project in Neon:', e);
    }
  }

  const db = readLocalDB();
  const index = db.projects?.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1 || index === undefined) return null;

  const existing = db.projects[index];
  const updated: Project = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  db.projects[index] = updated;
  writeLocalDB(db);
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const sql = await getPgClient();
  if (sql) {
    try {
      await sql`DELETE FROM projects WHERE id = ${id} OR slug = ${id}`;
      return true;
    } catch (e) {
      console.error('Failed to delete project from Neon:', e);
    }
  }

  const db = readLocalDB();
  const initialLen = db.projects?.length || 0;
  db.projects = (db.projects || []).filter((p) => p.id !== id && p.slug !== id);
  if (db.projects.length !== initialLen) {
    writeLocalDB(db);
    return true;
  }
  return false;
}

// -----------------------------
// SUBSCRIBER OPERATIONS
// -----------------------------
export async function getSubscribers(): Promise<Subscriber[]> {
  const sql = await getPgClient();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM subscribers ORDER BY created_at DESC`;
      return rows.map((r: any) => ({
        id: r.id,
        email: r.email,
        name: r.name || undefined,
        status: r.status || 'active',
        source: r.source || undefined,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.error('Failed to query subscribers from Neon:', e);
    }
  }

  const db = readLocalDB();
  return (db.subscribers || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function checkSubscriberExists(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  const sql = await getPgClient();
  if (sql) {
    try {
      const rows = await sql`SELECT id FROM subscribers WHERE email = ${cleanEmail} LIMIT 1`;
      return rows.length > 0;
    } catch (e) {
      console.error('Error checking subscriber in Neon:', e);
    }
  }
  const db = readLocalDB();
  return Boolean(db.subscribers?.some((s) => s.email.toLowerCase() === cleanEmail));
}

export async function addSubscriber(email: string, name?: string, source?: string): Promise<Subscriber> {
  const cleanEmail = email.trim().toLowerCase();

  // Validate: Flag any email that has more than two dots as invalid
  const dotCount = (cleanEmail.match(/\./g) || []).length;
  if (dotCount > 2) {
    throw new Error('INVALID_EMAIL_DOTS');
  }

  const sql = await getPgClient();
  if (sql) {
    try {
      // Check for duplicate in Neon
      const existing = await sql`SELECT id, email, name, status, source, created_at FROM subscribers WHERE email = ${cleanEmail} LIMIT 1`;
      if (existing.length > 0) {
        throw new Error('DUPLICATE_EMAIL');
      }

      const newSub: Subscriber = {
        id: `sub-${Date.now()}`,
        email: cleanEmail,
        name: name?.trim(),
        status: 'active',
        source: source || 'Website',
        createdAt: new Date().toISOString(),
      };

      await sql`
        INSERT INTO subscribers (id, email, name, status, source, created_at)
        VALUES (${newSub.id}, ${newSub.email}, ${newSub.name || null}, ${newSub.status}, ${newSub.source || null}, ${newSub.createdAt})
      `;
      return newSub;
    } catch (e: any) {
      if (e.message === 'DUPLICATE_EMAIL' || e.message === 'INVALID_EMAIL_DOTS') {
        throw e;
      }
      console.error('Failed to add subscriber to Neon:', e);
    }
  }

  const db = readLocalDB();
  const existing = db.subscribers?.find((s) => s.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('DUPLICATE_EMAIL');
  }

  const newSub: Subscriber = {
    id: `sub-${Date.now()}`,
    email: cleanEmail,
    name: name?.trim(),
    status: 'active',
    source: source || 'Website',
    createdAt: new Date().toISOString(),
  };

  db.subscribers = [newSub, ...(db.subscribers || [])];
  writeLocalDB(db);
  return newSub;
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  const sql = await getPgClient();
  if (sql) {
    try {
      await sql`DELETE FROM subscribers WHERE id = ${id} OR email = ${id}`;
      return true;
    } catch (e) {
      console.error('Failed to delete subscriber from Neon:', e);
    }
  }

  const db = readLocalDB();
  const initialLen = db.subscribers?.length || 0;
  db.subscribers = (db.subscribers || []).filter((s) => s.id !== id && s.email !== id);
  if (db.subscribers.length !== initialLen) {
    writeLocalDB(db);
    return true;
  }
  return false;
}

// -----------------------------
// DONATION OPERATIONS
// -----------------------------
export async function getDonations(): Promise<Donation[]> {
  const sql = await getPgClient();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM donations ORDER BY created_at DESC`;
      return rows.map((r: any) => ({
        id: r.id,
        donorName: r.donor_name,
        donorEmail: r.donor_email || '',
        amount: Number(r.amount) || 0,
        currency: r.currency || 'USD',
        frequency: r.frequency || 'one-time',
        projectId: r.project_id || undefined,
        projectName: r.project_name || undefined,
        paymentMethod: r.payment_method || 'Manual Entry',
        status: r.status || 'completed',
        notes: r.notes || '',
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.error('Failed to query donations from Neon:', e);
    }
  }

  const db = readLocalDB();
  return (db.donations || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addDonation(data: Omit<Donation, 'id' | 'createdAt'>): Promise<Donation> {
  const newDonation: Donation = {
    ...data,
    id: `don-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const sql = await getPgClient();
  if (sql) {
    try {
      await sql`
        INSERT INTO donations (id, donor_name, donor_email, amount, currency, frequency, project_id, project_name, payment_method, status, notes, created_at)
        VALUES (${newDonation.id}, ${newDonation.donorName}, ${newDonation.donorEmail}, ${newDonation.amount}, ${newDonation.currency}, ${newDonation.frequency}, ${newDonation.projectId || null}, ${newDonation.projectName || null}, ${newDonation.paymentMethod}, ${newDonation.status}, ${newDonation.notes || null}, ${newDonation.createdAt})
      `;
      const targetProjRef = data.projectId || data.projectName;
      if (targetProjRef && targetProjRef !== 'General Ecological Fund (Highest Need)' && targetProjRef !== 'General Fund') {
        await sql`
          UPDATE projects 
          SET funding_raised = funding_raised + ${Number(data.amount)},
              updated_at = ${new Date().toISOString()}
          WHERE id = ${targetProjRef} 
             OR slug = ${targetProjRef} 
             OR title ILIKE ${'%' + targetProjRef + '%'}
        `;
      }
      return newDonation;
    } catch (e) {
      console.error('Failed to add donation to Neon:', e);
    }
  }

  const db = readLocalDB();
  db.donations = [newDonation, ...(db.donations || [])];
  
  const targetProjRef = data.projectId || data.projectName;
  if (targetProjRef && targetProjRef !== 'General Ecological Fund (Highest Need)' && targetProjRef !== 'General Fund') {
    const project = db.projects?.find(
      (p) =>
        p.id === targetProjRef ||
        p.slug === targetProjRef ||
        p.title.toLowerCase().includes(targetProjRef.toLowerCase()) ||
        targetProjRef.toLowerCase().includes(p.title.toLowerCase())
    );
    if (project) {
      project.fundingRaised = (project.fundingRaised || 0) + Number(data.amount);
      project.updatedAt = new Date().toISOString();
    }
  }
  writeLocalDB(db);
  return newDonation;
}

export async function deleteDonation(id: string): Promise<boolean> {
  const sql = await getPgClient();
  if (sql) {
    try {
      const existing = await sql`SELECT * FROM donations WHERE id = ${id} LIMIT 1`;
      if (existing.length > 0) {
        const d = existing[0];
        const targetRef = d.project_id || d.project_name;
        if (targetRef) {
          await sql`
            UPDATE projects 
            SET funding_raised = GREATEST(0, funding_raised - ${Number(d.amount)}),
                updated_at = ${new Date().toISOString()}
            WHERE id = ${targetRef} OR slug = ${targetRef} OR title ILIKE ${'%' + targetRef + '%'}
          `;
        }
      }
      await sql`DELETE FROM donations WHERE id = ${id}`;
      return true;
    } catch (e) {
      console.error('Failed to delete donation from Neon:', e);
    }
  }

  const db = readLocalDB();
  const foundDonation = (db.donations || []).find((d) => d.id === id);
  if (foundDonation) {
    const targetRef = foundDonation.projectId || foundDonation.projectName;
    if (targetRef) {
      const project = db.projects?.find(
        (p) =>
          p.id === targetRef ||
          p.slug === targetRef ||
          p.title.toLowerCase().includes(targetRef.toLowerCase())
      );
      if (project) {
        project.fundingRaised = Math.max(0, (project.fundingRaised || 0) - Number(foundDonation.amount));
        project.updatedAt = new Date().toISOString();
      }
    }
  }

  const initialLen = db.donations?.length || 0;
  db.donations = (db.donations || []).filter((d) => d.id !== id);
  if (db.donations.length !== initialLen) {
    writeLocalDB(db);
    return true;
  }
  return false;
}

// -----------------------------
// CONTACT MESSAGE OPERATIONS
// -----------------------------
export async function getContactMessages(): Promise<ContactMessage[]> {
  const sql = await getPgClient();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM messages ORDER BY created_at DESC`;
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone || undefined,
        subject: r.subject || '',
        message: r.message || '',
        isRead: Boolean(r.is_read),
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.error('Failed to query messages from Neon:', e);
    }
  }

  const db = readLocalDB();
  return (db.messages || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addContactMessage(data: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt'>): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    ...data,
    id: `msg-${Date.now()}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  const sql = await getPgClient();
  if (sql) {
    try {
      await sql`
        INSERT INTO messages (id, name, email, phone, subject, message, is_read, created_at)
        VALUES (${newMsg.id}, ${newMsg.name}, ${newMsg.email}, ${newMsg.phone || null}, ${newMsg.subject}, ${newMsg.message}, false, ${newMsg.createdAt})
      `;
      return newMsg;
    } catch (e) {
      console.error('Failed to insert message into Neon:', e);
    }
  }

  const db = readLocalDB();
  db.messages = [newMsg, ...(db.messages || [])];
  writeLocalDB(db);
  return newMsg;
}

export async function toggleMessageRead(id: string, isRead: boolean): Promise<boolean> {
  const sql = await getPgClient();
  if (sql) {
    try {
      await sql`UPDATE messages SET is_read = ${isRead} WHERE id = ${id}`;
      return true;
    } catch (e) {
      console.error('Failed to toggle message read state in Neon:', e);
    }
  }

  const db = readLocalDB();
  const msg = db.messages?.find((m) => m.id === id);
  if (msg) {
    msg.isRead = isRead;
    writeLocalDB(db);
    return true;
  }
  return false;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const sql = await getPgClient();
  if (sql) {
    try {
      await sql`DELETE FROM messages WHERE id = ${id}`;
      return true;
    } catch (e) {
      console.error('Failed to delete message from Neon:', e);
    }
  }

  const db = readLocalDB();
  const initialLen = db.messages?.length || 0;
  db.messages = (db.messages || []).filter((m) => m.id !== id);
  if (db.messages.length !== initialLen) {
    writeLocalDB(db);
    return true;
  }
  return false;
}

// -----------------------------
// SYSTEM METRICS / KPI SUMMARY
// -----------------------------
export async function getSystemKPIs() {
  const projects = await getProjects();
  const donations = await getDonations();
  const subscribers = await getSubscribers();
  const messages = await getContactMessages();

  const totalDonations = donations
    .filter((d) => d.status === 'completed')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const totalTreesPlanted = projects.reduce(
    (acc, curr) => acc + (Number(curr.treesPlanted) || 0),
    0
  );

  const totalCarbonOffset = projects.reduce(
    (acc, curr) => acc + (Number(curr.carbonOffsetTons) || 0),
    0
  );

  const activeProjectsCount = projects.filter((p) => p.status === 'Active').length;
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  return {
    totalDonations,
    totalSubscribers: subscribers.length,
    activeProjectsCount,
    totalProjectsCount: projects.length,
    totalTreesPlanted,
    totalCarbonOffset,
    unreadMessagesCount,
  };
}
