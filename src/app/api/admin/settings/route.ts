import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
    try {
        await dbConnect();
        // No auth required for public reading of settings (used by Footer, Contact, etc.)
        let settings = await SiteSettings.findOne({ key: 'global' });
        if (!settings) {
            settings = await SiteSettings.create({ key: 'global' });
        }
        return NextResponse.json({ success: true, data: settings });
    } catch {
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
        const updated = await SiteSettings.findOneAndUpdate(
            { key: 'global' },
            { ...body, updatedAt: new Date() },
            { new: true, upsert: true }
        );
        return NextResponse.json({ success: true, data: updated });
    } catch {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
