'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

type NavItem = {
  name: string;
  path: string;
  children?: NavChildItem[];
};

type NavChildItem = {
  name: string;
  path: string;
  description?: string;
};

type HeaderClientProps = {
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  portfolioLinks: NavChildItem[];
  serviceLinks: NavChildItem[];
};

export default function HeaderClient({ contactInfo, portfolioLinks, serviceLinks }: HeaderClientProps) {
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

  const navItems = useMemo<NavItem[]>(
    () => [
      { name: 'Home', path: '/' },
      { name: 'Portfolio', path: '/portfolio', children: portfolioLinks },
      { name: 'Services', path: '/services', children: serviceLinks },
      { name: 'Team', path: '/team' },
      { name: 'Shop', path: '/shop' },
      { name: 'Blog', path: '/blog' },
      { name: 'Contact', path: '/contact' },
    ],
    [portfolioLinks, serviceLinks],
  );

  const getBasePath = (path: string) => path.split('#')[0];

  const isActive = (path: string) => {
    const basePath = getBasePath(path);
    if (basePath === '/') return pathname === '/';
    return pathname === basePath || pathname.startsWith(`${basePath}/`);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-2.5 sm:px-3 md:px-5 pt-2.5 sm:pt-3 md:pt-4">
        <div
          className={`mx-auto max-w-[1320px] rounded-[1.1rem] sm:rounded-[1.25rem] md:rounded-[1.5rem] border backdrop-blur-xl transition-all duration-300 ${themeClasses.shell} ${
            isScrolled ? 'shadow-[0_18px_45px_rgba(0,0,0,0.25)]' : 'shadow-[0_10px_30px_rgba(0,0,0,0.18)]'
          }`}
        >
          <div className="flex items-center justify-between gap-2.5 px-2.5 py-2.5 sm:px-3 sm:py-3 md:px-5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className={`h-10 w-10 md:h-11 md:w-11 rounded-full grid place-items-center transition-colors ${themeClasses.menuBtn}`}
                aria-label="Open menu"
              >
                <span className="material-symbols-outlined text-[19px] md:text-[20px]">menu</span>
              </button>
              <Link href="/" className="block">
                <img src="/logo.png" alt="Mado Creatives" className="h-10 sm:h-11 md:h-16 w-auto object-contain" />
              </Link>
            </div>

            <nav className="hidden xl:flex items-center gap-6">
              {navItems.map((item) => {
                const activeClass = isActive(item.path)
                  ? theme === 'dark'
                    ? 'text-white'
                    : 'text-[#1b1b1b]'
                  : theme === 'dark'
                    ? 'text-white/84 hover:text-white'
                    : 'text-[#383838] hover:text-[#1b1b1b]';

                if (!item.children || item.children.length === 0) {
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`text-[0.96rem] font-semibold tracking-tight transition-colors ${activeClass}`}
                    >
                      {item.name}
                    </Link>
                  );
                }

                return (
                  <div key={item.path} className="relative group">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={item.path}
                        className={`text-[0.96rem] font-semibold tracking-tight transition-colors ${activeClass}`}
                      >
                        {item.name}
                      </Link>
                      <span
                        className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${activeClass} group-hover:rotate-180`}
                      >
                        expand_more
                      </span>
                    </div>

                    <div className="absolute left-0 top-full pt-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-220 z-50">
                      <div
                        className={`w-[340px] rounded-2xl border p-2 shadow-[0_20px_40px_rgba(0,0,0,0.28)] ${
                          theme === 'dark' ? 'bg-[#100d09] border-white/12' : 'bg-[#f8f6f1] border-black/10'
                        }`}
                      >
                        <div className="max-h-[56vh] overflow-y-auto pr-0.5 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              href={child.path}
                                className={`block rounded-xl px-3 py-2.5 transition-colors ${
                                  theme === 'dark' ? 'hover:bg-white/8' : 'hover:bg-black/[0.06]'
                                }`}
                            >
                              <p
                                className={`text-[0.86rem] font-semibold tracking-tight ${
                                  theme === 'dark' ? 'text-white/92' : 'text-[#1e1e1e]'
                                }`}
                              >
                                {child.name}
                              </p>
                              {child.description && (
                                <p className={`mt-0.5 text-[11px] leading-relaxed ${theme === 'dark' ? 'text-white/55' : 'text-[#5a5a5a]'}`}>
                                  {child.description}
                                </p>
                              )}
                            </Link>
                          ))}
                        </div>

                        <Link
                          href={item.path}
                          className={`mt-2 h-9 rounded-xl grid place-items-center text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                            theme === 'dark'
                              ? 'bg-white/10 text-white hover:bg-[#ffc000] hover:text-[#111]'
                              : 'bg-black/[0.06] text-[#1a1a1a] hover:bg-[#111] hover:text-white'
                          }`}
                        >
                          View All {item.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className={`h-10 w-10 md:h-11 md:w-11 rounded-full grid place-items-center transition-colors ${themeClasses.roundBtn}`}
                aria-label="Toggle theme"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              <Link
                href="/contact"
                className={`md:hidden h-10 w-10 rounded-full grid place-items-center transition-colors ${themeClasses.roundBtn}`}
                aria-label="Contact us"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </Link>

              <button
                type="button"
                className={`hidden md:flex items-center gap-1.5 h-11 px-4 rounded-full transition-colors ${themeClasses.roundBtn}`}
              >
                <span className="text-sm font-semibold">En</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>

              <Link
                href="/contact"
                className={`hidden lg:flex items-center gap-2 h-11 px-6 rounded-full text-sm font-semibold transition-colors ${themeClasses.primaryBtn}`}
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

          <aside className={`relative h-full w-full sm:w-[min(88vw,420px)] border-r px-5 md:px-7 py-6 md:py-7 overflow-y-auto ${themeClasses.sidebar}`}>
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

            <nav className="pt-6 space-y-1.5">
              {navItems.map((item) => {
                const parentBaseClasses = `flex items-center justify-between rounded-xl px-3.5 py-3.5 text-[1rem] font-semibold transition-colors ${
                  isActive(item.path)
                    ? theme === 'dark'
                      ? 'bg-white/12 text-white'
                      : 'bg-black/[0.07] text-black'
                    : theme === 'dark'
                      ? 'text-white/82 hover:bg-white/[0.07] hover:text-white'
                      : 'text-[#1e1e1e] hover:bg-black/[0.06]'
                }`;

                if (!item.children || item.children.length === 0) {
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={parentBaseClasses}
                    >
                      <span>{item.name}</span>
                      <span className="material-symbols-outlined text-[18px] opacity-70">arrow_outward</span>
                    </Link>
                  );
                }

                return (
                  <div key={item.path} className={`rounded-xl border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                    <Link href={item.path} onClick={() => setSidebarOpen(false)} className={parentBaseClasses}>
                      <span>{item.name}</span>
                      <span className="material-symbols-outlined text-[18px] opacity-70">north_east</span>
                    </Link>
                    <div className="px-2 pb-2.5 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          href={child.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`block rounded-lg px-2.5 py-2 text-sm transition-colors ${
                            theme === 'dark'
                              ? 'text-white/68 hover:text-white hover:bg-white/8'
                              : 'text-[#3b3b3b] hover:text-black hover:bg-black/[0.05]'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
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
