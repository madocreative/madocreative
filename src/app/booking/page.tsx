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
    { name: 'Editorial', description: 'Perfect for magazine submissions and high-fashion spreads.', price: 'From $2,500' },
    { name: 'Campaign', description: 'Comprehensive commercial shoots for major brand releases.', price: 'From $8,000' },
];

export default async function BookingPage() {
    await dbConnect();
    const [rawContent, rawSettings] = await Promise.all([
        Content.findOne({ page: 'booking' }),
        SiteSettings.findOne({ key: 'global' }),
    ]);

    const content = rawContent ? JSON.parse(JSON.stringify(rawContent)) : null;
    const settings = rawSettings ? JSON.parse(JSON.stringify(rawSettings)) : null;
    const sections = content?.sections || {};

    const pageData = {
        title: content?.title || 'Book a Session',
        subtitle: content?.subtitle || 'Reserve your exclusive photoshoot with our award-winning creative team. We curate every detail to ensure your vision is realized flawlessly.',
        packages: sections.packages || defaultPackages,
        sessionTime: sections.sessionTime || 'All sessions start at 9:00 AM CET',
        submitLabel: sections.submitLabel || 'Request Booking',
        locationLabel: settings?.locationLabel || 'Paris HQ • Worldwide Travel',
        acceptingClients: settings?.acceptingClients ?? true,
    };

    return <BookingClient data={pageData} />;
}
