import HeaderClient from '@/components/HeaderClient';
import { getPublicSiteSettings } from '@/lib/siteSettings';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

type NavChildLink = {
  name: string;
  path: string;
  description?: string;
};

const fallbackPortfolioLinks: NavChildLink[] = [
  {
    name: '01 — Weddings',
    path: '/portfolio?category=Weddings',
    description: 'Timeless coverage of weddings and love stories.',
  },
  {
    name: '02 — Portraits',
    path: '/portfolio?category=Portraits',
    description: 'Studio portraits, personal branding & fashion.',
  },
  {
    name: '03 — Commercial',
    path: '/portfolio?category=Commercial',
    description: 'Product, campaign and brand photography.',
  },
  {
    name: '04 — Events',
    path: '/portfolio?category=Events',
    description: 'Corporate events, galas & private celebrations.',
  },
];

const fixedServiceLinks: NavChildLink[] = [
  {
    name: 'All Services',
    path: '/services',
    description: 'See all creative services and packages.',
  },
  {
    name: 'Videography',
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
  if (!trimmed) return 'Service Gallery';
  return /gallery$/i.test(trimmed) ? trimmed : `${trimmed} Gallery`;
}

export default async function Header() {
  const settings = await getPublicSiteSettings();
  let portfolioLinks: NavChildLink[] = fallbackPortfolioLinks;
  let serviceLinks: NavChildLink[] = fixedServiceLinks;

  try {
    await dbConnect();

    const servicesContent = await Content.findOne({ page: 'services' }).select('sections').lean();

    const sectionServices = Array.isArray((servicesContent as any)?.sections?.services)
      ? (servicesContent as any).sections.services
      : [];

    if (sectionServices.length > 0) {
      const mapped = sectionServices
        .slice(0, 4)
        .map((service: any, index: number) => ({
          name: `${String(index + 1).padStart(2, '0')} - ${toGalleryLabel(String(service?.title || 'Service'))}`,
          path: `/portfolio?category=${encodeURIComponent(String(service?.title || ''))}`,
          description:
            typeof service?.description === 'string' && service.description.trim().length > 0
              ? service.description.trim().slice(0, 72)
              : undefined,
        }))
        .filter((service: NavChildLink) => service.name.trim().length > 0);

      if (mapped.length > 0) {
        portfolioLinks = mapped;
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
