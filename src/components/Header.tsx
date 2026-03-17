import HeaderClient from '@/components/HeaderClient';
import { getPublicSiteSettings } from '@/lib/siteSettings';
import dbConnect from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

type NavChildLink = {
  name: string;
  path: string;
  description?: string;
};

type GallerySummary = {
  title?: string;
  category?: string;
  description?: string;
};

const fallbackPortfolioLinks: NavChildLink[] = [
  {
    name: 'Weddings Gallery',
    path: '/portfolio?category=Weddings#portfolio-collections',
    description: 'Timeless coverage of weddings and love stories.',
  },
  {
    name: 'Portraits Gallery',
    path: '/portfolio?category=Portraits#portfolio-collections',
    description: 'Studio portraits and personal branding.',
  },
  {
    name: 'Commercial Gallery',
    path: '/portfolio?category=Commercial#portfolio-collections',
    description: 'Product, campaign and brand photography.',
  },
  {
    name: 'Events Gallery',
    path: '/portfolio?category=Events#portfolio-collections',
    description: 'Corporate events, galas and private celebrations.',
  },
];

const fixedServiceLinks: NavChildLink[] = [
  {
    name: 'All Services',
    path: '/services',
    description: 'See all creative services and packages.',
  },
  {
    name: 'Photography',
    path: '/photography',
    description: 'Professional photography for every occasion.',
  },
  {
    name: 'Video Production',
    path: '/videography',
    description: 'Cinematic films, event coverage, and editing.',
  },
  {
    name: 'Digital Marketing',
    path: '/digital-marketing',
    description: 'Social growth, campaigns, ads, and strategy.',
  },
];

function toGalleryLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return 'Gallery';
  return /gallery$/i.test(trimmed) ? trimmed : `${trimmed} Gallery`;
}

export default async function Header() {
  const settings = await getPublicSiteSettings();
  let portfolioLinks: NavChildLink[] = fallbackPortfolioLinks;

  try {
    await dbConnect();

    const galleries = await Gallery.find({}).select('title category description').lean();

    if (Array.isArray(galleries) && galleries.length > 0) {
      const galleryDocs = galleries as GallerySummary[];
      const categoryMap = new Map<string, { count: number; description?: string }>();

      for (const gallery of galleryDocs) {
        const raw = String(gallery?.category || gallery?.title || '').trim();
        if (!raw) continue;

        const existing = categoryMap.get(raw);
        if (existing) {
          existing.count += 1;
        } else {
          categoryMap.set(raw, {
            count: 1,
            description:
              typeof gallery?.description === 'string' && gallery.description.trim().length > 0
                ? gallery.description.trim().slice(0, 72)
                : undefined,
          });
        }
      }

      const mapped = Array.from(categoryMap.entries())
        .slice(0, 8)
        .map(([categoryName, meta]) => ({
          name: toGalleryLabel(categoryName),
          path: `/portfolio?category=${encodeURIComponent(categoryName)}#portfolio-collections`,
          description: meta.description || `${meta.count} gallery ${meta.count > 1 ? 'collections' : 'collection'}`,
        }));

      if (mapped.length > 0) {
        portfolioLinks = mapped;
      }
    }
  } catch {
    portfolioLinks = fallbackPortfolioLinks;
  }

  return (
    <HeaderClient
      siteName={settings.siteName}
      logoUrl={settings.logoUrl}
      contactInfo={{
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
      }}
      portfolioLinks={portfolioLinks}
      serviceLinks={fixedServiceLinks}
    />
  );
}
