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
    await dbConnect();

    const [galleries, mediaItems, teamContent] = await Promise.all([
        Gallery.find({}).sort({ createdAt: -1 }),
        MediaItem.find({}).sort({ createdAt: -1 }),
        Content.findOne({ page: 'team' }),
    ]);

    // Collect team member image URLs to exclude from "all images" view
    const teamImageUrls = new Set<string>();
    if (teamContent?.sections?.teamMembers) {
        for (const member of teamContent.sections.teamMembers) {
            if (member.image) teamImageUrls.add(member.image);
        }
    }

    // All gallery image URLs (already shown in gallery sections)
    const galleryImageUrls = new Set<string>(
        galleries.flatMap((g: any) => [g.featuredImage, ...(g.images || [])].filter(Boolean))
    );

    // All Cloudinary images NOT in team section AND NOT already in a gallery
    const allMediaUrls = mediaItems
        .map((m: any) => m.url)
        .filter((url: string) => !teamImageUrls.has(url) && !galleryImageUrls.has(url));

    return (
        <PortfolioClient
            galleries={JSON.parse(JSON.stringify(galleries))}
            allMediaUrls={allMediaUrls}
        />
    );
}
