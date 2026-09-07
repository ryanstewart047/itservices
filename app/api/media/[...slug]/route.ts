import { NextRequest, NextResponse } from 'next/server';
import { getUpload } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    if (!slug || slug.length === 0) {
      return new NextResponse('Media Not Found', { status: 404 });
    }

    const id = slug[0];

    // 1. Try fetching from Neon database
    const dbUpload = await getUpload(id);
    if (dbUpload) {
      return new NextResponse(new Uint8Array(dbUpload.buffer), {
        headers: {
          'Content-Type': dbUpload.mimeType || 'application/octet-stream',
          'Content-Disposition': `inline; filename="${dbUpload.filename}"`,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. Fallback check local filesystem (for local dev or legacy files)
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'uploads', 'projects', slug.join('/')),
      path.join(process.cwd(), 'public', 'uploads', 'docs', slug.join('/')),
      path.join(process.cwd(), 'public', 'uploads', slug.join('/')),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        const fileBuffer = fs.readFileSync(p);
        const ext = path.extname(p).toLowerCase();
        let mime = 'application/octet-stream';
        if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
        else if (ext === '.png') mime = 'image/png';
        else if (ext === '.webp') mime = 'image/webp';
        else if (ext === '.gif') mime = 'image/gif';
        else if (ext === '.svg') mime = 'image/svg+xml';
        else if (ext === '.pdf') mime = 'application/pdf';

        return new NextResponse(new Uint8Array(fileBuffer), {
          headers: {
            'Content-Type': mime,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    return new NextResponse('Media File Not Found', { status: 404 });
  } catch (error) {
    console.error('Media Serving Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
