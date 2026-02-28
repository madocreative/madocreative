import SiteSettings from '@/models/SiteSettings';
import dbConnect from '@/lib/mongodb';
import FooterClient from '@/components/FooterClient';

async function getSettings() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne({ key: 'global' });
    return settings ? JSON.parse(JSON.stringify(settings)) : null;
  } catch {
    return null;
  }
}

export default async function Footer() {
  const settings = await getSettings();

  return (
    <FooterClient
      siteName={settings?.siteName || 'Mado Creatives'}
      email={settings?.email || 'hello@madocreatives.com'}
      phone={settings?.phone || '+251 911 000 000'}
      address={settings?.address || 'KG 3 AVE Kacyiru, Kigali'}
      instagramUrl={settings?.instagramUrl || 'https://www.instagram.com/madocreatives'}
      youtubeUrl={settings?.youtubeUrl || 'https://youtube.com/@mado_creatives'}
      facebookUrl={settings?.facebookUrl || 'https://www.facebook.com/madocreatives'}
      telegramUrl={settings?.telegramUrl || 'https://t.me/mado_creatives'}
      whatsappUrl={settings?.whatsappUrl || 'https://whatsapp.com/channel/0029VbCPDBL1NCrUoC6L771C'}
    />
  );
}
