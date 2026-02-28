'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

type NavItem = {
  name: string;
  path: string;
};

const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Gallery', path: '/portfolio' },
  { name: 'Info', path: '/team' },
  { name: 'Pricing', path: '/services' },
  { name: 'Shop', path: '/shop' },
  { name: 'Blog', path: '/blog' },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const themeClasses = useMemo(() => {
    if (theme === 'light') {
      return {
        shell: 'bg-white/82 border-black/10',
        menuBtn: 'bg-[#111111] text-white',
        roundBtn: 'bg-[#f3f3f0] text-[#101010] border border-black/10 hover:bg-[#ecebe5]',
        primaryBtn: 'bg-[#111111] text-white hover:bg-[#2b2b2b]',
        mobilePanel: 'bg-white border-black/10 text-[#151515]',
      };
    }

    return {
      shell: 'bg-[#090705]/78 border-white/12',
      menuBtn: 'bg-white text-[#090705]',
      roundBtn: 'bg-white/12 text-white border border-white/25 hover:bg-white/24',
      primaryBtn: 'bg-white text-[#090705] hover:bg-[#ffe9a4]',
      mobilePanel: 'bg-[#0f0d0a] border-white/10 text-white',
    };
  }, [theme]);

  return (
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
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`h-11 w-11 rounded-full grid place-items-center transition-colors ${themeClasses.menuBtn}`}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
            <Link href="/" className="block">
              <img src="/logo.png" alt="Mado Creatives" className="h-12 md:h-16 w-auto object-contain" />
            </Link>
          </div>

          <nav className="hidden xl:flex items-center gap-7">
            {navItems.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-[1rem] font-semibold tracking-tight transition-colors ${
                    active
                      ? theme === 'dark'
                        ? 'text-white'
                        : 'text-[#1b1b1b]'
                      : theme === 'dark'
                        ? 'text-white/84'
                        : 'text-[#383838]'
                  } ${theme === 'dark' ? 'hover:text-white' : 'hover:text-[#1b1b1b]'}`}
                >
                  {item.name}
                </Link>
              );
            })}
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

        {mobileMenuOpen && (
          <div className={`xl:hidden border-t px-4 pb-5 pt-4 rounded-b-[1.5rem] ${themeClasses.mobilePanel}`}>
            <div className="grid gap-1">
              {navItems.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? theme === 'dark'
                          ? 'bg-white/10 text-white'
                          : 'bg-black/[0.06] text-black'
                        : theme === 'dark'
                          ? 'hover:bg-white/[0.07] text-white/[0.86]'
                          : 'hover:bg-black/[0.06] text-[#1f1f1f]'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5 mt-4">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex-1 h-10 rounded-full grid place-items-center text-sm font-semibold ${themeClasses.primaryBtn}`}
              >
                Contact Us
              </Link>
              <Link
                href="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex-1 h-10 rounded-full grid place-items-center text-sm font-semibold ${themeClasses.roundBtn}`}
              >
                Book
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
