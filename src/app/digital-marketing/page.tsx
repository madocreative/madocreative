import { Metadata } from 'next';
import DigitalMarketingClient from './DigitalMarketingClient';

export const metadata: Metadata = {
    title: 'Digital Marketing | Mado Creatives',
    description: 'Social media management, paid advertising, brand strategy, and content creation by Mado Creatives.',
};

export default function DigitalMarketingPage() {
    return <DigitalMarketingClient />;
}
