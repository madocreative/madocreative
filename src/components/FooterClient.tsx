'use client';

import { FormEvent, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/components/ThemeProvider';

gsap.registerPlugin(ScrollTrigger);

type SocialItem = {
  href: string;
  label: string;
  icon: string;
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
      { href: youtubeUrl, label: 'YouTube', icon: 'smart_display' },
      { href: facebookUrl, label: 'Facebook', icon: 'thumb_up' },
      { href: instagramUrl, label: 'Instagram', icon: 'photo_camera' },
      { href: telegramUrl, label: 'Telegram', icon: 'send' },
      { href: whatsappUrl, label: 'WhatsApp', icon: 'chat' },
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
                  <span className="material-symbols-outlined text-[18px]">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={`hidden lg:flex absolute right-5 top-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-full px-2 py-4 ${isLight ? 'bg-white/80 border border-black/8' : 'bg-white/8 border border-white/18'}`}>
          <span className={`h-2 w-2 rounded-full ${isLight ? 'bg-black/35' : 'bg-white/45'}`} />
          <span className="h-5 w-5 rounded-full border-2 border-[#111111] grid place-items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-[#111111]" />
          </span>
          <span className={`h-2 w-2 rounded-full ${isLight ? 'bg-black/35' : 'bg-white/45'}`} />
          <span className={`h-2 w-2 rounded-full ${isLight ? 'bg-black/35' : 'bg-white/45'}`} />
        </div>
      </div>
    </footer>
  );
}
