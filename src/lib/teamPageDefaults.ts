export type TeamMember = {
    name: string;
    role: string;
    image: string;
};

export type TeamPageDefaults = {
    title: string;
    subtitle: string;
    teamMembers: TeamMember[];
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    philosophyQuote: string;
    philosophyAttribution: string;
};

export const defaultTeamMembers: TeamMember[] = [
    {
        name: 'Yonathan Ayele',
        role: 'Founder & Creative Director',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971882/mado-creatives/nlw9iu68433ngreltzwt.jpg',
    },
    {
        name: 'Elena Vance',
        role: 'Head of Photography',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971885/mado-creatives/kgwmhi695gjdyey0qauv.jpg',
    },
    {
        name: 'Marcus Thorne',
        role: 'Lead Videographer & Editor',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971887/mado-creatives/enbiztasgcryipz6x8py.jpg',
    },
    {
        name: 'Sofia Chen',
        role: 'Branding & Design Specialist',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971889/mado-creatives/lgrj87iype8vbp5qiuzn.jpg',
    },
    {
        name: 'Leo Rossi',
        role: 'Electronics & Tech Ops',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971891/mado-creatives/kw9xzrjaw2mk62tv7z0o.jpg',
    },
    {
        name: 'Aria Vossen',
        role: 'Client Relations & Projects',
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971892/mado-creatives/zupngrotm2mt5yqblvta.jpg',
    },
];

export const teamPageDefaults: TeamPageDefaults = {
    title: 'The Collective Vision',
    subtitle: 'A curated group of visionaries dedicated to the art of high-fashion photography and visual storytelling. At Mado Creatives, we blend raw emotion with sophisticated aesthetics to redefine modern elegance.',
    teamMembers: defaultTeamMembers,
    ctaTitle: 'Have a project in mind?',
    ctaSubtitle: "Let's create something extraordinary together.",
    ctaButton: 'Get in Touch',
    philosophyQuote: "We don't just take photographs — we craft visual narratives that outlive the moment.",
    philosophyAttribution: '— Mado Creatives Studio Philosophy',
};

export const defaultTeamImages = defaultTeamMembers.map((member) => member.image);
