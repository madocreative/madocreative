import { unstable_noStore } from 'next/cache';
import SiteSettings from '@/models/SiteSettings';
import dbConnect from '@/lib/mongodb';
import { buildWhatsAppChatUrl, DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export type PublicSiteSettings = {
  siteName: string;
  logoUrl: string;
  logoVersion: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  instagramUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  telegramUrl: string;
  whatsappUrl: string;
  whatsappNumber: string;
  whatsappChatUrl: string;
  acceptingClients: boolean;
};

export const defaultPublicSiteSettings: PublicSiteSettings = {
  siteName: 'Mado Creatives',
  logoUrl: '/logo.png',
  logoVersion: '',
  tagline: 'Premium photography & cinematic storytelling for brands and moments that deserve to be remembered.',
  email: 'hello@madocreatives.com',
  phone: '+251 911 000 000',
  address: 'KG 3 AVE Kacyiru, Kigali',
  instagramUrl: 'https://www.instagram.com/madocreatives',
  youtubeUrl: 'https://youtube.com/@mado_creatives',
  facebookUrl: 'https://www.facebook.com/madocreatives',
  telegramUrl: 'https://t.me/mado_creatives',
  whatsappUrl: 'https://whatsapp.com/channel/0029VbCPDBL1NCrUoC6L771C',
  whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  whatsappChatUrl: buildWhatsAppChatUrl(DEFAULT_WHATSAPP_NUMBER, undefined, 'https://whatsapp.com/channel/0029VbCPDBL1NCrUoC6L771C'),
  acceptingClients: true,
};

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  try {
    unstable_noStore();
    await dbConnect();
    const settings = await SiteSettings.findOne({ key: 'global' });
    if (!settings) return defaultPublicSiteSettings;

    const parsed = JSON.parse(JSON.stringify(settings));

    return {
      siteName: parsed.siteName || defaultPublicSiteSettings.siteName,
      logoUrl: parsed.logoUrl || defaultPublicSiteSettings.logoUrl,
      logoVersion: parsed.updatedAt ? new Date(parsed.updatedAt).getTime().toString() : defaultPublicSiteSettings.logoVersion,
      tagline: parsed.tagline || defaultPublicSiteSettings.tagline,
      email: parsed.email || defaultPublicSiteSettings.email,
      phone: parsed.phone || defaultPublicSiteSettings.phone,
      address: parsed.address || defaultPublicSiteSettings.address,
      instagramUrl: parsed.instagramUrl || defaultPublicSiteSettings.instagramUrl,
      youtubeUrl: parsed.youtubeUrl || defaultPublicSiteSettings.youtubeUrl,
      facebookUrl: parsed.facebookUrl || defaultPublicSiteSettings.facebookUrl,
      telegramUrl: parsed.telegramUrl || defaultPublicSiteSettings.telegramUrl,
      whatsappUrl: parsed.whatsappUrl || defaultPublicSiteSettings.whatsappUrl,
      whatsappNumber: parsed.whatsappNumber || defaultPublicSiteSettings.whatsappNumber,
      whatsappChatUrl: buildWhatsAppChatUrl(
        parsed.whatsappNumber || defaultPublicSiteSettings.whatsappNumber,
        undefined,
        parsed.whatsappUrl || defaultPublicSiteSettings.whatsappUrl,
      ),
      acceptingClients: typeof parsed.acceptingClients === 'boolean' ? parsed.acceptingClients : true,
    };
  } catch {
    return defaultPublicSiteSettings;
  }
}
