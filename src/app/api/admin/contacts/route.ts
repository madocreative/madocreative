import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { getAdminSession } from '@/lib/auth';

async function requireAdmin() {
    const session = await getAdminSession();
    if (!session || session.role !== 'admin') return false;
    return true;
}

export async function GET() {
    try {
        if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        await dbConnect();
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: contacts });
    } catch {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        await dbConnect();
        const { id, read } = await req.json();
        const updated = await Contact.findByIdAndUpdate(id, { read }, { new: true });
        return NextResponse.json({ success: true, data: updated });
    } catch {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        await dbConnect();
        const { id } = await req.json();
        await Contact.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
