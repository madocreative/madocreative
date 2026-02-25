'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navGroups = [
    {
        label: 'Overview',
        links: [
            { href: '/admin',          icon: 'dashboard',       label: 'Dashboard' },
        ],
    },
    {
        label: 'Content',
        links: [
            { href: '/admin/pages',    icon: 'article',         label: 'Pages' },
            { href: '/admin/galleries',icon: 'photo_library',   label: 'Portfolio' },
            { href: '/admin/media',    icon: 'perm_media',      label: 'Media Library' },
            { href: '/admin/blog',     icon: 'edit_note',       label: 'Blog' },
            { href: '/admin/shop',     icon: 'storefront',      label: 'Shop' },
        ],
    },
    {
        label: 'Inbox',
        links: [
            { href: '/admin/bookings', icon: 'event',           label: 'Bookings' },
            { href: '/admin/contacts', icon: 'mail',            label: 'Messages' },
        ],
    },
    {
        label: 'Config',
        links: [
            { href: '/admin/settings', icon: 'settings',        label: 'Site Settings' },
        ],
    },
];

function NavLink({ href, icon, label, exact = false, onClick }: { href: string; icon: string; label: string; exact?: boolean; onClick?: () => void }) {
    const pathname = usePathname();
    const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${active
                ? 'bg-[#ffc000]/10 text-[#ffc000] border border-[#ffc000]/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
        >
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
            {label}
        </Link>
    );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#ffc000] rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#0a0a08] text-[16px]">construction</span>
                    </div>
                    <span className="font-display font-bold text-base tracking-wider">Mado Admin</span>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-slate-400 hover:text-white md:hidden">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </div>

            <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
                {navGroups.map(group => (
                    <div key={group.label} className="mb-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-600 px-4 mb-1">{group.label}</p>
                        {group.links.map(l => (
                            <NavLink
                                key={l.href}
                                href={l.href}
                                icon={l.icon}
                                label={l.label}
                                exact={l.href === '/admin'}
                                onClick={onClose}
                            />
                        ))}
                    </div>
                ))}
            </nav>

            <div className="p-3 border-t border-white/10">
                <Link href="/" target="_blank"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span> View Live Site
                </Link>
            </div>
        </div>
    );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#0a0a08] text-white">
            {/* Desktop Sidebar */}
            <aside className="w-60 bg-[#1a1812] border-r border-white/10 hidden md:flex flex-col">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div className="w-64 bg-[#1a1812] border-r border-white/10 flex flex-col">
                        <Sidebar onClose={() => setMobileOpen(false)} />
                    </div>
                    <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)}></div>
                </div>
            )}

            {/* Main */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-[#1a1812] border-b border-white/10 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#ffc000] rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#0a0a08] text-[12px]">construction</span>
                        </div>
                        <span className="font-display font-bold tracking-wider">Mado Admin</span>
                    </div>
                    <button className="text-white" onClick={() => setMobileOpen(true)}>
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0a0a08]/50">
                    {children}
                </div>
            </main>
        </div>
    );
}
