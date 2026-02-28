import HeaderClient from '@/components/HeaderClient';
import { getPublicSiteSettings } from '@/lib/siteSettings';

export default async function Header() {
  const settings = await getPublicSiteSettings();

  return (
    <HeaderClient
      contactInfo={{
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
      }}
    />
  );
}
