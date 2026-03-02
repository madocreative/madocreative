'use client';

import Link from 'next/link';
import { useMemo } from 'react';

/* ─── Social icon SVGs ─────────────────────────────────────────────── */
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
      <path d="M23.5 6.2a2.9 2.9 0 0 0-2-2C19.7 3.7 12 3.7 12 3.7s-7.7 0-9.5.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 0 12a30 30 0 0 0 .5 5.8 2.9 2.9 0 0 0 2 2c1.8.5 9.5.5 9.5.5s7.7 0 9.5-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 24 12a30 30 0 0 0-.5-5.8ZM9.5 15.5V8.5L15.8 12l-6.3 3.5Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
      <path d="M13.5 8.2V6.5c0-.7.5-1 1.1-1h1.9V2.1h-2.8c-3 0-4.2 2-4.2 4.1v2H7v3.4h2.5V22h4v-10.4h2.7l.4-3.4h-3.1Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
      <path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm9.5 1.8H7.3a3.5 3.5 0 0 0-3.5 3.5v9.4a3.5 3.5 0 0 0 3.5 3.5h9.4a3.5 3.5 0 0 0 3.5-3.5V7.3a3.5 3.5 0 0 0-3.5-3.5Zm-4.7 3.6A4.6 4.6 0 1 1 7.4 12 4.6 4.6 0 0 1 12 7.4Zm0 1.8A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Zm5.3-2a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
      <path d="M20.7 3.3 2.9 10.1c-1.2.5-1.2 1.2-.2 1.5l4.6 1.4 1.8 5.8c.2.7.1 1 .9 1l2.6-2.5 5.5 4c1 .6 1.8.3 2.1-1L23 4.9c.4-1.6-.6-2.4-2.3-1.6Zm-3.4 4.6-7.2 6.5-.3 3.2-1-3.3-4-1.2 12.6-4.9Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
      <path d="M20 3.9A11.4 11.4 0 0 0 2.5 18L1 23l5.2-1.4a11.4 11.4 0 1 0 13.7-17.7Zm-8.6 17.1a9.6 9.6 0 0 1-4.9-1.3l-.4-.2-3 .8.8-2.9-.2-.4a9.6 9.6 0 1 1 7.7 4Zm5.3-7.2c-.3-.1-1.8-.9-2-.9-.3-.1-.4-.1-.6.1l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.5l.4-.5.3-.5c.1-.2 0-.4 0-.5L8.6 6.9c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.3.2-.7.2-1.2.1-1.3-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

/* ─── Types ─────────────────────────────────────────────────────────── */
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

/* ─── Nav columns ────────────────────────────────────────────────────── */
const workLinks = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'Shop', href: '/shop' },
  { label: 'Journal', href: '/blog' },
];

const studioLinks = [
  { label: 'Team', href: '/team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Booking', href: '/booking' },
  { label: 'Contact', href: '/contact' },
];

/* ─── Component ──────────────────────────────────────────────────────── */
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
  const socials = useMemo(
    () => [
      { href: instagramUrl, label: 'Instagram', icon: <InstagramIcon /> },
      { href: youtubeUrl, label: 'YouTube', icon: <YouTubeIcon /> },
      { href: facebookUrl, label: 'Facebook', icon: <FacebookIcon /> },
      { href: telegramUrl, label: 'Telegram', icon: <TelegramIcon /> },
      { href: whatsappUrl, label: 'WhatsApp', icon: <WhatsAppIcon /> },
      {
        href: `mailto:${email}`,
        label: 'Email',
        icon: <span className="material-symbols-outlined text-[18px]" aria-hidden="true">mail</span>,
      },
    ],
    [instagramUrl, youtubeUrl, facebookUrl, telegramUrl, whatsappUrl, email],
  );

  return (
    <footer className="bg-[#0a0906] text-white border-t border-white/[0.07]">
      {/* Gold top line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ffc000]/55 to-transparent" />

      <div className="max-w-[1320px] mx-auto px-6 md:px-10 lg:px-14 pt-14 pb-8 md:pt-18 md:pb-10">

        {/* ── Wordmark row ─────────────────────────────────────────────── */}
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#ffc000] font-bold mb-3">
            Visual Studio
          </p>
          <h2 className="font-display font-bold text-[clamp(2.4rem,5vw,4rem)] text-white/90 leading-none tracking-[-0.02em] mb-3">
            {siteName.toUpperCase()}
          </h2>
          <p className="text-[#5c5544] text-sm max-w-md leading-relaxed">{tagline}</p>
        </div>

        {/* ── 4-column grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/[0.07]">

          {/* Brand + social — col-span-5 */}
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="inline-block mb-6">
              <img src="/logo.png" alt={siteName} className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-[#5c5544] text-[13px] leading-relaxed mb-7 max-w-xs">
              Independent studio crafting premium imagery, cinematic films, and brand campaigns for visionaries worldwide.
            </p>
            {/* Social icons */}
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-11 h-11 flex items-center justify-center bg-white/[0.04] text-white/60 hover:bg-[#ffc000] hover:text-[#0a0906] transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Work — col-span-2 */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.36em] text-[#5c5544] font-bold mb-5">Work</p>
            <ul className="space-y-3">
              {workLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio — col-span-2 */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.36em] text-[#5c5544] font-bold mb-5">Studio</p>
            <ul className="space-y-3">
              {studioLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect — col-span-3 */}
          <div className="col-span-2 md:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.36em] text-[#5c5544] font-bold mb-5">Connect</p>
            <address className="not-italic space-y-4">
              <p className="text-sm text-white/55 leading-relaxed">{address}</p>
              <a
                href={`mailto:${email}`}
                className="block text-sm text-white/70 hover:text-[#ffc000] transition-colors break-all"
              >
                {email}
              </a>
              <a
                href={`tel:${phone}`}
                className="block text-sm text-white/70 hover:text-[#ffc000] transition-colors"
              >
                {phone}
              </a>
            </address>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-[#ffc000] text-[#0a0906] px-5 h-10 text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-white transition-colors"
            >
              <WhatsAppIcon />
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────── */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[11px] text-white/28 tracking-wide">
            © {new Date().getFullYear()} {siteName} Studio · All Rights Reserved
          </p>
          <div className="flex items-center gap-4">
            {acceptingClients && (
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400/80 font-semibold tracking-[0.14em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Accepting Clients
              </span>
            )}
            <Link
              href="/admin"
              className="text-[11px] text-white/18 hover:text-white/40 transition-colors tracking-wide"
            >
              Admin
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
