import dbConnect from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import Product from '@/models/Product';
import Post from '@/models/Post';
import Booking from '@/models/Booking';
import Contact from '@/models/Contact';
import Link from 'next/link';

const STATUS_COLOR: Record<string, string> = {
    pending:   'bg-[#ffc000]/10 text-[#ffc000] border-[#ffc000]/20',
    confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
    cancelled: 'bg-red-500/10  text-red-400  border-red-500/20',
};

const INQUIRY_COLOR: Record<string, string> = {
    general:     'bg-blue-500/10  text-blue-400   border-blue-500/20',
    project:     'bg-[#ffc000]/10 text-[#ffc000]  border-[#ffc000]/20',
    press:       'bg-purple-500/10 text-purple-400 border-purple-500/20',
    careers:     'bg-green-500/10 text-green-400  border-green-500/20',
    shop:        'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'bulk-order':'bg-cyan-500/10  text-cyan-400   border-cyan-500/20',
};

export default async function AdminWelcomePage() {
    await dbConnect();

    const [galleries, products, posts, totalBookings, totalContacts,
           pendingCount, unreadCount, recentBookings, recentMessages] = await Promise.all([
        Gallery.countDocuments(),
        Product.countDocuments(),
        Post.countDocuments(),
        Booking.countDocuments(),
        Contact.countDocuments(),
        Booking.countDocuments({ status: 'pending' }),
        Contact.countDocuments({ read: false }),
        Booking.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(5).lean(),
        Contact.find({ read: false }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const stats = [
        { label: 'Galleries',  value: galleries,      icon: 'photo_library',     color: 'text-purple-400', bg: 'bg-purple-500/10', href: '/admin/galleries' },
        { label: 'Products',   value: products,       icon: 'storefront',         color: 'text-green-400',  bg: 'bg-green-500/10',  href: '/admin/shop' },
        { label: 'Blog Posts', value: posts,          icon: 'edit_note',          color: 'text-orange-400', bg: 'bg-orange-500/10', href: '/admin/blog' },
        { label: 'Bookings',   value: totalBookings,  icon: 'event',              color: 'text-[#ffc000]',  bg: 'bg-[#ffc000]/10',  href: '/admin/bookings',  badge: pendingCount > 0 ? `${pendingCount} pending` : null },
        { label: 'Messages',   value: totalContacts,  icon: 'mail',               color: 'text-blue-400',   bg: 'bg-blue-500/10',   href: '/admin/contacts',  badge: unreadCount  > 0 ? `${unreadCount} unread`  : null },
    ];

    const quickActions = [
        { href: '/admin/pages',    icon: 'article',            label: 'Manage Pages',       desc: 'Edit website copy and sections.' },
        { href: '/admin/galleries',icon: 'add_photo_alternate',label: 'Upload to Portfolio', desc: 'Add new visual case studies.' },
        { href: '/admin/shop',     icon: 'add_shopping_cart',  label: 'Add Product',         desc: 'Manage store inventory.' },
        { href: '/admin/blog',     icon: 'post_add',           label: 'New Blog Post',       desc: 'Publish Journal entries.' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-12">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-[#111109] border border-white/5 p-8 md:p-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffc000]/10 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-300">System Online</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white leading-tight mb-2 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-lg text-slate-400 font-light max-w-xl">
                        Command central for Mado Creatives. Manage your global presence, portfolio, and shop inventory.
                    </p>
                </div>
            </div>

            {/* ── Stats ──────────────────────────────────────────────────────── */}
            <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-slate-700" /> Platform Overview
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {stats.map(s => (
                        <Link key={s.label} href={s.href}
                            className="relative group bg-[#111109] border border-white/5 p-5 hover:border-[#ffc000]/30 transition-all duration-300 overflow-hidden hover:-translate-y-0.5 flex flex-col justify-between min-h-[130px]">
                            <div className="flex justify-between items-start">
                                <div className={`w-9 h-9 ${s.bg} ${s.color} flex items-center justify-center border border-white/5`}>
                                    <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                                </div>
                                {s.badge && (
                                    <span className="text-[8px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-[#ffc000] text-[#0a0a08]">
                                        {s.badge}
                                    </span>
                                )}
                            </div>
                            <div className="mt-4">
                                <h3 className="text-3xl font-display font-extrabold text-white mb-0.5">{s.value}</h3>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Recent Activity ────────────────────────────────────────────── */}
            <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-slate-700" /> Recent Activity
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Pending Bookings */}
                    <div className="bg-[#111109] border border-white/5 flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#ffc000] text-[16px]">event</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-white">Pending Bookings</span>
                                {pendingCount > 0 && (
                                    <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-[#ffc000] text-[#0a0a08]">
                                        {pendingCount}
                                    </span>
                                )}
                            </div>
                            <Link href="/admin/bookings"
                                className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#ffc000] transition-colors flex items-center gap-1">
                                View all <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                            </Link>
                        </div>

                        {recentBookings.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                                <span className="material-symbols-outlined text-[32px] text-slate-700 mb-2">event_available</span>
                                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">No pending bookings</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {recentBookings.map((b: any) => (
                                    <div key={String(b._id)} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group">
                                        <div className="w-8 h-8 shrink-0 bg-[#ffc000]/10 border border-[#ffc000]/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[#ffc000] text-[13px]">person</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-bold truncate">{b.name}</p>
                                            <p className="text-slate-500 text-xs truncate">{b.package} · {b.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 border ${STATUS_COLOR[b.status] || 'bg-white/5 text-slate-400 border-white/10'}`}>
                                                {b.status}
                                            </span>
                                            <Link href="/admin/bookings"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-slate-500 hover:text-[#ffc000] text-[14px] transition-colors">open_in_new</span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Unread Messages */}
                    <div className="bg-[#111109] border border-white/5 flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400 text-[16px]">mail</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-white">Unread Messages</span>
                                {unreadCount > 0 && (
                                    <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-blue-500 text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <Link href="/admin/contacts"
                                className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#ffc000] transition-colors flex items-center gap-1">
                                View all <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                            </Link>
                        </div>

                        {recentMessages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                                <span className="material-symbols-outlined text-[32px] text-slate-700 mb-2">mark_email_read</span>
                                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">All caught up</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {recentMessages.map((c: any) => {
                                    const badge = INQUIRY_COLOR[c.inquiryType] || 'bg-white/5 text-slate-400 border-white/10';
                                    return (
                                        <div key={String(c._id)} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group relative">
                                            {/* Unread stripe */}
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#ffc000]" />
                                            <div className="w-8 h-8 shrink-0 bg-[#ffc000]/10 border border-[#ffc000]/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[#ffc000] text-[13px]">mail</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <p className="text-white text-sm font-bold truncate">{c.name}</p>
                                                    <span className="text-[7px] uppercase font-bold tracking-widest px-1 py-0.5 bg-[#ffc000] text-[#0a0a08]">New</span>
                                                </div>
                                                <p className="text-slate-500 text-xs truncate">{c.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 border hidden sm:block ${badge}`}>
                                                    {c.inquiryType}
                                                </span>
                                                <Link href="/admin/contacts"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-slate-500 hover:text-[#ffc000] text-[14px] transition-colors">open_in_new</span>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Quick Actions ──────────────────────────────────────────────── */}
            <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-slate-700" /> Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickActions.map(a => (
                        <Link key={a.href} href={a.href}
                            className="group flex items-start gap-5 p-6 bg-[#111109] border border-white/5 hover:border-[#ffc000]/40 transition-all duration-300 hover:bg-[#1a1812]">
                            <div className="w-10 h-10 bg-white/5 text-slate-400 group-hover:text-[#0a0a08] group-hover:bg-[#ffc000] flex items-center justify-center transition-all duration-300 shrink-0">
                                <span className="material-symbols-outlined text-[20px]">{a.icon}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white text-sm mb-0.5 group-hover:text-[#ffc000] transition-colors uppercase tracking-wide">{a.label}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 group-hover:text-[#ffc000] group-hover:translate-x-1 transition-all text-[18px] shrink-0 mt-0.5">arrow_forward</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
