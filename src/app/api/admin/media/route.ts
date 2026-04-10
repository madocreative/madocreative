import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MediaItem from '@/models/MediaItem';
import { getAdminSession } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const items = await MediaItem.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: items });
    } catch {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getAdminSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { id, ids } = await req.json();
        const targetIds = Array.isArray(ids)
            ? ids.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
            : typeof id === 'string' && id.trim().length > 0
                ? [id]
                : [];

        if (targetIds.length === 0) {
            return NextResponse.json({ success: false, error: 'No media items selected.' }, { status: 400 });
        }

        const items = await MediaItem.find({ _id: { $in: targetIds } });

        await Promise.allSettled(
            items
                .filter((item) => typeof item.publicId === 'string' && item.publicId.trim().length > 0)
                .map((item) => cloudinary.uploader.destroy(item.publicId, { resource_type: 'image' }))
        );

        const deleteResult = await MediaItem.deleteMany({ _id: { $in: targetIds } });

        return NextResponse.json({
            success: true,
            deletedCount: deleteResult.deletedCount ?? 0,
        });
    } catch {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
