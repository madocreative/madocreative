import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import Gallery from '@/models/Gallery';
import HomeClient from '@/components/HomeClient';
import { defaultTeamImages } from '@/lib/teamPageDefaults';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mado Creatives | Luxury Visual Studio',
  description: 'Independent studio crafting premium imagery for visionaries.',
};

export default async function Home() {
  let content = null;
  let teamContent = null;
  let galleries: unknown[] = [];

  try {
    await dbConnect();

    [content, teamContent, galleries] = await Promise.all([
      Content.findOne({ page: 'home' }),
      Content.findOne({ page: 'team' }),
      Gallery.find({}).sort({ createdAt: -1 }).limit(20),
    ]);
  } catch (error) {
    console.error('Failed to load home page data. Falling back to defaults.', error);
  }

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
