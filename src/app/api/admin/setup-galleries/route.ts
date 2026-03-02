/**
 * POST /api/admin/setup-galleries
 * One-time helper: ensures the 4 canonical gallery categories exist.
 * Existing galleries keep their images; only missing ones are created.
 * Call this once from the browser or curl, then add images via /admin/galleries.
 */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

const CANONICAL_GALLERIES = [
  {
    title: 'Weddings',
    category: 'Weddings',
    description: 'Timeless coverage of weddings and love stories.',
  },
  {
    title: 'Portraits',
    category: 'Portraits',
    description: 'Studio portraits, personal branding and fashion.',
  },
  {
    title: 'Commercial',
    category: 'Commercial',
    description: 'Product, campaign and brand photography.',
  },
  {
    title: 'Events',
    category: 'Events',
    description: 'Corporate events, galas and private celebrations.',
  },
];

export async function POST() {
  try {
    await dbConnect();

    const results: { category: string; action: string }[] = [];

    for (const gallery of CANONICAL_GALLERIES) {
      const existing = await Gallery.findOne({ category: gallery.category });
      if (!existing) {
        await Gallery.create({
          title: gallery.title,
          category: gallery.category,
          description: gallery.description,
          images: [],
        });
        results.push({ category: gallery.category, action: 'created' });
      } else {
        results.push({ category: gallery.category, action: 'already exists' });
      }
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
