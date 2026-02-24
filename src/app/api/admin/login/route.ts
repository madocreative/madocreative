import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mado2024!';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        if (password === ADMIN_PASSWORD) {
            // Create JWT token
            const token = await signJWT({ role: 'admin' });

            const response = NextResponse.json({ success: true }, { status: 200 });

            // Set HttpOnly cookie
            response.cookies.set({
                name: 'adminToken',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
