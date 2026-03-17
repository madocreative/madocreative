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
  siteName: string;
  logoUrl: string;
  logoVersion?: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  portfolioLinks: NavChildItem[];
  serviceLinks: NavChildItem[];
};

function buildLogoSrc(logoUrl: string, logoVersion?: string) {
  if (!logoUrl) return '/logo.png';
  if (!logoVersion) return logoUrl;
  return `${logoUrl}${logoUrl.includes('?') ? '&' : '?'}v=${encodeURIComponent(logoVersion)}`;
}

export default function HeaderClient({ siteName, logoUrl, logoVersion, contactInfo, portfolioLinks, serviceLinks }: HeaderClientProps) {
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
      document.documentElement.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [sidebarOpen]);

  const themeClasses = useMemo(() => {
    return {
      shell: 'bg-[var(--app-bg)]/95 border-[color:var(--app-border)] backdrop-blur-xl',
      menuBtn: 'bg-[var(--gold)] text-black hover:bg-[var(--gold-hover)]',
      roundBtn: 'bg-[var(--app-card)] text-[var(--app-text)] border border-[color:var(--app-border)] hover:border-[var(--gold)] hover:text-[var(--gold)]',
      primaryBtn: 'bg-[var(--gold)] text-black hover:bg-[var(--gold-hover)]',
      sidebar: 'bg-[var(--section-bg)] border-[color:var(--app-border)] text-[var(--app-text)]',
    };
  }, []);

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

  const resolvedLogoUrl = buildLogoSrc(logoUrl, logoVersion);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-shadow duration-300 ${themeClasses.shell} ${
          isScrolled ? 'shadow-[0_14px_35px_rgba(0,0,0,0.22)]' : 'shadow-none'
        }`}
      >
        <div className="mx-auto max-w-[1320px] h-[68px] sm:h-[78px] md:h-[88px] flex items-center justify-between gap-2.5 px-3 sm:px-3.5 md:px-5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className={`h-10 w-10 md:h-11 md:w-11 rounded-full grid place-items-center transition-colors ${themeClasses.menuBtn}`}
                aria-label="Open menu"
              >
                <span className="material-symbols-outlined text-[19px] md:text-[20px]">menu</span>
              </button>
              <Link href="/" className="flex items-center gap-2.5 min-w-0">
                <img src={resolvedLogoUrl} alt={siteName} className="h-10 sm:h-11 md:h-16 w-auto object-contain" />
                <div className="hidden min-[380px]:block">
                  <p className="text-[9px] uppercase tracking-[0.28em] text-white/45">Creative Studio</p>
                  <p className="text-sm sm:text-base font-semibold text-white/88 leading-tight">{siteName}</p>
                </div>
              </Link>
            </div>

            <nav className="hidden xl:flex items-center gap-6">
              {navItems.map((item) => {
                const itemIsActive =
                  isActive(item.path) || (item.children?.some((child) => isActive(child.path)) ?? false);

                const textClass = itemIsActive
                  ? 'text-[var(--app-text)]'
                  : 'text-white/74 hover:text-[var(--gold)]';

                const underlineClass = itemIsActive
                  ? 'after:scale-x-100 after:bg-[var(--gold)]'
                  : 'after:scale-x-0 after:bg-[var(--gold)] hover:after:scale-x-100';

                const navLinkClass = `relative inline-flex pb-1 text-[0.96rem] font-semibold tracking-tight transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:h-[2px] after:w-full after:origin-left after:transition-transform ${textClass} ${underlineClass}`;

                if (!item.children || item.children.length === 0) {
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={navLinkClass}
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
                        className={navLinkClass}
                      >
                        {item.name}
                      </Link>
                      <span
                        className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${textClass} group-hover:rotate-180`}
                      >
                        expand_more
                      </span>
                    </div>

                    <div className="absolute left-0 top-full pt-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-220 z-50">
                      <div
                        className="w-[340px] rounded-2xl border p-2 shadow-[0_20px_40px_rgba(0,0,0,0.28)] bg-[var(--app-card)] border-[color:var(--app-border)]"
                      >
                        <div data-lenis-prevent="true" className="max-h-[56vh] overflow-y-auto overscroll-contain pr-0.5 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              href={child.path}
                              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                            >
                              <p className="text-[0.86rem] font-semibold tracking-tight text-white/92">
                                {child.name}
                              </p>
                              {child.description && (
                                <p className="mt-0.5 text-[11px] leading-relaxed text-white/55">
                                  {child.description}
                                </p>
                              )}
                            </Link>
                          ))}
                        </div>

                        <Link
                          href={item.path}
                          className="mt-2 h-9 rounded-xl grid place-items-center text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors bg-[var(--gold)] text-black hover:bg-[var(--gold-hover)]"
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
                className={`hidden sm:grid h-10 w-10 md:h-11 md:w-11 rounded-full place-items-center transition-colors ${themeClasses.roundBtn}`}
                aria-label="Toggle theme"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              <Link
                href="/booking"
                className={`sm:hidden inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-sm font-semibold transition-colors ${themeClasses.primaryBtn}`}
              >
                Book
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>

              <Link
                href="/contact"
                className={`hidden sm:inline-flex lg:hidden items-center gap-2 h-10 px-4 rounded-full text-sm font-semibold transition-colors ${themeClasses.roundBtn}`}
              >
                Contact
                <span className="material-symbols-outlined text-[16px]">north_east</span>
              </Link>

              <Link
                href="/contact"
                className={`hidden lg:flex items-center gap-2 h-11 px-6 rounded-full text-sm font-semibold transition-colors ${themeClasses.primaryBtn}`}
              >
                Contact Us
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </Link>
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

          <aside data-lenis-prevent="true" className={`relative h-full w-full sm:w-[min(88vw,420px)] border-r px-5 md:px-7 py-6 md:py-7 overflow-y-auto overscroll-contain ${themeClasses.sidebar}`}>
            <div className="flex items-center justify-between pb-6 border-b border-current/10">
              <div className="flex items-center gap-3 min-w-0">
                <img src={resolvedLogoUrl} alt={siteName} className="h-10 w-auto object-contain" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.28em] opacity-55">Navigation</p>
                  <p className="text-sm font-semibold text-white/88 truncate">{siteName}</p>
                </div>
              </div>
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
                    ? 'bg-white/[0.06] text-[var(--app-text)] border border-[color:var(--app-border)]'
                    : 'text-white/82 hover:bg-white/[0.05] hover:text-[var(--app-text)]'
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
                  <div key={item.path} className="rounded-xl border border-[color:var(--app-border)]">
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
                          className="block rounded-lg px-2.5 py-2 text-sm transition-colors text-white/68 hover:text-[var(--app-text)] hover:bg-white/[0.04]"
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

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <Link
                href="/booking"
                onClick={() => setSidebarOpen(false)}
                className="h-10 rounded-full grid place-items-center text-sm font-semibold bg-[var(--gold)] text-black hover:bg-[var(--gold-hover)] transition-colors"
              >
                Book Now
              </Link>
              <Link
                href="/contact"
                onClick={() => setSidebarOpen(false)}
                className="h-10 rounded-full grid place-items-center text-sm font-semibold border border-current/20 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
              >
                Message Us
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className="h-10 rounded-full grid place-items-center text-sm font-semibold border border-current/20 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
