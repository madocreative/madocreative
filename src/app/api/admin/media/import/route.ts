import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import dbConnect from '@/lib/mongodb';
import MediaItem from '@/models/MediaItem';
import { getAdminSession } from '@/lib/auth';

type CloudinaryImageResource = {
    public_id: string;
    secure_url: string;
    original_filename?: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
    folder?: string;
};

async function listCloudinaryImages() {
    const resources: CloudinaryImageResource[] = [];
    let nextCursor: string | undefined;

    do {
        const response = await cloudinary.api.resources({
            type: 'upload',
            resource_type: 'image',
            max_results: 500,
            next_cursor: nextCursor,
        });

        resources.push(...((response.resources || []) as CloudinaryImageResource[]));
        nextCursor = response.next_cursor;
    } while (nextCursor);

    return resources;
}

function getFallbackFilename(resource: CloudinaryImageResource) {
    return resource.public_id.split('/').pop() || resource.public_id;
}

function getFallbackFolder(resource: CloudinaryImageResource) {
    if (resource.folder) return resource.folder;

    const parts = resource.public_id.split('/');
    return parts.length > 1 ? parts.slice(0, -1).join('/') : 'root';
}

export async function POST() {
    try {
        const session = await getAdminSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const resources = await listCloudinaryImages();
        let imported = 0;
        let updated = 0;

        for (const resource of resources) {
            const payload = {
                url: resource.secure_url,
                publicId: resource.public_id,
                filename: resource.original_filename || getFallbackFilename(resource),
                width: resource.width,
                height: resource.height,
                format: resource.format,
                bytes: resource.bytes,
                folder: getFallbackFolder(resource),
            };

            const existing = await MediaItem.findOne({
                $or: [
                    { publicId: resource.public_id },
                    { url: resource.secure_url },
                ],
            });

            if (existing) {
                existing.set(payload);
                await existing.save();
                updated += 1;
            } else {
                await MediaItem.create(payload);
                imported += 1;
            }
        }

        return NextResponse.json({
            success: true,
            scope: 'all-images',
            totalCloudinaryImages: resources.length,
            imported,
            updated,
        });
    } catch (error) {
        console.error('Cloudinary media import failed:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to import Cloudinary images.' },
            { status: 500 }
        );
    }
}
