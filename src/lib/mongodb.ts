/**
 * lib/mongodb.ts
 * Global MongoDB connection utility for Next.js API Routes / React Server Components
 */

import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-expect-error - Next.js handles global var pollution differently during dev reload
let cached = global.mongoose;

if (!cached) {
    // @ts-expect-error - Next.js handles global var pollution differently during dev reload
    cached = global.mongoose = { conn: null, promise: null };
}

function formatMongoConnectionError(error: unknown) {
    if (error instanceof Error && /ip .*whitelist|ip address.*whitelist|whitelisted/i.test(error.message)) {
        return new Error(
            'MongoDB Atlas rejected the connection. Check Atlas Network Access / IP allowlist for Vercel and any local machines that need access. Original error: ' + error.message,
            { cause: error }
        );
    }

    return error;
}

async function dbConnect() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            family: 4,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw formatMongoConnectionError(error);
    }

    return cached.conn;
}

export default dbConnect;
