import { NextRequest, NextResponse } from 'next/server';
import { saveUpload } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const uploadType = (formData.get('type') as string) || 'photo';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Limit to 12MB
    const MAX_SIZE = 12 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 12MB limit. Please upload a smaller file.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const isDoc = uploadType === 'doc' || file.name.endsWith('.pdf') || file.name.endsWith('.docx');
    const subDir = isDoc ? 'docs' : 'projects';
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(cleanName) || (isDoc ? '.pdf' : '.jpg');
    const baseName = path.basename(cleanName, ext);
    const finalFilename = `${baseName}-${Date.now()}${ext}`;

    let publicUrl = '';
    let savedToDisk = false;

    // 1. Attempt writing to local disk (succeeds in local development)
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir);
      fs.mkdirSync(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, finalFilename);
      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/${subDir}/${finalFilename}`;
      savedToDisk = true;
    } catch {
      // Local filesystem is read-only (standard on Vercel serverless functions)
    }

    // 2. Persist to Neon Postgres DB so files are durable & served everywhere
    try {
      const dbUpload = await saveUpload({
        filename: finalFilename,
        mimeType: file.type || (isDoc ? 'application/pdf' : 'image/jpeg'),
        buffer,
      });

      // If disk was read-only or not available, use the database media route URL
      if (!savedToDisk || !publicUrl) {
        publicUrl = dbUpload.url;
      }
    } catch (dbErr) {
      console.warn('Database upload storage warning:', dbErr);
      // 3. Graceful fallback to Data URL for images if DB is temporarily unreachable
      if (!publicUrl) {
        publicUrl = `data:${file.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;
      }
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      name: file.name,
      size: `${sizeInMB} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
    });
  } catch (error: any) {
    console.error('File Upload Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload file. Please try again.' },
      { status: 500 }
    );
  }
}
