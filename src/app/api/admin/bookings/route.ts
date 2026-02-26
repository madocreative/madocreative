import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
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
        const bookings = await Booking.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: bookings });
    } catch {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        await dbConnect();
        const { id, status, notes } = await req.json();
        const update: Record<string, string> = {};
        if (status) update.status = status;
        if (notes !== undefined) update.notes = notes;
        const updated = await Booking.findByIdAndUpdate(id, update, { new: true });
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
        await Booking.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
