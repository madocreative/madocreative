import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import SiteSettings from '@/models/SiteSettings';
import BookingClient from './BookingClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Book a Session | Mado Creatives',
    description: 'Reserve your exclusive photoshoot with our award-winning creative team.',
};

const defaultPackages = [
    { name: 'Editorial', description: 'Perfect for magazine submissions and high-fashion spreads.', price: 'From RWF 2,500,000' },
    { name: 'Campaign', description: 'Comprehensive commercial shoots for major brand releases.', price: 'From RWF 8,000,000' },
];

type BookingSections = {
    packages?: typeof defaultPackages;
    sessionTime?: string;
    submitLabel?: string;
};

type BookingSettings = {
    locationLabel?: string;
    acceptingClients?: boolean;
};

export default async function BookingPage() {
    let content = null;
    let settings: BookingSettings | null = null;
    let sections: BookingSections = {};

    try {
        await dbConnect();
        const [rawContent, rawSettings] = await Promise.all([
            Content.findOne({ page: 'booking' }),
            SiteSettings.findOne({ key: 'global' }),
        ]);

        content = rawContent ? JSON.parse(JSON.stringify(rawContent)) : null;
        settings = rawSettings ? JSON.parse(JSON.stringify(rawSettings)) : null;
        sections = (content?.sections || {}) as BookingSections;
    } catch (error) {
        console.error('Failed to load booking page data. Falling back to defaults.', error);
    }

    const pageData = {
        title: content?.title || 'Book a Session',
        subtitle: content?.subtitle || 'Reserve your exclusive photoshoot with our award-winning creative team. We curate every detail to ensure your vision is realized flawlessly.',
        packages: Array.isArray(sections.packages) ? sections.packages : defaultPackages,
        sessionTime: sections.sessionTime || 'All sessions start at 9:00 AM CET',
        submitLabel: sections.submitLabel || 'Request Booking',
        locationLabel: settings?.locationLabel || 'Paris HQ • Worldwide Travel',
        acceptingClients: settings?.acceptingClients ?? true,
    };

    return <BookingClient data={pageData} />;
}
