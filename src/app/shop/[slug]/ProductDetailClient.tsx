'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
    _id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    category: string;
    images: string[];
    inStock: boolean;
}

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
    );
}

function stripHtml(html: string): string {
    if (!html) return '';
    let text = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
    text = text.replace(/<\/?(p|div|br|li|h[1-6]|article|section)[^>]*>/gi, '\n');
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '');
    text = text.replace(/\n{3,}/g, '\n\n').trim();
    return text;
}

function isHtml(str: string): boolean {
    return /<[a-z][\s\S]*>/i.test(str);
}

export default function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
    const [activeImg, setActiveImg] = useState(0);
    const [lightbox, setLightbox] = useState(false);

    const images = product.images.length > 0
        ? product.images
        : ['https://placehold.co/800x800/111109/ffc000?text=No+Image'];

    const description = isHtml(product.description) ? stripHtml(product.description) : product.description;

    const waMessage = encodeURIComponent(`Hi Mado Creatives! I'm interested in: *${product.name}* — Price: $${product.price.toLocaleString()}. Please share more details.`);

    return (
        <div className="bg-[var(--app-bg)] min-h-screen text-[var(--app-text)] pt-[104px] md:pt-[116px] px-3 md:px-5">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-2">
                <nav className="flex items-center gap-2 text-xs text-slate-500">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-[#ffc000]">{product.name}</span>
                </nav>
            </div>

            {/* Main Product Section */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 rounded-[1.55rem] border border-[var(--app-border)] bg-[#0a0a08]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

                    {/* ── Left: Image Gallery ── */}
                    <div className="flex flex-col gap-4">
                        {/* Main Image */}
                        <div
                            className="relative aspect-square bg-[#111109] border border-white/5 overflow-hidden cursor-zoom-in group"
                            onClick={() => setLightbox(true)}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImg}
                                    src={images[activeImg]}
                                    alt={product.name}
                                    initial={{ opacity: 0, scale: 1.03 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full object-contain p-4"
                                />
                            </AnimatePresence>
                            {/* Zoom hint */}
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 border border-white/10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-[12px]">zoom_in</span>
                                Click to zoom
                            </div>
                            {!product.inStock && (
                                <div className="absolute inset-0 bg-[#0a0a08]/60 flex items-center justify-center">
                                    <span className="text-white font-bold uppercase tracking-widest border border-white/30 px-6 py-2">Out of Stock</span>
                                </div>
                            )}
                            {/* Image counter */}
                            {images.length > 1 && (
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 border border-white/10">
                                    {activeImg + 1} / {images.length}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImg(i)}
                                        className={`shrink-0 w-16 h-16 border-2 transition-all overflow-hidden bg-[#111109] ${i === activeImg ? 'border-[#ffc000]' : 'border-white/10 hover:border-white/30'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain p-1" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Prev/Next nav for mobile */}
                        {images.length > 1 && (
                            <div className="flex items-center justify-center gap-3 lg:hidden">
                                <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                                    className="w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#ffc000] hover:text-[#0a0a08] hover:border-[#ffc000] transition-all">
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                </button>
                                <div className="flex gap-1.5">
                                    {images.map((_, i) => (
                                        <button key={i} onClick={() => setActiveImg(i)}
                                            className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? 'bg-[#ffc000] scale-125' : 'bg-white/20'}`} />
                                    ))}
                                </div>
                                <button onClick={() => setActiveImg(i => (i + 1) % images.length)}
                                    className="w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#ffc000] hover:text-[#0a0a08] hover:border-[#ffc000] transition-all">
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Right: Product Info ── */}
                    <div className="flex flex-col gap-5">
                        {/* Category badge */}
                        <div>
                            <Link href={`/shop?category=${encodeURIComponent(product.category)}`}
                                className="inline-flex items-center gap-1.5 text-[#ffc000] text-[10px] font-bold uppercase tracking-[0.3em] hover:underline">
                                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                                {product.category}
                            </Link>
                        </div>

                        {/* Name */}
                        <h1 className="text-3xl md:text-4xl font-display font-extrabold uppercase text-white leading-tight">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-[#ffc000]">
                                ${product.price.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                            </span>
                        </div>

                        {/* Stock */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs font-bold uppercase tracking-widest w-fit ${product.inStock ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </div>

                        {/* Description */}
                        {description && (
                            <div className="border-t border-white/5 pt-5">
                                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{description}</p>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            {product.inStock ? (
                                <>
                                    <a
                                        href={`https://wa.me/?text=${waMessage}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all"
                                    >
                                        <WhatsAppIcon />
                                        Inquire via WhatsApp
                                    </a>
                                    <Link
                                        href={`/contact?inquiry=shop&product=${encodeURIComponent(product.name)}`}
                                        className="flex-1 flex items-center justify-center gap-2 bg-[#ffc000] text-[#0a0a08] py-4 font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">mail</span>
                                        Contact Us
                                    </Link>
                                </>
                            ) : (
                                <button disabled className="w-full py-4 font-bold uppercase tracking-widest text-sm bg-white/5 text-slate-600 cursor-not-allowed border border-white/5">
                                    Out of Stock — Contact Us
                                </button>
                            )}
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-2 pt-2">
                            {[
                                { icon: 'verified', label: 'Authentic' },
                                { icon: 'security', label: 'Warranty' },
                                { icon: 'support_agent', label: '24/7 Support' },
                            ].map((b, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 py-3 bg-[#111109] border border-white/5 text-center">
                                    <span className="material-symbols-outlined text-[#ffc000] text-[18px]">{b.icon}</span>
                                    <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">{b.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Back to shop */}
                        <Link href="/shop"
                            className="inline-flex items-center gap-1.5 text-slate-500 text-xs hover:text-white transition-colors mt-1">
                            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                            Back to Shop
                        </Link>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <div className="mt-20 border-t border-white/5 pt-12">
                        <h2 className="text-xl font-display font-extrabold uppercase text-white mb-6 tracking-wider">
                            More in <span className="text-[#ffc000]">{product.category}</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5">
                            {related.map(p => (
                                <Link key={p._id} href={`/shop/${p.slug}`}
                                    className="group bg-[#0a0a08] flex flex-col hover:bg-[#0d0d0b] transition-colors">
                                    <div className="aspect-square overflow-hidden bg-[#111109]">
                                        <img src={p.images[0] || 'https://placehold.co/400x400/111109/ffc000?text=No+Image'}
                                            alt={p.name}
                                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="px-3 py-3 border-t border-white/5">
                                        <p className="text-white text-xs font-bold leading-snug line-clamp-2 group-hover:text-[#ffc000] transition-colors mb-1">{p.name}</p>
                                        <p className="text-[#ffc000] font-bold text-sm">${p.price.toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                        onClick={() => setLightbox(false)}
                    >
                        <motion.img
                            key={activeImg}
                            src={images[activeImg]}
                            alt={product.name}
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="max-w-[90vw] max-h-[90vh] object-contain"
                            onClick={e => e.stopPropagation()}
                        />
                        <button onClick={() => setLightbox(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        {images.length > 1 && (
                            <>
                                <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + images.length) % images.length); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-2xl">chevron_left</span>
                                </button>
                                <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % images.length); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-2xl">chevron_right</span>
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
