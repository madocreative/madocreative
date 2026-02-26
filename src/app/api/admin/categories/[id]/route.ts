import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { getAdminSession } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getAdminSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const body = await req.json();
        const updated = await Category.findByIdAndUpdate(id, body, { new: true });
        if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: updated });
    } catch {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getAdminSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        // Also delete child subcategories
        await Category.deleteMany({ parent: id });
        await Category.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
