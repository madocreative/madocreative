import { NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
    try {
        const session = await getAdminSession();

        if (!session || session.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const body = await req.json().catch(() => ({}));
        const requestedResourceType = body?.resourceType;
        const resourceType = requestedResourceType === 'image' ? 'image' : 'video';

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            return NextResponse.json(
                { success: false, error: 'Cloudinary is not configured.' },
                { status: 500 },
            );
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const folder = 'mado-creatives';
        const signature = cloudinary.utils.api_sign_request(
            { folder, timestamp },
            apiSecret,
        );

        return NextResponse.json({
            success: true,
            cloudName,
            apiKey,
            folder,
            timestamp,
            signature,
            resourceType,
        });
    } catch (error) {
        console.error('Cloudinary signature error:', error);
        return NextResponse.json(
            { success: false, error: 'Could not prepare upload signature.' },
            { status: 500 },
        );
    }
}
