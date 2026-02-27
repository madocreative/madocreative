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

/* ─── SVG brand icons ─── */
function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}
function TelegramIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
    );
}
function WhatsAppIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
    );
}

export default async function Footer() {
    const settings = await getSettings();

    const email        = settings?.email        || 'hello@madocreatives.com';
    const phone        = settings?.phone        || '+251 911 000 000';
    const address      = settings?.address      || 'Addis Ababa, Ethiopia';
    const tagline      = settings?.tagline      || 'An independent creative studio capturing stories that matter.';
    const siteName     = settings?.siteName     || 'Mado Creatives';
    const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/madocreatives';
    const youtubeUrl   = settings?.youtubeUrl   || 'https://youtube.com/@mado_creatives';
    const facebookUrl  = settings?.facebookUrl  || 'https://www.facebook.com/madocreatives';
    const telegramUrl  = settings?.telegramUrl  || 'https://t.me/mado_creatives';
    const whatsappUrl  = settings?.whatsappUrl  || 'https://whatsapp.com/channel/0029VbCPDBL1NCrUoC6L771C';
    const acceptingClients = settings?.acceptingClients ?? true;

    const workLinks = [
        { href: '/portfolio', label: 'Portfolio' },
        { href: '/services',  label: 'Services' },
        { href: '/shop',      label: 'Shop' },
        { href: '/blog',      label: 'Journal' },
    ];
    const studioLinks = [
        { href: '/team',     label: 'Our Team' },
        { href: '/booking',  label: 'Book a Session' },
        { href: '/contact',  label: 'Contact' },
        { href: '/',         label: 'Home' },
    ];

    const socials = [
        { href: instagramUrl, label: 'Instagram', icon: <span className="material-symbols-outlined text-[17px]">camera_alt</span> },
        { href: youtubeUrl,   label: 'YouTube',   icon: <span className="material-symbols-outlined text-[17px]">play_circle</span> },
        { href: facebookUrl,  label: 'Facebook',  icon: <FacebookIcon /> },
        { href: telegramUrl,  label: 'Telegram',  icon: <TelegramIcon /> },
        { href: whatsappUrl,  label: 'WhatsApp',  icon: <WhatsAppIcon /> },
        { href: `mailto:${email}`, label: 'Email', icon: <span className="material-symbols-outlined text-[17px]">mail</span> },
    ];

    return (
        <footer className="bg-[#0c0b07] mt-auto">

            {/* Gold gradient top rule */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ffc000]/50 to-transparent" />

            {/* ── Large wordmark strip ── */}
            <div className="border-b border-white/[0.04] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div>
                        <Link href="/">
                            <img src="/logo.png" alt={siteName}
                                className="h-10 md:h-14 w-auto object-contain mb-4 opacity-90" />
                        </Link>
                        <p className="text-[#4a4535] text-sm leading-relaxed max-w-sm">
                            {tagline}
                        </p>
                    </div>

                    {/* Accepting clients badge */}
                    {acceptingClients && (
                        <div className="inline-flex items-center gap-2 border border-[#ffc000]/20 bg-[#ffc000]/5 px-4 py-2 self-start sm:self-auto">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#22c55e]/80">
                                Accepting Clients
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Main grid ── */}
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6">

                    {/* Brand + social — spans 5 cols on lg */}
                    <div className="sm:col-span-2 lg:col-span-5">
                        {/* Social icons */}
                        <p className="text-[10px] uppercase tracking-[0.32em] text-[#3d3828] font-bold mb-5">
                            Follow Us
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {socials.map(s => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target={s.href.startsWith('mailto') ? undefined : '_blank'}
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="w-11 h-11 bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#5c5544] hover:bg-[#ffc000] hover:text-[#0a0a08] hover:border-[#ffc000] transition-all duration-200"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>

                        {/* WhatsApp CTA */}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 bg-[#25D366]/8 border border-[#25D366]/20 text-[#25D366] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-[#25D366] hover:text-[#0a0a08] transition-all duration-200"
                        >
                            <WhatsAppIcon />
                            Follow on WhatsApp
                        </a>
                    </div>

                    {/* Work links — spans 2 cols on lg */}
                    <div className="lg:col-span-2 lg:col-start-7">
                        <h4 className="text-[10px] uppercase tracking-[0.32em] text-[#3d3828] font-bold mb-5">Work</h4>
                        <ul className="space-y-3">
                            {workLinks.map(l => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="text-[#5c5544] hover:text-[#ffc000] transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-3 h-px bg-[#2a2618] group-hover:bg-[#ffc000]/50 group-hover:w-5 transition-all duration-200" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Studio links — spans 2 cols on lg */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[10px] uppercase tracking-[0.32em] text-[#3d3828] font-bold mb-5">Studio</h4>
                        <ul className="space-y-3">
                            {studioLinks.map(l => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="text-[#5c5544] hover:text-[#ffc000] transition-colors text-sm font-medium inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-3 h-px bg-[#2a2618] group-hover:bg-[#ffc000]/50 group-hover:w-5 transition-all duration-200" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact — spans 3 cols on lg */}
                    <div className="sm:col-span-2 lg:col-span-3">
                        <h4 className="text-[10px] uppercase tracking-[0.32em] text-[#3d3828] font-bold mb-5">Connect</h4>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-2.5 text-[#4a4535] text-sm leading-snug">
                                <span className="material-symbols-outlined text-[15px] text-[#3d3828] mt-0.5 flex-shrink-0">location_on</span>
                                {address}
                            </li>
                            <li>
                                <a href={`mailto:${email}`}
                                    className="flex items-center gap-2.5 text-[#4a4535] hover:text-[#ffc000] transition-colors text-sm">
                                    <span className="material-symbols-outlined text-[15px] text-[#3d3828] flex-shrink-0">mail</span>
                                    {email}
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${phone}`}
                                    className="flex items-center gap-2.5 text-[#4a4535] hover:text-[#ffc000] transition-colors text-sm">
                                    <span className="material-symbols-outlined text-[15px] text-[#3d3828] flex-shrink-0">phone</span>
                                    {phone}
                                </a>
                            </li>
                        </ul>

                        {/* Book CTA */}
                        <Link
                            href="/booking"
                            className="inline-flex items-center gap-2 bg-[#ffc000] text-[#0a0a08] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-white transition-colors"
                        >
                            Book a Session
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div className="border-t border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[#2a2618] text-[11px] font-bold uppercase tracking-[0.28em] text-center sm:text-left">
                        &copy; {new Date().getFullYear()} {siteName} Studio &middot; All Rights Reserved
                    </p>
                    <Link href="/admin"
                        className="text-[#1e1c14] hover:text-[#3d3828] text-[11px] uppercase tracking-[0.24em] transition-colors">
                        Admin
                    </Link>
                </div>
            </div>
        </footer>
    );
}
