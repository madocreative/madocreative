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
        title: 'Weddings',
        description: 'Your strongest emotional work. This should be your main attraction.',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
        tags: 'Ceremony, Love Story, Editorial',
    },
    {
        title: 'Portraits',
        description: 'Studio portraits, creative lighting, and personal branding.',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/i8xewrxxjabg40c1nhd8.jpg',
        tags: 'Studio, Lighting, Personal Brand',
    },
    {
        title: 'Commercial',
        description: 'Product photography, brand campaigns, and advertising.',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/luhwozrxtp1u5oehdyej.jpg',
        tags: 'Products, Campaigns, Advertising',
    },
    {
        title: 'Events',
        description: 'Corporate events, conferences, and private celebrations.',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
        tags: 'Corporate, Conferences, Private Events',
    },
];

const defaultStats = [
    { value: '15+', label: 'Years Experience' },
    { value: '4', label: 'Locations' },
];

const defaultPackages = [
    {
        name: 'iPhone Monthly Shoot Package',
        description: 'One shoot every week with ideas, content strategy, professional editing, and consistent delivery for impact.',
        price: 'USD 500 / month',
    },
    {
        name: 'Camera Monthly Shoot Package',
        description: 'One shoot every week with creative planning, professional post-production, and high-end camera equipment included.',
        price: 'USD 800 / month',
    },
    {
        name: 'Complete Production & Digital Marketing Package',
        description: 'Full production plus full digital marketing for businesses that want content creation and online growth handled together.',
        price: 'USD 1500 / month',
    },
];

type ServicesSections = {
    stats?: typeof defaultStats;
    services?: typeof defaultServices;
    packages?: typeof defaultPackages;
    ctaTitle?: string;
    ctaSubtitle?: string;
    ctaButton?: string;
    ctaLink?: string;
    ctaSecondaryButton?: string;
    ctaSecondaryLink?: string;
};

export default async function ServicesPage() {
    let content = null;
    let sections: ServicesSections = {};

    try {
        await dbConnect();
        const raw = await Content.findOne({ page: 'services' });
        content = raw ? JSON.parse(JSON.stringify(raw)) : null;
        sections = (content?.sections || {}) as ServicesSections;
    } catch (error) {
        console.error('Failed to load services page data. Falling back to defaults.', error);
    }

    const pageData = {
        title: content?.title || 'Our Services',
        subtitle: content?.subtitle || 'We provide comprehensive creative solutions for absolute visionaries. Our approach is bespoke, ensuring every project is an authentic reflection of your brand\'s unique narrative.',
        stats: Array.isArray(sections.stats) ? sections.stats : defaultStats,
        services: Array.isArray(sections.services) ? sections.services : defaultServices,
        packages: Array.isArray(sections.packages) ? sections.packages : defaultPackages,
        ctaTitle: sections.ctaTitle || 'Ready to elevate your visual identity?',
        ctaSubtitle: sections.ctaSubtitle || 'Contact us today to discuss your vision and how Mado Creatives can bring it to life.',
        ctaButton: sections.ctaButton || 'Start a Project',
        ctaLink: sections.ctaLink || '/contact',
        ctaSecondaryButton: sections.ctaSecondaryButton || 'View Portfolio',
        ctaSecondaryLink: sections.ctaSecondaryLink || '/portfolio',
    };

    return <ServicesClient data={pageData} />;
}
