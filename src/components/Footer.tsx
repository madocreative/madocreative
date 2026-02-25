import Link from 'next/link';
import SiteSettings from '@/models/SiteSettings';
import dbConnect from '@/lib/mongodb';

async function getSettings() {
    try {
        await dbConnect();
        const s = await SiteSettings.findOne({ key: 'global' });
        return s ? JSON.parse(JSON.stringify(s)) : null;
    } catch { return null; }
}

export default async function Footer() {
    const settings = await getSettings();

    const email        = settings?.email        || 'hello@madocreatives.com';
    const phone        = settings?.phone        || '+33 (0) 1 23 45 67 89';
    const address      = settings?.address      || "12 Rue de l'Avenir, Paris";
    const tagline      = settings?.tagline      || 'An independent creative studio based in Paris, serving luxury brands worldwide with premium imagery and creative direction.';
    const siteName     = settings?.siteName     || 'Mado Creatives';
    const instagramUrl = settings?.instagramUrl || '#';
    const twitterUrl   = settings?.twitterUrl   || '#';
    const youtubeUrl   = settings?.youtubeUrl   || '#';

    const navLinks = [
        { href: '/',          label: 'Home' },
        { href: '/portfolio', label: 'Portfolio' },
        { href: '/services',  label: 'Services' },
        { href: '/team',      label: 'Team' },
        { href: '/shop',      label: 'Shop' },
        { href: '/blog',      label: 'Journal' },
        { href: '/contact',   label: 'Contact' },
    ];

    const socialLinks = [
        { href: instagramUrl,       icon: 'camera_alt',  label: 'Instagram' },
        { href: twitterUrl,         icon: 'tag',         label: 'Twitter' },
        { href: youtubeUrl,         icon: 'play_circle', label: 'YouTube' },
        { href: `mailto:${email}`, icon: 'mail',        label: 'Email' },
    ];

    return (
        <footer className="bg-[#111109] pt-20 pb-10 border-t border-white/5 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 text-white">
                    {/* Brand */}
                    <div className="md:col-span-5">
                        <Link href="/">
                            <img src="/logo.png" alt={siteName} className="h-14 w-auto object-contain mb-6 opacity-90" />
                        </Link>
                        <p className="text-slate-500 max-w-sm mb-8 leading-relaxed text-sm">{tagline}</p>
                        <div className="flex gap-3">
                            {socialLinks.map(s => (
                                <a key={s.label} href={s.href} aria-label={s.label}
                                    className="w-10 h-10 bg-white/5 border border-white/5 flex items-center justify-center hover:bg-[#ffc000] hover:text-[#0a0a08] hover:border-[#ffc000] transition-all text-slate-400">
                                    <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="md:col-span-3 md:col-start-7">
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/60">Navigation</h4>
                        <ul className="space-y-3">
                            {navLinks.map(l => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-slate-500 hover:text-[#ffc000] transition-colors text-sm">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-3">
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/60">Contact</h4>
                        <ul className="space-y-3">
                            <li className="text-slate-500 text-sm">{address}</li>
                            <li>
                                <a href={`mailto:${email}`} className="text-slate-500 hover:text-[#ffc000] transition-colors text-sm">{email}</a>
                            </li>
                            <li className="text-slate-500 text-sm">{phone}</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">
                        &copy; {new Date().getFullYear()} {siteName} Studio. All Rights Reserved.
                    </p>
                    <Link href="/admin" className="text-slate-700 hover:text-slate-500 text-xs transition-colors">
                        Admin
                    </Link>
                </div>
            </div>
        </footer>
    );
}
