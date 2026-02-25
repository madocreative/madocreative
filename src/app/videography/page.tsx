import { Metadata } from 'next';
import VideographyClient from './VideographyClient';

export const metadata: Metadata = {
    title: 'Videography | Mado Creatives',
    description: 'Cinematic storytelling, commercial films, wedding productions, and advanced color grading by Mado Creatives.',
};

export default function VideographyPage() {
    return <VideographyClient />;
}
