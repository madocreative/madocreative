import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const newBooking = await Booking.create(body);
        return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
    } catch (error) {
        console.error('Booking API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to submit booking.' }, { status: 500 });
    }
}
