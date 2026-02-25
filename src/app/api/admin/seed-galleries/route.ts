import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import MediaItem from '@/models/MediaItem';
import { getAdminSession } from '@/lib/auth';

// Known Cloudinary images (all confirmed in codebase)
const KNOWN_IMAGES = [
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/i8xewrxxjabg40c1nhd8.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/luhwozrxtp1u5oehdyej.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971882/mado-creatives/nlw9iu68433ngreltzwt.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971885/mado-creatives/kgwmhi695gjdyey0qauv.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971887/mado-creatives/enbiztasgcryipz6x8py.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971889/mado-creatives/lgrj87iype8vbp5qiuzn.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971891/mado-creatives/kw9xzrjaw2mk62tv7z0o.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971892/mado-creatives/zupngrotm2mt5yqblvta.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971898/mado-creatives/qiojrpgavumzxuqhc8tn.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971899/mado-creatives/elx1jzuiydmyntvisbwm.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971900/mado-creatives/mbjmpnxnjrmfre3ctxan.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971901/mado-creatives/nm1vvf8uukzdsq6ubiyq.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971902/mado-creatives/gwd4ikdny7f7ve03wxnl.jpg',
];

const SEED_GALLERIES = [
    {
        title: 'Editorial Series',
        slug: 'editorial-series',
        category: 'Editorial',
        layout: 'masonry',
        featuredImage: KNOWN_IMAGES[0],
        images: [KNOWN_IMAGES[0], KNOWN_IMAGES[1], KNOWN_IMAGES[9], KNOWN_IMAGES[3]],
    },
    {
        title: 'Brand Campaigns',
        slug: 'brand-campaigns',
        category: 'Campaign',
        layout: 'masonry',
        featuredImage: KNOWN_IMAGES[1],
        images: [KNOWN_IMAGES[1], KNOWN_IMAGES[2], KNOWN_IMAGES[6], KNOWN_IMAGES[7]],
    },
    {
        title: 'Portrait Studies',
        slug: 'portrait-studies',
        category: 'Portraits',
        layout: 'grid',
        featuredImage: KNOWN_IMAGES[3],
        images: [KNOWN_IMAGES[3], KNOWN_IMAGES[4], KNOWN_IMAGES[5], KNOWN_IMAGES[6], KNOWN_IMAGES[7], KNOWN_IMAGES[8]],
    },
    {
        title: 'Creative Direction',
        slug: 'creative-direction',
        category: 'Art Direction',
        layout: 'masonry',
        featuredImage: KNOWN_IMAGES[9],
        images: [KNOWN_IMAGES[9], KNOWN_IMAGES[0], KNOWN_IMAGES[2], KNOWN_IMAGES[4]],
    },
];

export async function POST() {
    try {
        const session = await getAdminSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Register all known images in MediaItem library
        for (const url of KNOWN_IMAGES) {
            await MediaItem.findOneAndUpdate({ url }, { url }, { upsert: true });
        }

        // Create galleries (skip if slug already exists)
        const created: string[] = [];
        for (const g of SEED_GALLERIES) {
            const exists = await Gallery.findOne({ slug: g.slug });
            if (!exists) {
                await Gallery.create(g);
                created.push(g.title);
            }
        }

        return NextResponse.json({ success: true, created });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
