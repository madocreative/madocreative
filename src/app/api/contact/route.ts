import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const newContact = await Contact.create(body);
        return NextResponse.json({ success: true, data: newContact }, { status: 201 });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to submit contact.' }, { status: 500 });
    }
}
