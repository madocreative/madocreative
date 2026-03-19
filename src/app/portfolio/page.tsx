import dbConnect from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import MediaItem from '@/models/MediaItem';
import Content from '@/models/Content';
import PortfolioClient from '@/components/PortfolioClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Portfolio | Mado Creatives',
    description: 'View our curated galleries of luxury photography.',
};

export default async function Portfolio() {
    let galleries: unknown[] = [];
    let mediaItems: unknown[] = [];
    let teamContent = null;
    let portfolioSections: Record<string, unknown> = {};

    try {
        await dbConnect();

        const [rawGalleries, rawMediaItems, rawTeamContent, portfolioContent] = await Promise.all([
            Gallery.find({}).sort({ createdAt: -1 }),
            MediaItem.find({}).sort({ createdAt: -1 }),
            Content.findOne({ page: 'team' }),
            Content.findOne({ page: 'portfolio' }),
        ]);

        galleries = JSON.parse(JSON.stringify(rawGalleries));
        mediaItems = JSON.parse(JSON.stringify(rawMediaItems));
        teamContent = rawTeamContent ? JSON.parse(JSON.stringify(rawTeamContent)) : null;
        portfolioSections = portfolioContent ? JSON.parse(JSON.stringify(portfolioContent)).sections || {} : {};
    } catch (error) {
        console.error('Failed to load portfolio page data. Falling back to defaults.', error);
    }

    // Collect team member image URLs to exclude from "all images" view
    const teamImageUrls = new Set<string>();
    if ((teamContent as { sections?: { teamMembers?: Array<{ image?: string }> } } | null)?.sections?.teamMembers) {
        for (const member of (teamContent as { sections: { teamMembers: Array<{ image?: string }> } }).sections.teamMembers) {
            if (member.image) teamImageUrls.add(member.image);
        }
    }

    // All gallery image URLs (already shown in gallery sections)
    const galleryImageUrls = new Set<string>(
        (galleries as Array<{ featuredImage?: string; images?: string[] }>).flatMap((g) => [g.featuredImage, ...(g.images || [])].filter(Boolean) as string[])
    );

    // All Cloudinary images NOT in team section AND NOT already in a gallery
    const allMediaUrls = (mediaItems as Array<{ url: string }>)
        .map((m) => m.url)
        .filter((url: string) => !teamImageUrls.has(url) && !galleryImageUrls.has(url));

    return (
        <PortfolioClient
            galleries={galleries as []}
            allMediaUrls={allMediaUrls}
            heroTitle={typeof portfolioSections.heroTitle === 'string' && portfolioSections.heroTitle ? portfolioSections.heroTitle : 'Portfolio'}
            heroLabel={typeof portfolioSections.heroLabel === 'string' && portfolioSections.heroLabel ? portfolioSections.heroLabel : 'Selected Archives'}
        />
    );
}
