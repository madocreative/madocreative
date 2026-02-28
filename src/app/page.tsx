import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import Gallery from '@/models/Gallery';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mado Creatives | Luxury Visual Studio',
  description: 'Independent studio crafting premium imagery for visionaries.',
};

export default async function Home() {
  await dbConnect();

  // Fetch dynamic page content from CMS
  const content = await Content.findOne({ page: 'home' });

  // Fetch latest galleries for hero collage and portfolio previews
  const galleries = await Gallery.find({}).sort({ createdAt: -1 }).limit(20);

  // Pass non-Mongoose objects to the client
  return <HomeClient content={JSON.parse(JSON.stringify(content))} galleries={JSON.parse(JSON.stringify(galleries))} />;
}
