'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    galleries: any[];
    allMediaUrls: string[];
    heroTitle?: string;
    heroLabel?: string;
}

export default function PortfolioClient({ galleries, allMediaUrls, heroTitle, heroLabel }: Props) {
    const [lightbox, setLightbox] = useState<{ imgs: string[]; idx: number } | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const allGalleryImages = galleries.flatMap((g: any) => [g.featuredImage, ...(g.images || [])].filter(Boolean));
    const heroImgs = (allGalleryImages.length > 0 ? allGalleryImages : allMediaUrls).slice(0, 5);

    const categories = ['All', ...Array.from(new Set(galleries.map((g: any) => g.category).filter(Boolean)))];
    const filteredGalleries = activeCategory === 'All' ? galleries : galleries.filter((g: any) => g.category === activeCategory);

    const openLightbox = (imgs: string[], idx: number) => setLightbox({ imgs, idx });
    const closeLightbox = () => setLightbox(null);
    const prev = () => lightbox && setLightbox({ ...lightbox, idx: (lightbox.idx - 1 + lightbox.imgs.length) % lightbox.imgs.length });
    const next = () => lightbox && setLightbox({ ...lightbox, idx: (lightbox.idx + 1) % lightbox.imgs.length });

    return (
        <div className="bg-[#090805] min-h-screen text-[#f2efe7]">

            {/* ══════════════════════════════════════════════════
                HERO — horizontal film strip, object-cover
            ══════════════════════════════════════════════════ */}
            <section className="relative h-[58vh] overflow-hidden">
                {heroImgs.length > 0 ? (
                    <div className="absolute inset-0 flex gap-px bg-[#090805]">
                        {heroImgs.map((img: string, i: number) => (
                            <div
                                key={i}
                                className={`overflow-hidden bg-[#0d0b07] ${i === 0 ? 'flex-[2]' : 'flex-1'}`}
                            >
                                <motion.img
                                    src={img} alt=""
                                    className="w-full h-full object-cover"
                                    initial={{ opacity: 0, scale: 1.06 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1.3, delay: i * 0.1, ease: 'easeOut' }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-[#0d0c08]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#090805] via-[#090805]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#090805]/70 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end px-8 lg:px-20 pb-12">
                    <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.44em] text-[10px] mb-4 flex items-center gap-4">
                            <span className="w-10 h-px bg-[#ffc000]" />
                            {heroLabel || 'Selected Archives'}
                        </p>
                        <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-display font-bold leading-[0.88] tracking-tight text-white">
                            {heroTitle || 'Portfolio'}
                        </h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-24">

                {/* ── Category filter — underline tab style ── */}
                {categories.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-0 mb-14 border-b border-white/10"
                    >
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-3 text-xs font-bold uppercase tracking-[0.28em] transition-all border-b-2 -mb-px ${
                                    activeCategory === cat
                                        ? 'border-[#ffc000] text-[#ffc000]'
                                        : 'border-transparent text-[#7a7260] hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* ── Gallery sections ── */}
                {filteredGalleries.length === 0 && allMediaUrls.length === 0 ? (
                    <div className="py-24 text-center border border-white/10">
                        <p className="text-xl text-[#6b6250] font-display uppercase tracking-widest">No galleries yet. Add one in the admin.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-20">
                        {filteredGalleries.map((gallery: any, gIdx: number) => {
                            const allGalleryImgs = [gallery.featuredImage, ...(gallery.images || [])].filter(Boolean);
                            return (
                                <motion.section
                                    key={gallery._id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.9 }}
                                >
                                    {/* Section header */}
                                    <div className="flex items-end justify-between mb-6 pb-4 border-b border-white/10">
                                        <div className="flex items-end gap-5">
                                            <span className="text-[#ffc000] font-display font-bold text-sm tabular-nums">
                                                {String(gIdx + 1).padStart(2, '0')}
                                            </span>
                                            <h2 className="text-2xl md:text-4xl font-display font-bold text-white leading-none">
                                                {gallery.title}
                                            </h2>
                                        </div>
                                        {gallery.category && (
                                            <span className="text-[10px] text-[#6b6250] font-bold uppercase tracking-[0.32em] mb-0.5">
                                                {gallery.category}
                                            </span>
                                        )}
                                    </div>

                                    {/* Image layout */}
                                    {allGalleryImgs.length === 1 ? (
                                        <div className="overflow-hidden cursor-zoom-in" onClick={() => openLightbox(allGalleryImgs, 0)}>
                                            <img src={allGalleryImgs[0]} alt={gallery.title}
                                                className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-700" />
                                        </div>
                                    ) : allGalleryImgs.length === 2 ? (
                                        <div className="grid grid-cols-2 gap-1">
                                            {allGalleryImgs.map((img: string, i: number) => (
                                                <div key={i} className="overflow-hidden cursor-zoom-in" onClick={() => openLightbox(allGalleryImgs, i)}>
                                                    <img src={img} alt={`${gallery.title} ${i + 1}`}
                                                        className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-700" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : gallery.layout === 'grid' ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                                            {allGalleryImgs.map((img: string, i: number) => (
                                                <div key={i} className="overflow-hidden cursor-zoom-in group bg-[#0d0c08]"
                                                    onClick={() => openLightbox(allGalleryImgs, i)}>
                                                    <img src={img} alt={`${gallery.title} ${i + 1}`}
                                                        className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* Masonry — featured hero + side grid */
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
                                            <div className="md:col-span-8 overflow-hidden cursor-zoom-in group bg-[#0d0c08]"
                                                onClick={() => openLightbox(allGalleryImgs, 0)}>
                                                <img src={allGalleryImgs[0]} alt={gallery.title}
                                                    className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                                            </div>
                                            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-1">
                                                {allGalleryImgs.slice(1, 5).map((img: string, i: number) => (
                                                    <div key={i} className="overflow-hidden cursor-zoom-in group bg-[#0d0c08]"
                                                        onClick={() => openLightbox(allGalleryImgs, i + 1)}>
                                                        <img src={img} alt={`${gallery.title} ${i + 2}`}
                                                            className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                                                    </div>
                                                ))}
                                            </div>
                                            {allGalleryImgs.slice(5).length > 0 && (
                                                <div className="md:col-span-12 grid grid-cols-3 md:grid-cols-6 gap-1">
                                                    {allGalleryImgs.slice(5).map((img: string, i: number) => (
                                                        <div key={i} className="overflow-hidden cursor-zoom-in group bg-[#0d0c08]"
                                                            onClick={() => openLightbox(allGalleryImgs, i + 5)}>
                                                            <img src={img} alt={`${gallery.title} ${i + 6}`}
                                                                className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <p className="text-[#5c5544] text-[10px] mt-3 text-right uppercase tracking-[0.28em] font-bold">
                                        {allGalleryImgs.length} image{allGalleryImgs.length !== 1 ? 's' : ''}
                                    </p>
                                </motion.section>
                            );
                        })}

                        {/* From the Archives */}
                        {activeCategory === 'All' && allMediaUrls.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.9 }}
                            >
                                <div className="flex items-end justify-between mb-6 pb-4 border-b border-white/10">
                                    <div className="flex items-end gap-5">
                                        <span className="text-[#ffc000] font-display font-bold text-sm tabular-nums">
                                            {String(filteredGalleries.length + 1).padStart(2, '0')}
                                        </span>
                                        <h2 className="text-2xl md:text-4xl font-display font-bold text-white leading-none">
                                            From the Archives
                                        </h2>
                                    </div>
                                    <span className="text-[10px] text-[#6b6250] font-bold uppercase tracking-[0.32em] mb-0.5">
                                        {allMediaUrls.length} Images
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                                    {allMediaUrls.map((url: string, i: number) => (
                                        <motion.div
                                            key={url}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.5) }}
                                            className="overflow-hidden cursor-zoom-in group bg-[#0d0c08]"
                                            onClick={() => openLightbox(allMediaUrls, i)}
                                        >
                                            <img src={url} alt={`Archive ${i + 1}`}
                                                className="w-full h-auto object-contain group-hover:scale-[1.03] transition-transform duration-500" />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        <motion.img
                            key={lightbox.idx}
                            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            src={lightbox.imgs[lightbox.idx]}
                            alt=""
                            className="max-w-[92vw] max-h-[92vh] object-contain"
                            onClick={e => e.stopPropagation()}
                        />
                        <button onClick={closeLightbox}
                            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        {lightbox.imgs.length > 1 && (
                            <>
                                <button onClick={e => { e.stopPropagation(); prev(); }}
                                    className="absolute left-4 md:left-6 w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <button onClick={e => { e.stopPropagation(); next(); }}
                                    className="absolute right-4 md:right-6 w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-bold bg-black/50 px-4 py-1">
                                    {lightbox.idx + 1} / {lightbox.imgs.length}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
