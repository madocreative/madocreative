import { Metadata } from 'next';
import PhotographyClient from './PhotographyClient';
import { getPhotographyPageData } from '@/lib/photographyPageContent';

export const metadata: Metadata = {
  title: 'Photography | Mado Creatives',
  description:
    'Luxury photography for weddings, portraits, campaigns, events, and brands by Mado Creatives.',
};

export const dynamic = 'force-dynamic';

export default async function PhotographyPage() {
  const data = await getPhotographyPageData();
  return <PhotographyClient data={data} />;
}
