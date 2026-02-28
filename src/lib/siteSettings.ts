import SiteSettings from '@/models/SiteSettings';
import dbConnect from '@/lib/mongodb';

export type PublicSiteSettings = {
  siteName: string;
  email: string;
  phone: string;
  address: string;
  instagramUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  telegramUrl: string;
  whatsappUrl: string;
};

export const defaultPublicSiteSettings: PublicSiteSettings = {
  siteName: 'Mado Creatives',
  email: 'hello@madocreatives.com',
  phone: '+251 911 000 000',
  address: 'KG 3 AVE Kacyiru, Kigali',
  instagramUrl: 'https://www.instagram.com/madocreatives',
  youtubeUrl: 'https://youtube.com/@mado_creatives',
  facebookUrl: 'https://www.facebook.com/madocreatives',
  telegramUrl: 'https://t.me/mado_creatives',
  whatsappUrl: 'https://whatsapp.com/channel/0029VbCPDBL1NCrUoC6L771C',
};

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne({ key: 'global' });
    if (!settings) return defaultPublicSiteSettings;

    const parsed = JSON.parse(JSON.stringify(settings));

    return {
      siteName: parsed.siteName || defaultPublicSiteSettings.siteName,
      email: parsed.email || defaultPublicSiteSettings.email,
      phone: parsed.phone || defaultPublicSiteSettings.phone,
      address: parsed.address || defaultPublicSiteSettings.address,
      instagramUrl: parsed.instagramUrl || defaultPublicSiteSettings.instagramUrl,
      youtubeUrl: parsed.youtubeUrl || defaultPublicSiteSettings.youtubeUrl,
      facebookUrl: parsed.facebookUrl || defaultPublicSiteSettings.facebookUrl,
      telegramUrl: parsed.telegramUrl || defaultPublicSiteSettings.telegramUrl,
      whatsappUrl: parsed.whatsappUrl || defaultPublicSiteSettings.whatsappUrl,
    };
  } catch {
    return defaultPublicSiteSettings;
  }
}
