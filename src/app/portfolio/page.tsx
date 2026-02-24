import dbConnect from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import PortfolioClient from '@/components/PortfolioClient';

export const metadata = {
    title: 'Portfolio | Mado Creatives',
    description: 'View our curated galleries of luxury photography.',
};

export default async function Portfolio() {
    await dbConnect();
    const galleries = await Gallery.find({}).sort({ createdAt: -1 });

    return <PortfolioClient galleries={JSON.parse(JSON.stringify(galleries))} />;
}
