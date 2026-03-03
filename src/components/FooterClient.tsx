'use client';

import Link from 'next/link';

type FooterClientProps = {
  siteName: string;
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

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
];

export default function FooterClient({
  siteName,
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
  const socialLinks = [
    { label: 'Instagram', href: instagramUrl },
    { label: 'YouTube', href: youtubeUrl },
    { label: 'Facebook', href: facebookUrl },
    { label: 'Telegram', href: telegramUrl },
    { label: 'WhatsApp', href: whatsappUrl },
  ].filter((item) => typeof item.href === 'string' && item.href.trim().length > 0);

  return (
    <footer className="border-t border-white/10 bg-[#0a0906] text-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10 md:py-12">
        <div className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="max-w-xl">
              <Link href="/" className="inline-block">
                <img src="/logo.png" alt={siteName} className="h-12 w-auto object-contain" />
              </Link>
              <p className="mt-3 text-sm text-white/65 leading-relaxed">{tagline}</p>
              <p className="mt-4 text-sm text-white/80">{address}</p>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                <a href={`mailto:${email}`} className="text-white/75 hover:text-[#ffc000] transition-colors">
                  {email}
                </a>
                <a href={`tel:${phone}`} className="text-white/75 hover:text-[#ffc000] transition-colors">
                  {phone}
                </a>
              </div>
            </div>

            <nav className="flex flex-wrap gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="h-9 px-4 rounded-full border border-white/14 text-sm text-white/85 hover:border-[#ffc000] hover:text-[#ffc000] transition-colors inline-flex items-center"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="pt-5 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/55">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ffc000] transition-colors"
                >
                  {item.label}
                </a>
              ))}
              {acceptingClients && (
                <span className="text-emerald-400/85 uppercase tracking-[0.12em]">Accepting Clients</span>
              )}
            </div>

            <div className="text-xs text-white/40">
              <span>{new Date().getFullYear()} {siteName}. All rights reserved.</span>
              <Link href="/admin" className="ml-3 hover:text-white/70 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
