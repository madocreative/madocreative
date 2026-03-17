import { Metadata } from 'next';
import DigitalMarketingClient from './DigitalMarketingClient';
import { getDigitalMarketingPageData } from '@/lib/digitalMarketingPageContent';

export const metadata: Metadata = {
    title: 'Digital Marketing | Mado Creatives',
    description: 'Social media management, paid advertising, brand strategy, and content creation by Mado Creatives.',
};

export const dynamic = 'force-dynamic';

export default async function DigitalMarketingPage() {
    const data = await getDigitalMarketingPageData();
    return <DigitalMarketingClient data={data} />;
}
