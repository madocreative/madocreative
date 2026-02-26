'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    galleries: any[];
    allMediaUrls: string[];
}

export default function PortfolioClient({ galleries, allMediaUrls }: Props) {
    const [lightbox, setLightbox] = useState<{ imgs: string[]; idx: number } | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');

    // All images from galleries (for hero collage)
    const allGalleryImages = galleries.flatMap((g: any) => [g.featuredImage, ...(g.images || [])].filter(Boolean));
    const heroImgs = allGalleryImages.length > 0 ? allGalleryImages : allMediaUrls;

    const categories = ['All', ...Array.from(new Set(galleries.map((g: any) => g.category).filter(Boolean)))];
    const filteredGalleries = activeCategory === 'All' ? galleries : galleries.filter((g: any) => g.category === activeCategory);

    const openLightbox = (imgs: string[], idx: number) => setLightbox({ imgs, idx });
    const closeLightbox = () => setLightbox(null);
    const prev = () => lightbox && setLightbox({ ...lightbox, idx: (lightbox.idx - 1 + lightbox.imgs.length) % lightbox.imgs.length });
    const next = () => lightbox && setLightbox({ ...lightbox, idx: (lightbox.idx + 1) % lightbox.imgs.length });

    return (
        <div className="bg-[#0a0a08] min-h-screen text-white">
            {/* Hero — full-bleed image collage */}
            <section className="relative h-[60vh] overflow-hidden">
                {heroImgs.length > 0 && (
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1">
                        {heroImgs.slice(0, 6).map((img: string, i: number) => (
                            <div key={i} className={`overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                                <img src={img} alt="" className="w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0a0a08] to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a08] h-12" />

                <div className="absolute inset-0 flex flex-col items-start justify-end pb-16 px-6 lg:px-16 max-w-7xl mx-auto w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-2">Selected Archives</p>
                        <h1 className="text-4xl md:text-7xl font-display font-extrabold uppercase text-white leading-none">Portfolio</h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-24">
                {/* Category filter */}
                {categories.length > 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-2 mb-12">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all
                                    ${activeCategory === cat
                                        ? 'bg-[#ffc000] text-[#0a0a08] border-[#ffc000]'
                                        : 'border-white/15 text-slate-400 hover:border-white/40 hover:text-white'}`}>
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* Gallery sections */}
                {filteredGalleries.length === 0 && allMediaUrls.length === 0 ? (
                    <div className="py-24 text-center border border-white/10">
                        <p className="text-2xl text-slate-500 font-display">No galleries yet. Add one in the admin.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-20">
                        {filteredGalleries.map((gallery: any, gIdx: number) => {
                            const allGalleryImgs = [gallery.featuredImage, ...(gallery.images || [])].filter(Boolean);
                            return (
                                <motion.section key={gallery._id}
                                    initial={{ opacity: 0, y: 60 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.9 }}
                                >
                                    {/* Section header */}
                                    <div className="flex items-end justify-between mb-6 border-b-2 border-[#ffc000] pb-3">
                                        <div className="flex items-end gap-5">
                                            <span className="text-[#ffc000] font-mono text-sm font-bold">0{gIdx + 1}</span>
                                            <h2 className="text-3xl md:text-4xl font-display font-extrabold uppercase text-white leading-none">{gallery.title}</h2>
                                        </div>
                                        {gallery.category && (
                                            <span className="text-[#ffc000] text-xs font-bold uppercase tracking-[0.3em] mb-0.5">{gallery.category}</span>
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
                                                <div key={i} className="overflow-hidden cursor-zoom-in group bg-[#111109]"
                                                    onClick={() => openLightbox(allGalleryImgs, i)}>
                                                    <img src={img} alt={`${gallery.title} ${i + 1}`}
                                                        className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* Masonry — featured hero + side grid */
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
                                            <div className="md:col-span-8 overflow-hidden cursor-zoom-in group bg-[#111109]"
                                                onClick={() => openLightbox(allGalleryImgs, 0)}>
                                                <img src={allGalleryImgs[0]} alt={gallery.title}
                                                    className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                                            </div>
                                            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-1">
                                                {allGalleryImgs.slice(1, 5).map((img: string, i: number) => (
                                                    <div key={i} className="overflow-hidden cursor-zoom-in group bg-[#111109]"
                                                        onClick={() => openLightbox(allGalleryImgs, i + 1)}>
                                                        <img src={img} alt={`${gallery.title} ${i + 2}`}
                                                            className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                                                    </div>
                                                ))}
                                            </div>
                                            {allGalleryImgs.slice(5).length > 0 && (
                                                <div className="md:col-span-12 grid grid-cols-3 md:grid-cols-6 gap-1">
                                                    {allGalleryImgs.slice(5).map((img: string, i: number) => (
                                                        <div key={i} className="overflow-hidden cursor-zoom-in group bg-[#111109]"
                                                            onClick={() => openLightbox(allGalleryImgs, i + 5)}>
                                                            <img src={img} alt={`${gallery.title} ${i + 6}`}
                                                                className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <p className="text-slate-700 text-xs mt-3 text-right">{allGalleryImgs.length} image{allGalleryImgs.length !== 1 ? 's' : ''}</p>
                                </motion.section>
                            );
                        })}

                        {/* ── From the Archives — all other Cloudinary images ── */}
                        {activeCategory === 'All' && allMediaUrls.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.9 }}
                            >
                                <div className="flex items-end justify-between mb-6 border-b-2 border-[#ffc000] pb-3">
                                    <div className="flex items-end gap-5">
                                        <span className="text-[#ffc000] font-mono text-sm font-bold">
                                            {String(filteredGalleries.length + 1).padStart(2, '0')}
                                        </span>
                                        <h2 className="text-3xl md:text-4xl font-display font-extrabold uppercase text-white leading-none">
                                            From the Archives
                                        </h2>
                                    </div>
                                    <span className="text-[#ffc000] text-xs font-bold uppercase tracking-[0.3em] mb-0.5">
                                        {allMediaUrls.length} Images
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                                    {allMediaUrls.map((url: string, i: number) => (
                                        <motion.div key={url}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.5) }}
                                            className="overflow-hidden cursor-zoom-in group bg-[#111109]"
                                            onClick={() => openLightbox(allMediaUrls, i)}>
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
                        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
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
                                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-bold bg-black/40 px-4 py-1">
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
