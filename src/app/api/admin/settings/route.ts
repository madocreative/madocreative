import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getAdminSession } from '@/lib/auth';

const SOCIAL_DEFAULTS: Record<string, string> = {
    instagramUrl: 'https://www.instagram.com/madocreatives?igsh=aW1odHU3dHpicDN4&utm_source=qr',
    youtubeUrl: 'https://youtube.com/@mado_creatives?si=chXk0FZsbZDCzuB1',
    facebookUrl: 'https://www.facebook.com/share/1AzAt5JVpa/?mibextid=wwXIfr',
    telegramUrl: 'https://t.me/mado_creatives',
    whatsappUrl: 'https://whatsapp.com/channel/0029VbCPDBL1NCrUoC6L771C',
};

export async function GET() {
    try {
        await dbConnect();
        let settings = await SiteSettings.findOne({ key: 'global' });
        if (!settings) {
            settings = await SiteSettings.create({ key: 'global', ...SOCIAL_DEFAULTS });
        } else {
            // Seed any missing/default social URLs on first access
            let changed = false;
            for (const [field, url] of Object.entries(SOCIAL_DEFAULTS)) {
                if (!settings[field] || settings[field] === '#') {
                    settings[field] = url;
                    changed = true;
                }
            }
            if (changed) await settings.save();
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
