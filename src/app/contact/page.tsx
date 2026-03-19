import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import SiteSettings from '@/models/SiteSettings';
import ContactClient from './ContactClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Contact | Mado Creatives',
    description: "Get in touch with Mado Creatives. Let's build something extraordinary.",
};

type ContactSections = {
    inquiryTypes?: string[];
    responseTime?: string;
};

type ContactSettings = {
    email?: string;
    phone?: string;
    address?: string;
};

export default async function ContactPage() {
    let content = null;
    let settings: ContactSettings | null = null;
    let sections: ContactSections = {};

    try {
        await dbConnect();
        const [rawContent, rawSettings] = await Promise.all([
            Content.findOne({ page: 'contact' }),
            SiteSettings.findOne({ key: 'global' }),
        ]);

        content = rawContent ? JSON.parse(JSON.stringify(rawContent)) : null;
        settings = rawSettings ? JSON.parse(JSON.stringify(rawSettings)) : null;
        sections = (content?.sections || {}) as ContactSections;
    } catch (error) {
        console.error('Failed to load contact page data. Falling back to defaults.', error);
    }

    const pageData = {
        title: content?.title || "Let's Connect",
        subtitle: content?.subtitle || "Whether you're looking to launch a new campaign or redefine your brand's visual identity, we're here to bring your vision to life.",
        inquiryTypes: Array.isArray(sections.inquiryTypes) ? sections.inquiryTypes : ['General Inquiry', 'New Project', 'Press & Media', 'Careers'],
        email: settings?.email || 'hello@madocreatives.com',
        phone: settings?.phone || '+33 (0) 1 23 45 67 89',
        address: settings?.address || '12 Rue de l\'Avenir, Paris',
        responseTime: sections.responseTime || 'We respond within 24 hours',
    };

    return <ContactClient data={pageData} />;
}
