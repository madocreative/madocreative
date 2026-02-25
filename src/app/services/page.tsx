import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import ServicesClient from './ServicesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Services | Mado Creatives',
    description: 'Creative production, brand strategy & design, and premium electronics from Mado Creatives.',
};

const defaultServices = [
    {
        title: 'Creative Production',
        description: 'High-end visual storytelling. We offer wedding, fashion, product, and lifestyle photography alongside cinematic videography, motion graphics, and social media content creation.',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
        tags: 'Photography, Cinematography, Content',
    },
    {
        title: 'Brand Strategy & Design',
        description: 'Building strong brand identities for modern visionaries. We develop comprehensive visual identity systems, logos, and campaign direction to position your brand for global excellence.',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/i8xewrxxjabg40c1nhd8.jpg',
        tags: 'Identity, Direction, Campaigns',
    },
    {
        title: 'Premium Electronics',
        description: 'Trusted quality for creators and professionals. Our Electronics Store supplies the latest smartphones, professional cameras, business laptops, and smart gadgets across multiple countries.',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/luhwozrxtp1u5oehdyej.jpg',
        tags: 'Laptops, Cameras, Smartphones',
    },
];

const defaultStats = [
    { value: '15+', label: 'Years Experience' },
    { value: '4', label: 'Locations' },
];

export default async function ServicesPage() {
    await dbConnect();
    const raw = await Content.findOne({ page: 'services' });
    const content = raw ? JSON.parse(JSON.stringify(raw)) : null;
    const sections = content?.sections || {};

    const pageData = {
        title: content?.title || 'Our Services',
        subtitle: content?.subtitle || 'We provide comprehensive creative solutions for absolute visionaries. Our approach is bespoke, ensuring every project is an authentic reflection of your brand\'s unique narrative.',
        stats: sections.stats || defaultStats,
        services: sections.services || defaultServices,
        ctaTitle: sections.ctaTitle || 'Ready to elevate your visual identity?',
        ctaSubtitle: sections.ctaSubtitle || 'Contact us today to discuss your vision and how Mado Creatives can bring it to life.',
        ctaButton: sections.ctaButton || 'Start a Project',
    };

    return <ServicesClient data={pageData} />;
}
