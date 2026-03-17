import HeaderClient from '@/components/HeaderClient';
import { getPublicSiteSettings } from '@/lib/siteSettings';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import Gallery from '@/models/Gallery';

type NavChildLink = {
  name: string;
  path: string;
  description?: string;
};

const fallbackPortfolioLinks: NavChildLink[] = [
  {
    name: '01 - Weddings Gallery',
    path: '/portfolio?category=Weddings#portfolio-collections',
    description: 'Timeless coverage of weddings and love stories.',
  },
  {
    name: '02 - Portraits Gallery',
    path: '/portfolio?category=Portraits#portfolio-collections',
    description: 'Studio portraits and personal branding.',
  },
  {
    name: '03 - Commercial Gallery',
    path: '/portfolio?category=Commercial#portfolio-collections',
    description: 'Product, campaign and brand photography.',
  },
  {
    name: '04 - Events Gallery',
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
  let serviceLinks: NavChildLink[] = fixedServiceLinks;

  try {
    await dbConnect();

    const [galleries, servicesContent] = await Promise.all([
      Gallery.find({}).select('title category description').lean(),
      Content.findOne({ page: 'services' }).select('sections').lean(),
    ]);

    if (Array.isArray(galleries) && galleries.length > 0) {
      const categoryMap = new Map<string, { count: number; description?: string }>();

      for (const gallery of galleries as any[]) {
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
        .map(([categoryName, meta], index) => ({
          name: `${String(index + 1).padStart(2, '0')} - ${toGalleryLabel(categoryName)}`,
          path: `/portfolio?category=${encodeURIComponent(categoryName)}#portfolio-collections`,
          description: meta.description || `${meta.count} gallery ${meta.count > 1 ? 'collections' : 'collection'}`,
        }));

      if (mapped.length > 0) {
        portfolioLinks = mapped;
      }
    }

    const sectionServices = Array.isArray((servicesContent as any)?.sections?.services)
      ? (servicesContent as any).sections.services
      : [];

    if (sectionServices.length > 0) {
      const mappedServices = sectionServices
        .slice(0, 4)
        .map((service: any) => ({
          name: String(service?.title || '').trim(),
          path: '/services',
          description:
            typeof service?.description === 'string' && service.description.trim().length > 0
              ? service.description.trim().slice(0, 72)
              : undefined,
        }))
        .filter((service: NavChildLink) => service.name.length > 0);

      if (mappedServices.length > 0) {
        serviceLinks = [
          {
            name: 'All Services',
            path: '/services',
            description: 'See all creative services and packages.',
          },
          ...mappedServices,
        ];
      }
    }
  } catch {
    portfolioLinks = fallbackPortfolioLinks;
    serviceLinks = fixedServiceLinks;
  }

  return (
    <HeaderClient
      contactInfo={{
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
      }}
      portfolioLinks={portfolioLinks}
      serviceLinks={serviceLinks}
    />
  );
}
