'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const servicesDropdown = [
    { name: 'All Services', path: '/services', icon: 'layers' },
    { name: 'Videography', path: '/videography', icon: 'videocam' },
    { name: 'Digital Marketing', path: '/digital-marketing', icon: 'trending_up' },
];

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setServicesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const isServicesActive = ['/services', '/videography', '/digital-marketing'].includes(pathname);

    const navLinks = [
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
                <Link href="/" className="flex items-center">
                    <img src="/logo.png" alt="Mado Creatives" className="h-16 md:h-24 w-auto object-contain scale-[1.3] origin-left" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10">
                    <Link href="/"
                        className={`text-sm font-medium uppercase tracking-widest transition-colors hover:text-[#ffc000] ${pathname === '/' ? 'text-[#ffc000] border-b border-[#ffc000]' : 'text-slate-300'}`}>
                        Home
                    </Link>

                    {/* Services dropdown */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setServicesOpen(o => !o)}
                            className={`flex items-center gap-1 text-sm font-medium uppercase tracking-widest transition-colors hover:text-[#ffc000] ${isServicesActive ? 'text-[#ffc000] border-b border-[#ffc000]' : 'text-slate-300'}`}
                        >
                            Services
                            <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        {servicesOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-[#1a1812] border border-white/10 shadow-2xl overflow-hidden">
                                {servicesDropdown.map(item => (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setServicesOpen(false)}
                                        className={`flex items-center gap-3 px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors border-b border-white/5 last:border-0
                                            ${pathname === item.path
                                                ? 'bg-[#ffc000]/10 text-[#ffc000]'
                                                : 'text-slate-300 hover:bg-white/5 hover:text-[#ffc000]'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px] text-[#ffc000]">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className={`text-sm font-medium uppercase tracking-widest transition-colors hover:text-[#ffc000] ${pathname === link.path ? 'text-[#ffc000] border-b border-[#ffc000]' : 'text-slate-300'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* CTA & Mobile Toggle */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/booking"
                        className="hidden sm:flex bg-[#ffc000] text-[#0a0a08] px-6 py-2.5 font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors"
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

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#1a1812] border-b border-white/10 shadow-2xl py-6 px-6 flex flex-col gap-0">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)}
                        className={`py-4 border-b border-white/5 text-lg font-bold uppercase tracking-widest ${pathname === '/' ? 'text-[#ffc000]' : 'text-white'}`}>
                        Home
                    </Link>

                    {/* Services group */}
                    <div className="border-b border-white/5 pb-2">
                        <p className="pt-4 pb-2 text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Services</p>
                        {servicesDropdown.map(item => (
                            <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 pl-3 py-3 text-base font-bold uppercase tracking-widest border-t border-white/5 ${pathname === item.path ? 'text-[#ffc000]' : 'text-white'}`}>
                                <span className="material-symbols-outlined text-[16px] text-[#ffc000]">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`py-4 border-b border-white/5 text-lg font-bold uppercase tracking-widest ${pathname === link.path ? 'text-[#ffc000]' : 'text-white'}`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <Link href="/booking" onClick={() => setMobileMenuOpen(false)}
                        className="bg-[#ffc000] text-[#0a0a08] text-center px-6 py-3 font-bold uppercase tracking-wider hover:bg-white transition-colors mt-4">
                        Book a Session
                    </Link>
                </div>
            )}
        </header>
    );
}
