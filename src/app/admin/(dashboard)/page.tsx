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
        { label: 'Galleries',  value: galleries, icon: 'photo_library', color: 'text-purple-400',   bg: 'bg-purple-500/10', href: '/admin/galleries' },
        { label: 'Products',   value: products,  icon: 'storefront',    color: 'text-green-400',    bg: 'bg-green-500/10',  href: '/admin/shop' },
        { label: 'Blog Posts', value: posts,     icon: 'edit_note',     color: 'text-orange-400',   bg: 'bg-orange-500/10', href: '/admin/blog' },
        { label: 'Bookings',   value: bookings,  icon: 'event',         color: 'text-[#ffc000]',    bg: 'bg-[#ffc000]/10',  href: '/admin/bookings' },
        { label: 'Messages',   value: contacts,  icon: 'mail',          color: 'text-blue-400',     bg: 'bg-blue-500/10',   href: '/admin/contacts' },
    ];

    const quickActions = [
        { href: '/admin/pages/home',     icon: 'edit_document',     label: 'Edit Homepage' },
        { href: '/admin/pages/services', icon: 'design_services',   label: 'Edit Services' },
        { href: '/admin/pages/team',     icon: 'group',             label: 'Edit Team' },
        { href: '/admin/galleries',      icon: 'add_photo_alternate', label: 'Upload Portfolio' },
        { href: '/admin/shop',           icon: 'add_shopping_cart', label: 'Add Product' },
        { href: '/admin/blog',           icon: 'post_add',          label: 'New Blog Post' },
    ];

    return (
        <div className="max-w-5xl">
            <h1 className="text-4xl font-display font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-slate-400 mb-10">Manage your website content from this dashboard.</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                {stats.map(s => (
                    <Link key={s.label} href={s.href}
                        className="bg-[#1a1812] border border-white/10 p-5 rounded-xl hover:border-[#ffc000]/40 transition-all group">
                        <div className={`w-9 h-9 ${s.bg} ${s.color} rounded-lg flex items-center justify-center mb-3`}>
                            <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                        </div>
                        <h3 className={`text-3xl font-bold ${s.color} mb-0.5`}>{s.value}</h3>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{s.label}</p>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1a1812] border border-white/10 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-white/10">
                    <h3 className="text-base font-bold text-white">Quick Actions</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickActions.map(a => (
                        <Link key={a.href} href={a.href}
                            className="flex items-center justify-between p-4 rounded-lg bg-[#221e10] border border-white/5 hover:border-[#ffc000]/40 transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-[#ffc000] transition-colors text-[20px]">{a.icon}</span>
                                <span className="font-medium text-white text-sm">{a.label}</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 text-[18px]">arrow_forward</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
