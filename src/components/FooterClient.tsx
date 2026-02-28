'use client';

import { FormEvent, ReactNode, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/components/ThemeProvider';

gsap.registerPlugin(ScrollTrigger);

type SocialItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

type FooterClientProps = {
  siteName: string;
  email: string;
  phone: string;
  address: string;
  youtubeUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  telegramUrl: string;
  whatsappUrl: string;
};

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

export default function FooterClient({
  siteName,
  email,
  phone,
  address,
  youtubeUrl,
  instagramUrl,
  facebookUrl,
  telegramUrl,
  whatsappUrl,
}: FooterClientProps) {
  const { theme } = useTheme();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-reveal', {
        y: 34,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 82%',
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const socials = useMemo<SocialItem[]>(
    () => [
      { href: youtubeUrl, label: 'YouTube', icon: <YouTubeIcon /> },
      { href: facebookUrl, label: 'Facebook', icon: <FacebookIcon /> },
      { href: instagramUrl, label: 'Instagram', icon: <InstagramIcon /> },
      { href: telegramUrl, label: 'Telegram', icon: <TelegramIcon /> },
      { href: whatsappUrl, label: 'WhatsApp', icon: <WhatsAppIcon /> },
    ],
    [facebookUrl, instagramUrl, telegramUrl, whatsappUrl, youtubeUrl],
  );

  const isLight = theme === 'light';

  const lineColor = isLight ? 'rgba(20,20,20,0.06)' : 'rgba(255,255,255,0.06)';

  const backgroundGrid = {
    backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
    backgroundSize: '26px 26px',
  };

  const onSubscribe = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <footer
      ref={footerRef}
      className={`mt-auto border-t ${isLight ? 'border-black/10 bg-[#f7f7f5] text-[#111111]' : 'border-white/10 bg-[#100f0c] text-white'}`}
      style={backgroundGrid}
    >
      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10 lg:px-14 py-16 md:py-18 lg:py-20">
        <div className="grid gap-12 md:gap-14 lg:grid-cols-[1.3fr_0.8fr]">
          <div>
            <h2 className="footer-reveal text-[clamp(2.2rem,4.4vw,4.5rem)] font-semibold leading-[1] tracking-tight">Keep in touch.</h2>

            <form className="footer-reveal mt-10 md:mt-14 max-w-2xl" onSubmit={onSubscribe}>
              <div className={`flex items-center justify-between gap-4 border-b pb-4 ${isLight ? 'border-black/20' : 'border-white/20'}`}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full bg-transparent outline-none text-lg placeholder:text-current/60"
                />
                <button type="submit" className="text-lg font-medium hover:opacity-70 transition-opacity">
                  Subscribe
                </button>
              </div>
              <p className={`mt-4 text-base ${isLight ? 'text-[#4d4a43]' : 'text-white/65'}`}>
                No worries, we don&apos;t spam your inbox.
              </p>
            </form>
          </div>

          <div className="footer-reveal lg:pl-16">
            <p className="text-[clamp(1.5rem,2.1vw,2.35rem)] font-semibold leading-[1.2]">{address}</p>

            <div className="mt-9 space-y-6">
              <div>
                <p className={`text-xs uppercase tracking-[0.24em] mb-2 ${isLight ? 'text-[#65625a]' : 'text-white/60'}`}>
                  Email us directly
                </p>
                <a href={`mailto:${email}`} className="text-2xl font-semibold hover:text-[#ffc000] transition-colors">
                  {email}
                </a>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-[0.24em] mb-2 ${isLight ? 'text-[#65625a]' : 'text-white/60'}`}>
                  Call us directly
                </p>
                <a href={`tel:${phone}`} className="text-2xl font-semibold hover:text-[#ffc000] transition-colors">
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={`footer-reveal mt-18 md:mt-24 pt-10 border-t ${isLight ? 'border-black/10' : 'border-white/10'}`}>
          <div className="flex flex-col gap-8 md:gap-10 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-5 md:gap-7">
              <Link href="/" className="shrink-0">
                <img src="/logo.png" alt={siteName} className="h-[88px] md:h-[104px] w-auto object-contain" />
              </Link>
              <p className={`max-w-md text-[1.1rem] leading-[1.45] ${isLight ? 'text-[#3d3a35]' : 'text-white/70'}`}>
                {new Date().getFullYear()} Mado Autolabs by Sassuo Hub. All images are {siteName} property.
              </p>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`h-11 w-11 rounded-full grid place-items-center border transition-colors ${
                    isLight
                      ? 'border-black/12 text-black hover:bg-black hover:text-white'
                      : 'border-white/20 text-white hover:bg-white hover:text-[#111]'
                  }`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
