'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioClient({ galleries }: { galleries: any[] }) {
    const [lightbox, setLightbox] = useState<{ imgs: string[]; idx: number } | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const allImages = galleries.flatMap(g => [g.featuredImage, ...(g.images || [])].filter(Boolean));
    const categories = ['All', ...Array.from(new Set(galleries.map(g => g.category).filter(Boolean)))];
    const filtered = activeCategory === 'All' ? galleries : galleries.filter(g => g.category === activeCategory);

    const openLightbox = (imgs: string[], idx: number) => setLightbox({ imgs, idx });
    const closeLightbox = () => setLightbox(null);
    const prev = () => lightbox && setLightbox({ ...lightbox, idx: (lightbox.idx - 1 + lightbox.imgs.length) % lightbox.imgs.length });
    const next = () => lightbox && setLightbox({ ...lightbox, idx: (lightbox.idx + 1) % lightbox.imgs.length });

    return (
        <div className="bg-[#0a0a08] min-h-screen text-white">
            {/* Hero — full-bleed image collage */}
            <section className="relative h-[70vh] overflow-hidden">
                {allImages.length > 0 && (
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1">
                        {allImages.slice(0, 6).map((img, i) => (
                            <div key={i} className={`overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                )}
                {/* Solid bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0a0a08] to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a08] h-16"></div>

                {/* Text overlay */}
                <div className="absolute inset-0 flex flex-col items-start justify-end pb-20 px-6 lg:px-16 max-w-7xl mx-auto w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-3">Selected Archives</p>
                        <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase text-white leading-none">Portfolio</h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-32">
                {/* Category filter */}
                {categories.length > 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-2 mb-16">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest border transition-all ${activeCategory === cat ? 'bg-[#ffc000] text-[#0a0a08] border-[#ffc000]' : 'border-white/15 text-slate-400 hover:border-white/40 hover:text-white'}`}>
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                )}

                {filtered.length === 0 ? (
                    <div className="py-32 text-center border border-white/10 rounded-2xl">
                        <p className="text-2xl text-slate-500 font-display">No galleries yet. Add one in the admin.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-32">
                        {filtered.map((gallery, gIdx) => {
                            const allGalleryImgs = [gallery.featuredImage, ...(gallery.images || [])].filter(Boolean);
                            return (
                                <motion.section key={gallery._id}
                                    initial={{ opacity: 0, y: 60 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.9 }}
                                >
                                    {/* Section header — editorial style */}
                                    <div className="flex items-end justify-between mb-8 border-b-2 border-[#ffc000] pb-4">
                                        <div className="flex items-end gap-6">
                                            <span className="text-[#ffc000] font-mono text-sm font-bold">0{gIdx + 1}</span>
                                            <h2 className="text-4xl md:text-5xl font-display font-extrabold uppercase text-white leading-none">{gallery.title}</h2>
                                        </div>
                                        {gallery.category && (
                                            <span className="text-[#ffc000] text-xs font-bold uppercase tracking-[0.3em] mb-1">{gallery.category}</span>
                                        )}
                                    </div>

                                    {/* Image layout — featured large + grid */}
                                    {allGalleryImgs.length === 1 ? (
                                        <div className="aspect-[21/9] overflow-hidden rounded-none cursor-zoom-in" onClick={() => openLightbox(allGalleryImgs, 0)}>
                                            <img src={allGalleryImgs[0]} alt={gallery.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                        </div>
                                    ) : allGalleryImgs.length === 2 ? (
                                        <div className="grid grid-cols-2 gap-1">
                                            {allGalleryImgs.map((img, i) => (
                                                <div key={i} className="aspect-[4/5] overflow-hidden cursor-zoom-in" onClick={() => openLightbox(allGalleryImgs, i)}>
                                                    <img src={img} alt={`${gallery.title} ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : gallery.layout === 'grid' ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                                            {allGalleryImgs.map((img, i) => (
                                                <div key={i} className="aspect-square overflow-hidden cursor-zoom-in group" onClick={() => openLightbox(allGalleryImgs, i)}>
                                                    <img src={img} alt={`${gallery.title} ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* Masonry — featured hero + side grid */
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
                                            {/* Featured — takes 8 cols */}
                                            <div className="md:col-span-8 aspect-[4/5] md:aspect-auto overflow-hidden cursor-zoom-in group" style={{ minHeight: 480 }}
                                                onClick={() => openLightbox(allGalleryImgs, 0)}>
                                                <img src={allGalleryImgs[0]} alt={gallery.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            </div>
                                            {/* Side grid — 4 cols */}
                                            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-1" style={{ maxHeight: 480 }}>
                                                {allGalleryImgs.slice(1, 5).map((img, i) => (
                                                    <div key={i} className={`overflow-hidden cursor-zoom-in group ${allGalleryImgs.slice(1, 5).length <= 2 ? 'aspect-[4/3]' : 'aspect-square'}`}
                                                        style={{ flex: 1 }}
                                                        onClick={() => openLightbox(allGalleryImgs, i + 1)}>
                                                        <img src={img} alt={`${gallery.title} ${i+2}`}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Remaining images in a row */}
                                            {allGalleryImgs.slice(5).length > 0 && (
                                                <div className="md:col-span-12 grid grid-cols-3 md:grid-cols-6 gap-1 mt-0">
                                                    {allGalleryImgs.slice(5).map((img, i) => (
                                                        <div key={i} className="aspect-square overflow-hidden cursor-zoom-in group"
                                                            onClick={() => openLightbox(allGalleryImgs, i + 5)}>
                                                            <img src={img} alt={`${gallery.title} ${i+6}`}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <p className="text-slate-600 text-xs mt-4 text-right">{allGalleryImgs.length} image{allGalleryImgs.length !== 1 ? 's' : ''}</p>
                                </motion.section>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        {/* Image */}
                        <motion.img
                            key={lightbox.idx}
                            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            src={lightbox.imgs[lightbox.idx]}
                            alt=""
                            className="max-w-[90vw] max-h-[90vh] object-contain"
                            onClick={e => e.stopPropagation()}
                        />

                        {/* Controls */}
                        <button onClick={closeLightbox} className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        {lightbox.imgs.length > 1 && (
                            <>
                                <button onClick={e => { e.stopPropagation(); prev(); }}
                                    className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <button onClick={e => { e.stopPropagation(); next(); }}
                                    className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-bold">
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
