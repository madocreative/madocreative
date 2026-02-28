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

  // Fetch home content, team content, and galleries together.
  const [content, teamContent, galleries] = await Promise.all([
    Content.findOne({ page: 'home' }),
    Content.findOne({ page: 'team' }),
    Gallery.find({}).sort({ createdAt: -1 }).limit(20),
  ]);

  // Team page fallback images used in Team page defaults.
  const defaultTeamImages = [
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971882/mado-creatives/nlw9iu68433ngreltzwt.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971885/mado-creatives/kgwmhi695gjdyey0qauv.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971887/mado-creatives/enbiztasgcryipz6x8py.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971889/mado-creatives/lgrj87iype8vbp5qiuzn.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971891/mado-creatives/kw9xzrjaw2mk62tv7z0o.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971892/mado-creatives/zupngrotm2mt5yqblvta.jpg',
  ];

  const teamSections = (teamContent?.sections || {}) as { teamMembers?: Array<{ image?: string }> };
  const cmsTeamImages = Array.isArray(teamSections.teamMembers)
    ? teamSections.teamMembers
        .map((member) => (typeof member?.image === 'string' ? member.image.trim() : ''))
        .filter(Boolean)
    : [];
  const excludedImages = Array.from(new Set([...cmsTeamImages, ...defaultTeamImages]));

  // Pass non-Mongoose objects to the client
  return (
    <HomeClient
      content={JSON.parse(JSON.stringify(content))}
      galleries={JSON.parse(JSON.stringify(galleries))}
      excludedImages={excludedImages}
    />
  );
}
