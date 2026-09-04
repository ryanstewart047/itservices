import fs from 'fs';
import path from 'path';

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
    fundingRaised: 31200,
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
    fundingRaised: 22400,
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
    fundingRaised: 24500,
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
    fundingRaised: 14800,
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
    fundingRaised: 16500,
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

const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'don-1',
    donorName: 'Global Regenerative Fund',
    donorEmail: 'grants@regenfond.org',
    amount: 15000,
    currency: 'USD',
    frequency: 'one-time',
    projectName: 'Coastal Mangrove Ecosystem Restoration',
    paymentMethod: 'Bank Wire',
    status: 'completed',
    notes: 'Restoration grant for Yawri Bay nursery equipment',
    createdAt: '2026-08-10T16:00:00.000Z',
  },
  {
    id: 'don-2',
    donorName: 'David & Clara Miller',
    donorEmail: 'miller.climate@gmail.com',
    amount: 1200,
    currency: 'USD',
    frequency: 'monthly',
    projectName: 'Community Agroforestry & Food Forests',
    paymentMethod: 'Credit Card',
    status: 'completed',
    notes: 'Monthly community sponsor pledge',
    createdAt: '2026-08-22T10:30:00.000Z',
  },
  {
    id: 'don-3',
    donorName: 'Anonymous Climate Angel',
    donorEmail: 'supporter@eco-action.net',
    amount: 5000,
    currency: 'USD',
    frequency: 'one-time',
    projectName: 'Solar Clean Tech & Eco-Stoves',
    paymentMethod: 'PayPal',
    status: 'completed',
    notes: 'Dedicated to women cookstove manufacturing in Bo District',
    createdAt: '2026-09-01T15:20:00.000Z',
  },
];

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
      'We love your grassroots youth school clubs! Would love to feature Ryan Stewart and EARPI student leads at our upcoming Youth Eco-Action forum.',
    isRead: true,
    createdAt: '2026-08-29T10:15:00.000Z',
  },
];

function readDB(): DatabaseSchema {
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
    console.error('Failed to read database file, returning initial fallback:', err);
    return {
      projects: INITIAL_PROJECTS,
      subscribers: INITIAL_SUBSCRIBERS,
      donations: INITIAL_DONATIONS,
      messages: INITIAL_MESSAGES,
    };
  }
}

function writeDB(data: DatabaseSchema): boolean {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to write database file:', err);
    return false;
  }
}

// -----------------------------
// PROJECT OPERATIONS
// -----------------------------
export async function getProjects(filter?: { category?: string; status?: string }): Promise<Project[]> {
  const db = readDB();
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
  const db = readDB();
  return db.projects?.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const db = readDB();
  const id = `proj-${Date.now()}`;
  const now = new Date().toISOString();
  const newProject: Project = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
  db.projects = [newProject, ...(db.projects || [])];
  writeDB(db);
  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const db = readDB();
  const index = db.projects?.findIndex((p) => p.id === id);
  if (index === -1 || index === undefined) return null;

  const existing = db.projects[index];
  const updated: Project = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  db.projects[index] = updated;
  writeDB(db);
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = readDB();
  const initialLen = db.projects?.length || 0;
  db.projects = (db.projects || []).filter((p) => p.id !== id);
  if (db.projects.length !== initialLen) {
    writeDB(db);
    return true;
  }
  return false;
}

// -----------------------------
// SUBSCRIBER OPERATIONS
// -----------------------------
export async function getSubscribers(): Promise<Subscriber[]> {
  const db = readDB();
  return (db.subscribers || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addSubscriber(email: string, name?: string, source?: string): Promise<Subscriber> {
  const db = readDB();
  const existing = db.subscribers?.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return existing;
  }
  const newSub: Subscriber = {
    id: `sub-${Date.now()}`,
    email: email.trim().toLowerCase(),
    name: name?.trim(),
    status: 'active',
    source: source || 'Website',
    createdAt: new Date().toISOString(),
  };
  db.subscribers = [newSub, ...(db.subscribers || [])];
  writeDB(db);
  return newSub;
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  const db = readDB();
  const initialLen = db.subscribers?.length || 0;
  db.subscribers = (db.subscribers || []).filter((s) => s.id !== id && s.email !== id);
  if (db.subscribers.length !== initialLen) {
    writeDB(db);
    return true;
  }
  return false;
}

// -----------------------------
// DONATION OPERATIONS
// -----------------------------
export async function getDonations(): Promise<Donation[]> {
  const db = readDB();
  return (db.donations || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addDonation(data: Omit<Donation, 'id' | 'createdAt'>): Promise<Donation> {
  const db = readDB();
  const newDonation: Donation = {
    ...data,
    id: `don-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.donations = [newDonation, ...(db.donations || [])];

  // If tied to a project, update fundingRaised automatically!
  if (data.projectId) {
    const project = db.projects?.find((p) => p.id === data.projectId);
    if (project) {
      project.fundingRaised = (project.fundingRaised || 0) + Number(data.amount);
      project.updatedAt = new Date().toISOString();
    }
  }

  writeDB(db);
  return newDonation;
}

export async function deleteDonation(id: string): Promise<boolean> {
  const db = readDB();
  const initialLen = db.donations?.length || 0;
  db.donations = (db.donations || []).filter((d) => d.id !== id);
  if (db.donations.length !== initialLen) {
    writeDB(db);
    return true;
  }
  return false;
}

// -----------------------------
// CONTACT MESSAGE OPERATIONS
// -----------------------------
export async function getContactMessages(): Promise<ContactMessage[]> {
  const db = readDB();
  return (db.messages || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addContactMessage(data: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt'>): Promise<ContactMessage> {
  const db = readDB();
  const newMsg: ContactMessage = {
    ...data,
    id: `msg-${Date.now()}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  db.messages = [newMsg, ...(db.messages || [])];
  writeDB(db);
  return newMsg;
}

export async function toggleMessageRead(id: string, isRead: boolean): Promise<boolean> {
  const db = readDB();
  const msg = db.messages?.find((m) => m.id === id);
  if (msg) {
    msg.isRead = isRead;
    writeDB(db);
    return true;
  }
  return false;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const db = readDB();
  const initialLen = db.messages?.length || 0;
  db.messages = (db.messages || []).filter((m) => m.id !== id);
  if (db.messages.length !== initialLen) {
    writeDB(db);
    return true;
  }
  return false;
}

// -----------------------------
// SYSTEM METRICS / KPI SUMMARY
// -----------------------------
export async function getSystemKPIs() {
  const db = readDB();
  const projects = db.projects || [];
  const donations = db.donations || [];
  const subscribers = db.subscribers || [];
  const messages = db.messages || [];

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
