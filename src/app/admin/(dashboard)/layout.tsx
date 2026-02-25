'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navGroups = [
    {
        label: 'Overview',
        links: [
            { href: '/admin', icon: 'dashboard', label: 'Dashboard' },
        ],
    },
    {
        label: 'Content',
        links: [
            { href: '/admin/pages', icon: 'article', label: 'Pages' },
            { href: '/admin/galleries', icon: 'photo_library', label: 'Portfolio' },
            { href: '/admin/media', icon: 'perm_media', label: 'Media Library' },
            { href: '/admin/blog', icon: 'edit_note', label: 'Blog' },
            { href: '/admin/shop', icon: 'storefront', label: 'Shop' },
        ],
    },
    {
        label: 'Inbox',
        links: [
            { href: '/admin/bookings', icon: 'event', label: 'Bookings' },
            { href: '/admin/contacts', icon: 'mail', label: 'Messages' },
        ],
    },
    {
        label: 'Config',
        links: [
            { href: '/admin/settings', icon: 'settings', label: 'Site Settings' },
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
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium overflow-hidden ${active
                ? 'text-[#ffc000] shadow-[0_0_20px_rgba(255,192,0,0.1)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'
                }`}
        >
            {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffc000]/10 to-transparent pointer-events-none" />
            )}
            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#ffc000] rounded-r-md shadow-[0_0_10px_#ffc000]" />
            )}
            <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,192,0,0.5)]' : 'group-hover:scale-110'}`}>{icon}</span>
            <span className="relative z-10">{label}</span>
        </Link>
    );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
    return (
        <div className="flex flex-col h-full relative">
            {/* Subtle background glow */}
            <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[40%] bg-[#ffc000]/5 blur-[100px] pointer-events-none" />

            <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#ffc000] to-[#b38600] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,192,0,0.2)]">
                        <span className="material-symbols-outlined text-[#0a0a08] text-[20px]">diamond</span>
                    </div>
                    <span className="font-display font-bold text-lg tracking-widest uppercase text-white drop-shadow-md">Mado <span className="text-[#ffc000]">Admin</span></span>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-slate-400 hover:text-white md:hidden transition-transform hover:rotate-90">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                )}
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto relative z-10 
                           scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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

            <div className="p-4 border-t border-white/5 relative z-10">
                <Link href="/" target="_blank"
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-400 bg-white/5 border border-white/5 hover:text-[#ffc000] hover:bg-white/10 hover:border-[#ffc000]/30 transition-all duration-300 text-sm font-bold uppercase tracking-widest group">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">visibility</span>
                        <span>Live Site</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">arrow_forward</span>
                </Link>
            </div>
        </div>
    );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#070705] text-white selection:bg-[#ffc000]/30">
            {/* Desktop Sidebar (Glassmorphic) */}
            <aside className="w-72 bg-[#0a0a08]/80 backdrop-blur-xl border-r border-white/5 hidden md:flex flex-col shadow-2xl z-20">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div className="w-72 bg-[#0a0a08]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col shadow-2xl">
                        <Sidebar onClose={() => setMobileOpen(false)} />
                    </div>
                    <div className="flex-1 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setMobileOpen(false)}></div>
                </div>
            )}

            {/* Main */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                {/* Mobile Header */}
                <header className="md:hidden bg-[#0a0a08]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#ffc000] to-[#b38600] rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(255,192,0,0.3)]">
                            <span className="material-symbols-outlined text-[#0a0a08] text-[16px]">diamond</span>
                        </div>
                        <span className="font-display font-bold uppercase tracking-widest text-sm">Mado <span className="text-[#ffc000]">Admin</span></span>
                    </div>
                    <button className="text-white bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setMobileOpen(true)}>
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-12 relative z-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {children}
                </div>
            </main>
        </div>
    );
}
