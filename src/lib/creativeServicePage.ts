import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

export type CreativeServiceServiceItem = {
  title: string;
  description: string;
  tags: string;
  image: string;
};

export type CreativeServiceStat = {
  value: string;
  label: string;
};

export type CreativeServiceCollection = {
  title: string;
  href: string;
  description: string;
};

export type CreativeServiceProcessStep = {
  step: string;
  title: string;
  desc: string;
};

export type CreativeServiceVideoItem = {
  title: string;
  description: string;
  videoUrl: string;
  posterImage: string;
};

export type CreativeServiceVideoGalleryLayout = 'grid' | 'masonry' | 'strip';

export type CreativeServicePageData = {
  title: string;
  heroLabel: string;
  subtitle: string;
  heroImages: string[];
  stats: CreativeServiceStat[];
  services: CreativeServiceServiceItem[];
  showcaseLabel?: string;
  showcaseTitle?: string;
  showcaseSubtitle?: string;
  showcaseVideos?: CreativeServiceVideoItem[];
  videoGalleryLabel?: string;
  videoGalleryTitle?: string;
  videoGallerySubtitle?: string;
  videoGalleryLayout?: CreativeServiceVideoGalleryLayout;
  videoGalleryVideos?: CreativeServiceVideoItem[];
  collectionsLabel: string;
  collectionsTitle: string;
  collections: CreativeServiceCollection[];
  processLabel: string;
  processTitle: string;
  process: CreativeServiceProcessStep[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  ctaLink: string;
  ctaSecondaryButton: string;
  ctaSecondaryLink: string;
};

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

function normalizeStats(value: unknown, fallback: CreativeServiceStat[]): CreativeServiceStat[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item) => {
      const stat = item as Partial<CreativeServiceStat>;
      return {
        value: getString(stat?.value, ''),
        label: getString(stat?.label, ''),
      };
    })
    .filter((item) => item.value.length > 0 || item.label.length > 0);
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeServices(value: unknown, fallback: CreativeServiceServiceItem[]): CreativeServiceServiceItem[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item) => {
      const service = item as Partial<CreativeServiceServiceItem>;
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

function normalizeVideos(value: unknown, fallback: CreativeServiceVideoItem[]): CreativeServiceVideoItem[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item) => {
      const video = item as Partial<CreativeServiceVideoItem>;
      return {
        title: getString(video?.title, ''),
        description: getString(video?.description, ''),
        videoUrl: getString(video?.videoUrl, ''),
        posterImage: getString(video?.posterImage, ''),
      };
    })
    .filter((item) => item.videoUrl.length > 0 || item.title.length > 0);
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeVideoGalleryLayout(
  value: unknown,
  fallback: CreativeServiceVideoGalleryLayout,
): CreativeServiceVideoGalleryLayout {
  return value === 'grid' || value === 'masonry' || value === 'strip' ? value : fallback;
}

function normalizeCollections(value: unknown, fallback: CreativeServiceCollection[]): CreativeServiceCollection[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item) => {
      const collection = item as Partial<CreativeServiceCollection>;
      return {
        title: getString(collection?.title, ''),
        href: getString(collection?.href, ''),
        description: getString(collection?.description, ''),
      };
    })
    .filter((item) => item.title.length > 0 && item.href.length > 0);
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeProcess(value: unknown, fallback: CreativeServiceProcessStep[]): CreativeServiceProcessStep[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item) => {
      const step = item as Partial<CreativeServiceProcessStep>;
      return {
        step: getString(step?.step, ''),
        title: getString(step?.title, ''),
        desc: getString(step?.desc, ''),
      };
    })
    .filter((item) => item.title.length > 0);
  return normalized.length > 0 ? normalized : fallback;
}

export async function getCreativeServicePageData(
  page: string,
  defaults: CreativeServicePageData,
): Promise<CreativeServicePageData> {
  try {
    await dbConnect();
    const raw = await Content.findOne({ page }).lean();
    const content = raw ? JSON.parse(JSON.stringify(raw)) : null;
    const sections = (content?.sections ?? {}) as Record<string, unknown>;
    const heroImagesFallback =
      typeof content?.heroImage === 'string' && content.heroImage.trim().length > 0
        ? [content.heroImage.trim(), ...defaults.heroImages]
        : defaults.heroImages;

    return {
      title: getString(content?.title, defaults.title),
      heroLabel: getString(sections.heroLabel, defaults.heroLabel),
      subtitle: getString(content?.subtitle, defaults.subtitle),
      heroImages: getStringArray(sections.heroImages, heroImagesFallback),
      stats: normalizeStats(sections.stats, defaults.stats),
      services: normalizeServices(sections.services, defaults.services),
      showcaseLabel: getString(sections.showcaseLabel, defaults.showcaseLabel ?? ''),
      showcaseTitle: getString(sections.showcaseTitle, defaults.showcaseTitle ?? ''),
      showcaseSubtitle: getString(sections.showcaseSubtitle, defaults.showcaseSubtitle ?? ''),
      showcaseVideos: normalizeVideos(sections.showcaseVideos, defaults.showcaseVideos ?? []),
      videoGalleryLabel: getString(sections.videoGalleryLabel, defaults.videoGalleryLabel ?? ''),
      videoGalleryTitle: getString(sections.videoGalleryTitle, defaults.videoGalleryTitle ?? ''),
      videoGallerySubtitle: getString(sections.videoGallerySubtitle, defaults.videoGallerySubtitle ?? ''),
      videoGalleryLayout: normalizeVideoGalleryLayout(sections.videoGalleryLayout, defaults.videoGalleryLayout ?? 'masonry'),
      videoGalleryVideos: normalizeVideos(sections.videoGalleryVideos, defaults.videoGalleryVideos ?? []),
      collectionsLabel: getString(sections.collectionsLabel, defaults.collectionsLabel),
      collectionsTitle: getString(sections.collectionsTitle, defaults.collectionsTitle),
      collections: normalizeCollections(sections.collections, defaults.collections),
      processLabel: getString(sections.processLabel, defaults.processLabel),
      processTitle: getString(sections.processTitle, defaults.processTitle),
      process: normalizeProcess(sections.process, defaults.process),
      ctaTitle: getString(sections.ctaTitle, defaults.ctaTitle),
      ctaSubtitle: getString(sections.ctaSubtitle, defaults.ctaSubtitle),
      ctaButton: getString(sections.ctaButton, defaults.ctaButton),
      ctaLink: getString(sections.ctaLink, defaults.ctaLink),
      ctaSecondaryButton: getString(sections.ctaSecondaryButton, defaults.ctaSecondaryButton),
      ctaSecondaryLink: getString(sections.ctaSecondaryLink, defaults.ctaSecondaryLink),
    };
  } catch (error) {
    console.error(`Failed to load ${page} service page data. Falling back to defaults.`, error);
    return defaults;
  }
}
