import dbConnect from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import Content from '@/models/Content';
import PortfolioClient from '@/components/PortfolioClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Portfolio | Mado Creatives',
    description: 'View our curated galleries of luxury photography.',
};

export default async function Portfolio() {
    let galleries: unknown[] = [];
    let portfolioSections: Record<string, unknown> = {};

    try {
        await dbConnect();

        const [rawGalleries, portfolioContent] = await Promise.all([
            Gallery.find({}).sort({ createdAt: -1 }),
            Content.findOne({ page: 'portfolio' }),
        ]);

        galleries = JSON.parse(JSON.stringify(rawGalleries));
        portfolioSections = portfolioContent ? JSON.parse(JSON.stringify(portfolioContent)).sections || {} : {};
    } catch (error) {
        console.error('Failed to load portfolio page data. Falling back to defaults.', error);
    }

    return (
        <PortfolioClient
            galleries={galleries as []}
            heroTitle={typeof portfolioSections.heroTitle === 'string' && portfolioSections.heroTitle ? portfolioSections.heroTitle : 'Portfolio'}
            heroLabel={typeof portfolioSections.heroLabel === 'string' && portfolioSections.heroLabel ? portfolioSections.heroLabel : 'Selected Archives'}
        />
    );
}
