import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file = data.get('file') as File;
        if (!file) {
            return NextResponse.json({ success: false, error: 'No file received' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        return new Promise<NextResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'mado-creatives' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary Upload Error:', error);
                        reject(NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 }));
                    } else {
                        resolve(NextResponse.json({ success: true, url: result?.secure_url }, { status: 200 }));
                    }
                }
            );
            uploadStream.end(buffer);
        });

    } catch (error) {
        console.error('Error in upload route:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
