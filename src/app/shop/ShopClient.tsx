'use client';

import { useState } from 'react';
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

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function ShopClient({ products }: { products: Product[] }) {
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = activeCategory === 'All'
        ? products
        : products.filter(p => (p.category || 'Other') === activeCategory);

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
            {/* Intro */}
            <div className="pt-12 pb-10 border-b border-white/5">
                <p className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
                    Premium electronics for creators, professionals, and modern users.
                    Authentic products with warranty support — available in Addis Ababa, Kigali, Nairobi & Dubai.
                </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-2 flex-wrap pt-8 pb-10">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all border
                            ${activeCategory === cat
                                ? 'bg-[#ffc000] text-[#0a0a08] border-[#ffc000]'
                                : 'bg-transparent text-slate-400 border-white/10 hover:border-[#ffc000]/40 hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[14px]">{CATEGORY_ICONS[cat]}</span>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Count */}
            <div className="mb-8 flex items-center justify-between">
                <p className="text-slate-600 text-sm uppercase tracking-widest font-bold">
                    {filtered.length} {filtered.length === 1 ? 'Item' : 'Items'}
                    {activeCategory !== 'All' && <span className="text-[#ffc000] ml-2">/ {activeCategory}</span>}
                </p>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="py-32 text-center border border-white/5"
                >
                    <span className="material-symbols-outlined text-5xl text-slate-700 mb-5 block">inventory_2</span>
                    <p className="text-xl text-slate-500 font-display uppercase tracking-wider mb-2">
                        No items in this category yet
                    </p>
                    <p className="text-sm text-slate-600">New stock arriving soon — contact us to inquire.</p>
                </motion.div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1"
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map((product, index) => (
                            <motion.div
                                key={product._id}
                                layout
                                variants={fadeUp}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: index * 0.04 }}
                                className="group cursor-default"
                            >
                                {/* Image */}
                                <div className="aspect-[4/5] relative overflow-hidden bg-[#111109]">
                                    <img
                                        src={product.images[0] || 'https://placehold.co/600x800/111109/ffc000?text=No+Image'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />

                                    {!product.inStock && (
                                        <div className="absolute inset-0 bg-[#0a0a08]/80 flex items-center justify-center">
                                            <span className="text-white font-bold uppercase tracking-widest text-sm border border-white/30 px-5 py-2">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}

                                    {product.category && (
                                        <div className="absolute top-4 left-4 bg-[#0a0a08]/80 text-[#ffc000] text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 border border-[#ffc000]/20">
                                            {product.category}
                                        </div>
                                    )}
                                </div>

                                {/* Info Bar */}
                                <div className="bg-[#111109] px-5 py-4 border-t border-white/5">
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                        <h3 className="text-base font-bold font-display group-hover:text-[#ffc000] transition-colors uppercase leading-tight flex-1 min-w-0">
                                            {product.name}
                                        </h3>
                                        <div className="text-lg font-bold text-[#ffc000] whitespace-nowrap shrink-0">
                                            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>

                                    {product.inStock ? (
                                        <Link
                                            href={`/contact?inquiry=shop&product=${encodeURIComponent(product.name)}`}
                                            className="block w-full text-center py-3 font-bold uppercase tracking-widest text-sm transition-all
                                                bg-white text-[#0a0a08] hover:bg-[#ffc000]"
                                        >
                                            Inquire to Buy
                                        </Link>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full py-3 font-bold uppercase tracking-widest text-sm bg-white/10 text-slate-600 cursor-not-allowed"
                                        >
                                            Out of Stock
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Trust Badges */}
            <div className="mt-20 pt-14 border-t border-white/5">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-14">
                    {[
                        { icon: 'verified', label: 'Authentic & Verified' },
                        { icon: 'local_shipping', label: 'Fast Delivery' },
                        { icon: 'support_agent', label: 'After-Sales Support' },
                        { icon: 'price_check', label: 'Competitive Pricing' },
                        { icon: 'location_on', label: '4 Country Presence' },
                        { icon: 'security', label: 'Warranty Support' },
                    ].map((badge, i) => (
                        <div key={i} className="flex flex-col items-center text-center gap-2">
                            <span className="material-symbols-outlined text-[#ffc000] text-2xl">{badge.icon}</span>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{badge.label}</p>
                        </div>
                    ))}
                </div>

                {/* Bulk Orders CTA */}
                <div className="bg-[#111109] border border-white/5 p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.3em] text-xs mb-2">Bulk & Corporate Orders</p>
                        <h3 className="text-2xl md:text-3xl font-display font-extrabold uppercase text-white leading-tight">
                            Offices. Schools. Studios. Businesses.
                        </h3>
                        <p className="text-slate-500 text-sm mt-2">
                            Special pricing for bulk orders — contact us to get a custom quote.
                        </p>
                    </div>
                    <Link
                        href="/contact?inquiry=bulk-order"
                        className="shrink-0 inline-flex items-center gap-3 bg-[#ffc000] text-[#0a0a08] px-8 py-4 font-bold uppercase tracking-wider text-sm hover:brightness-110 transition-all"
                    >
                        <span className="material-symbols-outlined text-[18px]">inventory</span>
                        Request a Quote
                    </Link>
                </div>
            </div>
        </div>
    );
}
