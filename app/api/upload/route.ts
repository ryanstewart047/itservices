import { NextRequest, NextResponse } from 'next/server';
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize and determine subfolder
    const isDoc = uploadType === 'doc' || file.name.endsWith('.pdf') || file.name.endsWith('.docx');
    const subDir = isDoc ? 'docs' : 'projects';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir);

    fs.mkdirSync(uploadDir, { recursive: true });

    // Clean filename: remove special characters, append timestamp
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(cleanName);
    const baseName = path.basename(cleanName, ext);
    const finalFilename = `${baseName}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, finalFilename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${subDir}/${finalFilename}`;
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
      { success: false, error: 'Failed to upload file. Please try again.' },
      { status: 500 }
    );
  }
}
