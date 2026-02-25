import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import TeamClient from './TeamClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Team | Mado Creatives',
    description: 'Meet the talented collective behind Mado Creatives.',
};

const defaultMembers = [
    { name: 'Yonathan Ayele', role: 'Founder & Creative Director', image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971882/mado-creatives/nlw9iu68433ngreltzwt.jpg' },
    { name: 'Elena Vance', role: 'Head of Photography', image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971885/mado-creatives/kgwmhi695gjdyey0qauv.jpg' },
    { name: 'Marcus Thorne', role: 'Lead Videographer & Editor', image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971887/mado-creatives/enbiztasgcryipz6x8py.jpg' },
    { name: 'Sofia Chen', role: 'Branding & Design Specialist', image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971889/mado-creatives/lgrj87iype8vbp5qiuzn.jpg' },
    { name: 'Leo Rossi', role: 'Electronics & Tech Ops', image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971891/mado-creatives/kw9xzrjaw2mk62tv7z0o.jpg' },
    { name: 'Aria Vossen', role: 'Client Relations & Projects', image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971892/mado-creatives/zupngrotm2mt5yqblvta.jpg' },
];

export default async function TeamPage() {
    await dbConnect();
    const raw = await Content.findOne({ page: 'team' });
    const content = raw ? JSON.parse(JSON.stringify(raw)) : null;
    const sections = content?.sections || {};

    const pageData = {
        title: content?.title || 'The Collective Vision',
        subtitle: content?.subtitle || 'A curated group of visionaries dedicated to the art of high-fashion photography and visual storytelling. At Mado Creatives, we blend raw emotion with sophisticated aesthetics to redefine modern elegance.',
        teamMembers: sections.teamMembers || defaultMembers,
        ctaTitle: sections.ctaTitle || 'Have a project in mind?',
        ctaSubtitle: sections.ctaSubtitle || "Let's create something extraordinary together.",
        ctaButton: sections.ctaButton || 'Get in Touch',
    };

    return <TeamClient data={pageData} />;
}
