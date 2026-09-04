import { NextRequest, NextResponse } from 'next/server';
import { getProjects } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const status = searchParams.get('status') || undefined;

  const projects = await getProjects({ category, status });
  return NextResponse.json({ projects });
}
