import { getCreativeServicePageData } from '@/lib/creativeServicePage';
import { videographyPageDefaults } from '@/lib/videographyPageDefaults';

export async function getVideographyPageData() {
  return getCreativeServicePageData('videography', videographyPageDefaults);
}
