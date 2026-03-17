import { getCreativeServicePageData } from '@/lib/creativeServicePage';
import { digitalMarketingPageDefaults } from '@/lib/digitalMarketingPageDefaults';

export async function getDigitalMarketingPageData() {
  return getCreativeServicePageData('digital-marketing', digitalMarketingPageDefaults);
}
