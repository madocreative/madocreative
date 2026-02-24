'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Team', path: '/team' },
        { name: 'Shop', path: '/shop' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[#0a0a08]/90 backdrop-blur-md border-b border-white/10 py-4 shadow-lg'
                : 'bg-transparent py-6 border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="text-[#f2b90d]">
                        <span className="material-symbols-outlined text-4xl">filter_vintage</span>
                    </div>
                    <h2 className="text-xl font-extrabold tracking-tighter uppercase text-white">
                        Mado <span className="text-[#f2b90d]">Creatives</span>
                    </h2>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className={`text-sm font-medium uppercase tracking-widest transition-colors hover:text-[#f2b90d] ${pathname === link.path ? 'text-[#f2b90d] border-b border-[#f2b90d]' : 'text-slate-300'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* CTA & Mobile Toggle */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/booking"
                        className="hidden sm:flex bg-[#f2b90d] text-[#0a0a08] px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-tighter hover:scale-105 transition-transform"
                    >
                        Book a Session
                    </Link>
                    <button
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="material-symbols-outlined">
                            {mobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#1a1812] border-b border-white/10 shadow-2xl py-6 px-6 flex flex-col gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-lg font-bold uppercase tracking-widest ${pathname === link.path ? 'text-[#f2b90d]' : 'text-white'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/booking"
                        onClick={() => setMobileMenuOpen(false)}
                        className="bg-[#f2b90d] text-[#0a0a08] text-center px-6 py-3 rounded-full font-bold uppercase tracking-tighter mt-4"
                    >
                        Book a Session
                    </Link>
                </div>
            )}
        </header>
    );
}
