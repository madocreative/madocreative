'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Smartphones', 'Laptops & Computers', 'Cameras & Equipment', 'Audio & Gadgets'];

const CATEGORY_ICONS: Record<string, string> = {
    'All': 'storefront',
    'Smartphones': 'smartphone',
    'Laptops & Computers': 'laptop',
    'Cameras & Equipment': 'photo_camera',
    'Audio & Gadgets': 'headphones',
};

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    images: string[];
    inStock: boolean;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc';

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
    );
}

export default function ShopClient({ products }: { products: Product[] }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [sort, setSort] = useState<SortOption>('newest');
    const [search, setSearch] = useState('');
    const [quickView, setQuickView] = useState<Product | null>(null);

    const filtered = useMemo(() => {
        let items = activeCategory === 'All'
            ? products
            : products.filter(p => (p.category || 'Other') === activeCategory);

        if (search.trim()) {
            const q = search.toLowerCase();
            items = items.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }

        if (sort === 'price-asc') return [...items].sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') return [...items].sort((a, b) => b.price - a.price);
        return items;
    }, [products, activeCategory, search, sort]);

    const whatsappInquiry = (product: Product) => {
        const msg = encodeURIComponent(`Hi Mado Creatives! I'm interested in: *${product.name}* (Price: $${product.price.toLocaleString()}). Please share more details.`);
        return `https://whatsapp.com/channel/0029VbCPDBL1NCrUoC6L771C`;
    };

    return (
        <div className="bg-[#0a0a08] text-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-20">

                {/* Search + Sort bar */}
                <div className="py-6 border-b border-white/5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">search</span>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full bg-[#111109] border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#ffc000]/50 focus:outline-none transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-600 text-xs uppercase tracking-widest font-bold">Sort:</span>
                        {([
                            { value: 'newest', label: 'Newest' },
                            { value: 'price-asc', label: 'Price ↑' },
                            { value: 'price-desc', label: 'Price ↓' },
                        ] as { value: SortOption; label: string }[]).map(opt => (
                            <button key={opt.value} onClick={() => setSort(opt.value)}
                                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${sort === opt.value ? 'bg-[#ffc000] text-[#0a0a08] border-[#ffc000]' : 'border-white/10 text-slate-500 hover:text-white hover:border-white/30'}`}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category chips */}
                <div className="flex gap-2 flex-wrap py-5 border-b border-white/5">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all border
                                ${activeCategory === cat
                                    ? 'bg-[#ffc000] text-[#0a0a08] border-[#ffc000]'
                                    : 'bg-transparent text-slate-500 border-white/10 hover:border-white/30 hover:text-white'}`}>
                            <span className="material-symbols-outlined text-[13px]">{CATEGORY_ICONS[cat]}</span>
                            {cat}
                        </button>
                    ))}
                    <span className="ml-auto self-center text-slate-600 text-xs uppercase tracking-widest font-bold">
                        {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                {/* Product Grid — marketplace style, compact cards */}
                {filtered.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="py-24 text-center border border-white/5 mt-8">
                        <span className="material-symbols-outlined text-4xl text-slate-700 mb-4 block">inventory_2</span>
                        <p className="text-lg text-slate-500 font-display uppercase tracking-wider mb-1">
                            {search ? 'No results found' : 'No items in this category'}
                        </p>
                        <p className="text-sm text-slate-600">
                            {search ? 'Try a different search term.' : 'New stock arriving soon — contact us to inquire.'}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div layout
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px mt-px bg-white/5">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((product, index) => (
                                <motion.div key={product._id} layout
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
                                    className="group bg-[#0a0a08] cursor-pointer flex flex-col"
                                    onClick={() => setQuickView(product)}
                                >
                                    {/* Image — square, compact */}
                                    <div className="aspect-square relative overflow-hidden bg-[#111109]">
                                        <img
                                            src={product.images[0] || 'https://placehold.co/400x400/111109/ffc000?text=No+Image'}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                                        />
                                        {!product.inStock && (
                                            <div className="absolute inset-0 bg-[#0a0a08]/70 flex items-center justify-center">
                                                <span className="text-white text-[10px] font-bold uppercase tracking-widest border border-white/30 px-3 py-1">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                        {product.inStock && (
                                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500" title="In Stock" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="px-3 py-2.5 flex flex-col gap-1.5 flex-1 bg-[#0d0d0b] border-t border-white/5">
                                        <p className="text-[#ffc000] text-[9px] font-bold uppercase tracking-widest">{product.category}</p>
                                        <h3 className="text-white text-xs font-bold leading-snug line-clamp-2 group-hover:text-[#ffc000] transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between mt-auto pt-1">
                                            <span className="text-[#ffc000] font-bold text-sm">
                                                ${product.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                            </span>
                                            <span className="material-symbols-outlined text-slate-600 text-[14px] group-hover:text-[#ffc000] transition-colors">chevron_right</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Trust Badges */}
                <div className="mt-16 pt-10 border-t border-white/5">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12">
                        {[
                            { icon: 'verified', label: 'Authentic' },
                            { icon: 'local_shipping', label: 'Fast Delivery' },
                            { icon: 'support_agent', label: 'Support' },
                            { icon: 'price_check', label: 'Best Price' },
                            { icon: 'location_on', label: '4 Countries' },
                            { icon: 'security', label: 'Warranty' },
                        ].map((badge, i) => (
                            <div key={i} className="flex flex-col items-center text-center gap-1.5 py-4 bg-[#111109] border border-white/5">
                                <span className="material-symbols-outlined text-[#ffc000] text-xl">{badge.icon}</span>
                                <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">{badge.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Bulk + WhatsApp CTA row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                        <div className="bg-[#111109] p-8">
                            <p className="text-[#ffc000] font-bold uppercase tracking-[0.3em] text-xs mb-2">Bulk & Corporate Orders</p>
                            <h3 className="text-xl font-display font-extrabold uppercase text-white leading-tight mb-3">
                                Offices. Schools. Studios.
                            </h3>
                            <p className="text-slate-500 text-sm mb-5">
                                Special pricing for bulk orders — contact us for a custom quote.
                            </p>
                            <Link href="/contact?inquiry=bulk-order"
                                className="inline-flex items-center gap-2 bg-[#ffc000] text-[#0a0a08] px-6 py-3 font-bold uppercase tracking-wider text-xs hover:brightness-110 transition-all">
                                <span className="material-symbols-outlined text-[16px]">inventory</span>
                                Request a Quote
                            </Link>
                        </div>
                        <div className="bg-[#0d1a12] p-8">
                            <p className="text-[#25D366] font-bold uppercase tracking-[0.3em] text-xs mb-2">Quick Inquiry</p>
                            <h3 className="text-xl font-display font-extrabold uppercase text-white leading-tight mb-3">
                                Chat with us on WhatsApp
                            </h3>
                            <p className="text-slate-500 text-sm mb-5">
                                Get instant answers about availability, pricing, and delivery. We respond within minutes.
                            </p>
                            <a href="https://whatsapp.com/channel/0029VbCPDBL1NCrUoC6L771C" target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 font-bold uppercase tracking-wider text-xs hover:brightness-110 transition-all">
                                <WhatsAppIcon />
                                Follow on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick-View Lightbox */}
            <AnimatePresence>
                {quickView && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8"
                        onClick={() => setQuickView(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.25 }}
                            className="bg-[#111109] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}>

                            {/* Image */}
                            <div className="aspect-[4/3] bg-[#0a0a08] relative overflow-hidden">
                                <img
                                    src={quickView.images[0] || 'https://placehold.co/600x450/111109/ffc000?text=No+Image'}
                                    alt={quickView.name}
                                    className="w-full h-full object-contain"
                                />
                                {quickView.category && (
                                    <div className="absolute top-4 left-4 bg-[#0a0a08]/80 text-[#ffc000] text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 border border-[#ffc000]/20">
                                        {quickView.category}
                                    </div>
                                )}
                                {!quickView.inStock && (
                                    <div className="absolute inset-0 bg-[#0a0a08]/60 flex items-center justify-center">
                                        <span className="text-white font-bold uppercase tracking-widest border border-white/30 px-6 py-2">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-6 md:p-8">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <h2 className="text-xl font-bold font-display uppercase leading-tight flex-1">{quickView.name}</h2>
                                    <span className="text-2xl font-bold text-[#ffc000] shrink-0">
                                        ${quickView.price.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                    </span>
                                </div>

                                {quickView.description && (
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{quickView.description}</p>
                                )}

                                <div className="flex items-center gap-2 mb-6">
                                    <div className={`w-2 h-2 rounded-full ${quickView.inStock ? 'bg-green-500' : 'bg-red-500/70'}`} />
                                    <span className={`text-xs font-bold uppercase tracking-widest ${quickView.inStock ? 'text-green-400' : 'text-slate-500'}`}>
                                        {quickView.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {quickView.inStock ? (
                                        <>
                                            {/* WhatsApp inquiry */}
                                            <a href={`https://wa.me/?text=${encodeURIComponent(`Hi Mado Creatives! I'm interested in: *${quickView.name}* — Price: $${quickView.price.toLocaleString()}. Please share more details.`)}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="sm:col-span-2 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all">
                                                <WhatsAppIcon />
                                                Inquire via WhatsApp
                                            </a>
                                            {/* Contact page inquiry */}
                                            <Link href={`/contact?inquiry=shop&product=${encodeURIComponent(quickView.name)}`}
                                                className="flex items-center justify-center gap-2 bg-[#ffc000] text-[#0a0a08] py-3 font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all">
                                                Contact Us
                                            </Link>
                                        </>
                                    ) : (
                                        <button disabled
                                            className="sm:col-span-3 py-3 font-bold uppercase tracking-widest text-xs bg-white/5 text-slate-600 cursor-not-allowed">
                                            Out of Stock
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Close */}
                            <button onClick={() => setQuickView(null)}
                                className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
