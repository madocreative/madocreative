import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Only protect /admin routes
    if (!path.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Allow access to the login page and API
    if (path === '/admin/login' || path.startsWith('/api/admin/login')) {
        return NextResponse.next();
    }

    // Check for the adminToken cookie
    const token = request.cookies.get('adminToken')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyJWT(token);

    if (!payload || payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
    matcher: ['/admin/:path*'],
};
