'use client';

import Link from 'next/link';

type FooterClientProps = {
  siteName: string;
  logoUrl: string;
  logoVersion?: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  youtubeUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  telegramUrl: string;
  whatsappUrl: string;
  acceptingClients: boolean;
};

function buildLogoSrc(logoUrl: string, logoVersion?: string) {
  if (!logoUrl) return '/logo.png';
  if (!logoVersion) return logoUrl;
  return `${logoUrl}${logoUrl.includes('?') ? '&' : '?'}v=${encodeURIComponent(logoVersion)}`;
}

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
];

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  );
}

export default function FooterClient({
  siteName,
  logoUrl,
  logoVersion,
  tagline,
  email,
  phone,
  address,
  youtubeUrl,
  instagramUrl,
  facebookUrl,
  telegramUrl,
  whatsappUrl,
  acceptingClients,
}: FooterClientProps) {
  const resolvedLogoUrl = buildLogoSrc(logoUrl, logoVersion);

  const socialLinks = [
    { label: 'YouTube', href: youtubeUrl, Icon: YouTubeIcon },
    { label: 'Instagram', href: instagramUrl, Icon: InstagramIcon },
    { label: 'Facebook', href: facebookUrl, Icon: FacebookIcon },
    { label: 'Telegram', href: telegramUrl, Icon: TelegramIcon },
    { label: 'WhatsApp', href: whatsappUrl, Icon: WhatsAppIcon },
    ...(email ? [{ label: 'Email', href: `mailto:${email}`, Icon: EmailIcon }] : []),
  ].filter((item) => typeof item.href === 'string' && item.href.trim().length > 0);

  return (
    <footer className="border-t border-[color:var(--app-border)] bg-[var(--section-bg)] text-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10 md:py-12">
        <div className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="max-w-xl">
              <Link href="/" className="inline-block">
                <img src={resolvedLogoUrl} alt={siteName} className="h-12 w-auto object-contain" />
              </Link>
              <p className="mt-3 text-sm text-white/65 leading-relaxed">{tagline}</p>
              <p className="mt-4 text-sm text-white/80">{address}</p>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                <a href={`mailto:${email}`} className="text-white/75 hover:text-[var(--gold)] transition-colors">
                  {email}
                </a>
                <a href={`tel:${phone}`} className="text-white/75 hover:text-[var(--gold)] transition-colors">
                  {phone}
                </a>
              </div>
            </div>

            <nav className="flex flex-wrap gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="h-9 px-4 rounded-full border border-[color:var(--app-border)] bg-[var(--app-card)] text-sm text-white/85 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors inline-flex items-center"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="pt-5 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center text-white/60 hover:bg-[var(--gold)] hover:text-black hover:border-[var(--gold)] transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
              {acceptingClients && (
                <span className="ml-3 text-[var(--gold)] text-xs uppercase tracking-[0.12em]">Accepting Clients</span>
              )}
            </div>

            <div className="text-xs text-white/40">
              <span>{new Date().getFullYear()} {siteName}. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
