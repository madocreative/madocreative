import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import dbConnect from '@/lib/mongodb';
import MediaItem from '@/models/MediaItem';

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
                { folder: 'mado-creatives', resource_type: 'auto' },
                async (error, result) => {
                    if (error || !result) {
                        console.error('Cloudinary Upload Error:', error);
                        reject(NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 }));
                    } else {
                        // Save images to the media library. Video uploads are returned directly
                        // for use in the videography editor and should not pollute image pickers.
                        if (result.resource_type === 'image') {
                            try {
                                await dbConnect();
                                await MediaItem.findOneAndUpdate(
                                    { url: result.secure_url },
                                    {
                                        url:      result.secure_url,
                                        publicId: result.public_id,
                                        filename: file.name,
                                        width:    result.width,
                                        height:   result.height,
                                        format:   result.format,
                                        bytes:    result.bytes,
                                    },
                                    { upsert: true }
                                );
                            } catch (dbErr) {
                                console.error('MediaItem save error:', dbErr);
                            }
                        }
                        resolve(NextResponse.json({ success: true, url: result.secure_url, resourceType: result.resource_type }, { status: 200 }));
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
