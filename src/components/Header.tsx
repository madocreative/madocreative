import HeaderClient from '@/components/HeaderClient';
import { getPublicSiteSettings } from '@/lib/siteSettings';
import dbConnect from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import Content from '@/models/Content';

type NavChildLink = {
  name: string;
  path: string;
  description?: string;
};

const fallbackServiceLinks: NavChildLink[] = [
  {
    name: '01 - Weddings',
    path: '/services#weddings',
    description: 'Your strongest emotional work.',
  },
  {
    name: '02 - Portraits',
    path: '/services#portraits',
    description: 'Studio portraits and personal branding.',
  },
  {
    name: '03 - Commercial',
    path: '/services#commercial',
    description: 'Product photography and campaigns.',
  },
  {
    name: '04 - Events',
    path: '/services#events',
    description: 'Corporate and private celebrations.',
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function Header() {
  const settings = await getPublicSiteSettings();
  let portfolioLinks: NavChildLink[] = [];
  let serviceLinks: NavChildLink[] = fallbackServiceLinks;

  try {
    await dbConnect();

    const [galleries, servicesContent] = await Promise.all([
      Gallery.find({})
        .sort({ createdAt: -1 })
        .select('title slug')
        .limit(8)
        .lean(),
      Content.findOne({ page: 'services' }).select('sections').lean(),
    ]);

    portfolioLinks = Array.from(
      new Map(
        (galleries || [])
          .filter((gallery: any) => gallery?.title && gallery?.slug)
          .map((gallery: any) => [
            String(gallery.slug),
            {
              name: String(gallery.title),
              path: `/portfolio#gallery-${slugify(String(gallery.slug))}`,
            },
          ]),
      ).values(),
    );

    const sectionServices = Array.isArray((servicesContent as any)?.sections?.services)
      ? (servicesContent as any).sections.services
      : [];

    if (sectionServices.length > 0) {
      const mapped = sectionServices
        .slice(0, 4)
        .map((service: any, index: number) => ({
          name: `${String(index + 1).padStart(2, '0')} - ${String(service?.title || 'Service')}`,
          path:
            index === 0
              ? '/services#weddings'
              : index === 1
                ? '/services#portraits'
                : index === 2
                  ? '/services#commercial'
                  : index === 3
                    ? '/services#events'
                    : `/services#${slugify(String(service?.title || 'service'))}`,
          description:
            typeof service?.description === 'string' && service.description.trim().length > 0
              ? service.description.trim().slice(0, 72)
              : undefined,
        }))
        .filter((service: NavChildLink) => service.name.trim().length > 0);

      if (mapped.length > 0) {
        serviceLinks = mapped;
      }
    }
  } catch {
    portfolioLinks = [];
    serviceLinks = fallbackServiceLinks;
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
