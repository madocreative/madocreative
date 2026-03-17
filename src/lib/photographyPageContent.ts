import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import {
  photographyPageDefaults,
  type PhotographyCollection,
  type PhotographyPageData,
  type PhotographyProcessStep,
  type PhotographyServiceItem,
  type PhotographyStat,
} from '@/lib/photographyPageDefaults';

function getString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function getStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeStats(value: unknown, fallback: PhotographyStat[]): PhotographyStat[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item) => {
      const stat = item as Partial<PhotographyStat>;
      return {
        value: getString(stat?.value, ''),
        label: getString(stat?.label, ''),
      };
    })
    .filter((item) => item.value.length > 0 || item.label.length > 0);
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeServices(value: unknown, fallback: PhotographyServiceItem[]): PhotographyServiceItem[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item) => {
      const service = item as Partial<PhotographyServiceItem>;
      return {
        title: getString(service?.title, ''),
        description: getString(service?.description, ''),
        tags: getString(service?.tags, ''),
        image: getString(service?.image, ''),
      };
    })
    .filter((item) => item.title.length > 0);
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeCollections(value: unknown, fallback: PhotographyCollection[]): PhotographyCollection[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item) => {
      const collection = item as Partial<PhotographyCollection>;
      return {
        title: getString(collection?.title, ''),
        href: getString(collection?.href, ''),
        description: getString(collection?.description, ''),
      };
    })
    .filter((item) => item.title.length > 0 && item.href.length > 0);
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeProcess(value: unknown, fallback: PhotographyProcessStep[]): PhotographyProcessStep[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item) => {
      const step = item as Partial<PhotographyProcessStep>;
      return {
        step: getString(step?.step, ''),
        title: getString(step?.title, ''),
        desc: getString(step?.desc, ''),
      };
    })
    .filter((item) => item.title.length > 0);
  return normalized.length > 0 ? normalized : fallback;
}

export async function getPhotographyPageData(): Promise<PhotographyPageData> {
  await dbConnect();
  const raw = await Content.findOne({ page: 'photography' }).lean();
  const content = raw ? JSON.parse(JSON.stringify(raw)) : null;
  const sections = (content?.sections ?? {}) as Record<string, unknown>;
  const heroImagesFallback =
    typeof content?.heroImage === 'string' && content.heroImage.trim().length > 0
      ? [content.heroImage.trim(), ...photographyPageDefaults.heroImages]
      : photographyPageDefaults.heroImages;

  return {
    title: getString(content?.title, photographyPageDefaults.title),
    heroLabel: getString(sections.heroLabel, photographyPageDefaults.heroLabel),
    subtitle: getString(content?.subtitle, photographyPageDefaults.subtitle),
    heroImages: getStringArray(sections.heroImages, heroImagesFallback),
    stats: normalizeStats(sections.stats, photographyPageDefaults.stats),
    services: normalizeServices(sections.services, photographyPageDefaults.services),
    collectionsLabel: getString(sections.collectionsLabel, photographyPageDefaults.collectionsLabel),
    collectionsTitle: getString(sections.collectionsTitle, photographyPageDefaults.collectionsTitle),
    collections: normalizeCollections(sections.collections, photographyPageDefaults.collections),
    processLabel: getString(sections.processLabel, photographyPageDefaults.processLabel),
    processTitle: getString(sections.processTitle, photographyPageDefaults.processTitle),
    process: normalizeProcess(sections.process, photographyPageDefaults.process),
    ctaTitle: getString(sections.ctaTitle, photographyPageDefaults.ctaTitle),
    ctaSubtitle: getString(sections.ctaSubtitle, photographyPageDefaults.ctaSubtitle),
    ctaButton: getString(sections.ctaButton, photographyPageDefaults.ctaButton),
    ctaLink: getString(sections.ctaLink, photographyPageDefaults.ctaLink),
    ctaSecondaryButton: getString(sections.ctaSecondaryButton, photographyPageDefaults.ctaSecondaryButton),
    ctaSecondaryLink: getString(sections.ctaSecondaryLink, photographyPageDefaults.ctaSecondaryLink),
  };
}
