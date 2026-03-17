import { Metadata } from 'next';
import VideographyClient from './VideographyClient';
import { getVideographyPageData } from '@/lib/videographyPageContent';

export const metadata: Metadata = {
    title: 'Videography | Mado Creatives',
    description: 'Cinematic storytelling, commercial films, wedding productions, and advanced color grading by Mado Creatives.',
};

export const dynamic = 'force-dynamic';

export default async function VideographyPage() {
    const data = await getVideographyPageData();
    return <VideographyClient data={data} />;
}
