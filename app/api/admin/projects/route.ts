import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getProjects, createProject } from '@/lib/db';

export async function GET() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const projects = await getProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!data.title || !data.category || !data.summary) {
      return NextResponse.json(
        { error: 'Title, category, and summary are required' },
        { status: 400 }
      );
    }

    // Auto-generate slug from title
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newProject = await createProject({
      title: data.title,
      slug,
      summary: data.summary,
      description: data.description || data.summary,
      category: data.category,
      location: data.location || 'Sierra Leone',
      status: data.status || 'Active',
      fundingGoal: Number(data.fundingGoal) || 0,
      fundingRaised: Number(data.fundingRaised) || 0,
      treesTarget: Number(data.treesTarget) || 0,
      treesPlanted: Number(data.treesPlanted) || 0,
      carbonOffsetTons: Number(data.carbonOffsetTons) || 0,
      coverImage: data.coverImage || '/assets/img/project/project-01.jpg',
      galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : [],
      documents: Array.isArray(data.documents) ? data.documents : [],
      featured: Boolean(data.featured),
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (err: any) {
    console.error('Error creating project:', err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
