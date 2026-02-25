import dbConnect from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import Product from '@/models/Product';
import Post from '@/models/Post';
import Booking from '@/models/Booking';
import Contact from '@/models/Contact';
import Link from 'next/link';

export default async function AdminWelcomePage() {
    await dbConnect();
    const [galleries, products, posts, bookings, contacts] = await Promise.all([
        Gallery.countDocuments(),
        Product.countDocuments(),
        Post.countDocuments(),
        Booking.countDocuments(),
        Contact.countDocuments(),
    ]);

    const stats = [
        { label: 'Galleries', value: galleries, icon: 'photo_library', color: 'text-purple-400', bg: 'bg-purple-500/10', href: '/admin/galleries' },
        { label: 'Products', value: products, icon: 'storefront', color: 'text-green-400', bg: 'bg-green-500/10', href: '/admin/shop' },
        { label: 'Blog Posts', value: posts, icon: 'edit_note', color: 'text-orange-400', bg: 'bg-orange-500/10', href: '/admin/blog' },
        { label: 'Bookings', value: bookings, icon: 'event', color: 'text-[#ffc000]', bg: 'bg-[#ffc000]/10', href: '/admin/bookings' },
        { label: 'Messages', value: contacts, icon: 'mail', color: 'text-blue-400', bg: 'bg-blue-500/10', href: '/admin/contacts' },
    ];

    const quickActions = [
        { href: '/admin/pages', icon: 'article', label: 'Manage Pages', desc: 'Edit website copy and sections.' },
        { href: '/admin/galleries', icon: 'add_photo_alternate', label: 'Upload to Portfolio', desc: 'Add new visual case studies.' },
        { href: '/admin/shop', icon: 'add_shopping_cart', label: 'Add Product', desc: 'Manage store inventory.' },
        { href: '/admin/blog', icon: 'post_add', label: 'New Blog Post', desc: 'Publish Journal entries.' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-12">
            {/* Header Area */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111109] to-[#1a1812] border border-white/5 p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffc000]/10 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 transition-all hover:bg-white/10">
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
            </div>

            {/* Stats Overview */}
            <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-slate-700" /> Platform Overview
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {stats.map(s => (
                        <Link key={s.label} href={s.href}
                            className="relative group bg-[#111109] border border-white/5 rounded-2xl p-6 hover:border-[#ffc000]/30 transition-all duration-500 overflow-hidden hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(255,192,0,0.15)] flex flex-col justify-between min-h-[140px]">

                            {/* Hover Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#ffc000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex justify-between items-start">
                                <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center border border-white/5 shadow-inner`}>
                                    <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 text-[18px] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">arrow_forward</span>
                            </div>

                            <div className="relative z-10 mt-6">
                                <h3 className={`text-4xl font-display font-extrabold text-white mb-1 group-hover:${s.color} transition-colors duration-300`}>{s.value}</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-slate-700" /> Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map(a => (
                        <Link key={a.href} href={a.href}
                            className="group flex items-start gap-5 p-6 rounded-2xl bg-[#111109] border border-white/5 hover:border-[#ffc000]/40 transition-all duration-300 hover:bg-[#1a1812]">
                            <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 group-hover:text-[#0a0a08] group-hover:bg-[#ffc000] flex items-center justify-center transition-all duration-500 shrink-0">
                                <span className="material-symbols-outlined text-[24px]">{a.icon}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-[#ffc000] transition-colors">{a.label}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{a.desc}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 group-hover:text-[#ffc000] group-hover:translate-x-1 transition-all">arrow_forward</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
