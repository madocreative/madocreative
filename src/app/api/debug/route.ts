import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const info: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    node_version: process.version,
    platform: process.platform,
    env_keys: Object.keys(process.env).filter((k) =>
      ['MONGODB_URI', 'ADMIN_PASSWORD', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'NEXT_PUBLIC_'].some((prefix) =>
        k.startsWith(prefix)
      )
    ),
    mongodb_uri_set: !!process.env.MONGODB_URI,
    jwt_secret_set: !!process.env.JWT_SECRET,
    cloudinary_set: !!process.env.CLOUDINARY_CLOUD_NAME,
  };

  // Test mongoose import
  try {
    const mongoose = await import('mongoose');
    info.mongoose_version = mongoose.version;
    info.mongoose_ok = true;
  } catch (e) {
    info.mongoose_ok = false;
    info.mongoose_error = String(e);
  }

  // Test DB connection
  try {
    const { default: dbConnect } = await import('@/lib/mongodb');
    await dbConnect();
    info.db_connected = true;
  } catch (e) {
    info.db_connected = false;
    info.db_error = String(e);
  }

  console.log('[DEBUG ROUTE]', JSON.stringify(info, null, 2));
  return NextResponse.json(info);
}
