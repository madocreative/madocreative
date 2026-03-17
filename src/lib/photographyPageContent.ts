import { getCreativeServicePageData } from '@/lib/creativeServicePage';
import { photographyPageDefaults, type PhotographyPageData } from '@/lib/photographyPageDefaults';

export async function getPhotographyPageData(): Promise<PhotographyPageData> {
  return getCreativeServicePageData('photography', photographyPageDefaults);
}
