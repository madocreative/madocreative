import FooterClient from '@/components/FooterClient';
import { getPublicSiteSettings } from '@/lib/siteSettings';

export default async function Footer() {
  const settings = await getPublicSiteSettings();

  return (
    <FooterClient
      siteName={settings.siteName}
      email={settings.email}
      phone={settings.phone}
      address={settings.address}
      instagramUrl={settings.instagramUrl}
      youtubeUrl={settings.youtubeUrl}
      facebookUrl={settings.facebookUrl}
      telegramUrl={settings.telegramUrl}
      whatsappUrl={settings.whatsappUrl}
    />
  );
}
