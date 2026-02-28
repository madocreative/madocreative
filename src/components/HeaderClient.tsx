'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

type NavItem = {
  name: string;
  path: string;
};

type HeaderClientProps = {
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
};

const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Services', path: '/services' },
  { name: 'Team', path: '/team' },
  { name: 'Shop', path: '/shop' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

export default function HeaderClient({ contactInfo }: HeaderClientProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };

    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [sidebarOpen]);

  const themeClasses = useMemo(() => {
    if (theme === 'light') {
      return {
        shell: 'bg-white/82 border-black/10',
        menuBtn: 'bg-[#111111] text-white',
        roundBtn: 'bg-[#f3f3f0] text-[#101010] border border-black/10 hover:bg-[#ecebe5]',
        primaryBtn: 'bg-[#111111] text-white hover:bg-[#2b2b2b]',
        sidebar: 'bg-[#f8f7f3] border-black/12 text-[#111111]',
      };
    }

    return {
      shell: 'bg-[#090705]/78 border-white/12',
      menuBtn: 'bg-white text-[#090705]',
      roundBtn: 'bg-white/12 text-white border border-white/25 hover:bg-white/24',
      primaryBtn: 'bg-white text-[#090705] hover:bg-[#ffe9a4]',
      sidebar: 'bg-[#0f0d0a] border-white/14 text-white',
    };
  }, [theme]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 md:px-5 pt-3 md:pt-4">
        <div
          className={`mx-auto max-w-[1320px] rounded-[1.5rem] border backdrop-blur-xl transition-all duration-300 ${themeClasses.shell} ${
            isScrolled ? 'shadow-[0_18px_45px_rgba(0,0,0,0.25)]' : 'shadow-[0_10px_30px_rgba(0,0,0,0.18)]'
          }`}
        >
          <div className="flex items-center justify-between gap-3 px-3 py-3 md:px-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className={`h-11 w-11 rounded-full grid place-items-center transition-colors ${themeClasses.menuBtn}`}
                aria-label="Open menu"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>
              <Link href="/" className="block">
                <img src="/logo.png" alt="Mado Creatives" className="h-12 md:h-16 w-auto object-contain" />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-[0.96rem] font-semibold tracking-tight transition-colors ${
                    isActive(item.path)
                      ? theme === 'dark'
                        ? 'text-white'
                        : 'text-[#1b1b1b]'
                      : theme === 'dark'
                        ? 'text-white/84 hover:text-white'
                        : 'text-[#383838] hover:text-[#1b1b1b]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className={`h-11 w-11 rounded-full grid place-items-center transition-colors ${themeClasses.roundBtn}`}
                aria-label="Toggle theme"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              <button
                type="button"
                className={`hidden sm:flex items-center gap-1.5 h-11 px-4 rounded-full transition-colors ${themeClasses.roundBtn}`}
              >
                <span className="text-sm font-semibold">En</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>

              <Link
                href="/contact"
                className={`hidden md:flex items-center gap-2 h-11 px-6 rounded-full text-sm font-semibold transition-colors ${themeClasses.primaryBtn}`}
              >
                Contact Us
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/45"
            aria-label="Close menu"
          />

          <aside
            className={`relative h-full w-[min(88vw,420px)] border-r px-5 md:px-7 py-6 md:py-7 ${themeClasses.sidebar}`}
          >
            <div className="flex items-center justify-between pb-6 border-b border-current/10">
              <p className="text-[11px] uppercase tracking-[0.3em] opacity-70">Navigation</p>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="h-9 w-9 rounded-full grid place-items-center border border-current/20"
                aria-label="Close sidebar"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <nav className="pt-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-[0.97rem] font-semibold transition-colors ${
                    isActive(item.path)
                      ? theme === 'dark'
                        ? 'bg-white/12 text-white'
                        : 'bg-black/[0.07] text-black'
                      : theme === 'dark'
                        ? 'text-white/82 hover:bg-white/[0.07] hover:text-white'
                        : 'text-[#1e1e1e] hover:bg-black/[0.06]'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="material-symbols-outlined text-[18px] opacity-70">arrow_outward</span>
                </Link>
              ))}
            </nav>

            <div className="mt-7 rounded-2xl border border-current/10 p-4 md:p-5">
              <p className="text-[11px] uppercase tracking-[0.28em] opacity-70 mb-4">Contact Info</p>
              <div className="space-y-3 text-sm">
                <a href={`tel:${contactInfo.phone}`} className="block hover:text-[#ffc000] transition-colors">
                  {contactInfo.phone}
                </a>
                <a href={`mailto:${contactInfo.email}`} className="block hover:text-[#ffc000] transition-colors break-all">
                  {contactInfo.email}
                </a>
                <p className="opacity-85">{contactInfo.address}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <Link
                href="/booking"
                onClick={() => setSidebarOpen(false)}
                className="h-10 rounded-full grid place-items-center text-sm font-semibold bg-[#ffc000] text-[#111] hover:bg-[#ffe0a0] transition-colors"
              >
                Book Now
              </Link>
              <Link
                href="/contact"
                onClick={() => setSidebarOpen(false)}
                className="h-10 rounded-full grid place-items-center text-sm font-semibold border border-current/20 hover:border-[#ffc000] hover:text-[#ffc000] transition-colors"
              >
                Message Us
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
