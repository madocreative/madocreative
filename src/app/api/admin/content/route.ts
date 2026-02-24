import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const session = await getAdminSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const url = new URL(req.url);
        const page = url.searchParams.get('page');

        if (page) {
            const content = await Content.findOne({ page });
            return NextResponse.json({ success: true, data: content });
        }

        const allContent = await Content.find({});
        return NextResponse.json({ success: true, data: allContent });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getAdminSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Upsert (update or create) based on the page slug
        const updatedContent = await Content.findOneAndUpdate(
            { page: body.page },
            body,
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: updatedContent }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
