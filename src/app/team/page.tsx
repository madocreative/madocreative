import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { defaultTeamMembers, teamPageDefaults } from '@/lib/teamPageDefaults';
import TeamClient from './TeamClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Team | Mado Creatives',
    description: 'Meet the talented collective behind Mado Creatives.',
};

type TeamSections = {
    teamMembers?: typeof defaultTeamMembers;
    ctaTitle?: string;
    ctaSubtitle?: string;
    ctaButton?: string;
    philosophyQuote?: string;
    philosophyAttribution?: string;
};

export default async function TeamPage() {
    let content = null;
    let sections: TeamSections = {};

    try {
        await dbConnect();
        const raw = await Content.findOne({ page: 'team' });
        content = raw ? JSON.parse(JSON.stringify(raw)) : null;
        sections = (content?.sections || {}) as TeamSections;
    } catch (error) {
        console.error('Failed to load team page data. Falling back to defaults.', error);
    }

    const pageData = {
        title: content?.title || teamPageDefaults.title,
        subtitle: content?.subtitle || teamPageDefaults.subtitle,
        teamMembers: Array.isArray(sections.teamMembers)
            ? sections.teamMembers
            : teamPageDefaults.teamMembers,
        ctaTitle: sections.ctaTitle || teamPageDefaults.ctaTitle,
        ctaSubtitle: sections.ctaSubtitle || teamPageDefaults.ctaSubtitle,
        ctaButton: sections.ctaButton || teamPageDefaults.ctaButton,
        philosophyQuote: sections.philosophyQuote || teamPageDefaults.philosophyQuote,
        philosophyAttribution: sections.philosophyAttribution || teamPageDefaults.philosophyAttribution,
    };

    return <TeamClient data={pageData} />;
}
