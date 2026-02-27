'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    galleries: any[];
    allMediaUrls: string[];
    heroTitle?: string;
    heroLabel?: string;
}

/* ─────────────────────────────────────────────────────────────────
   LIGHTBOX
───────────────────────────────────────────────────────────────── */
function Lightbox({ imgs, idx, onClose, onPrev, onNext }: {
    imgs: string[]; idx: number;
    onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, onPrev, onNext]);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/97 flex items-center justify-center"
            onClick={onClose}
        >
            <AnimatePresence mode="wait">
                <motion.img
                    key={idx}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    src={imgs[idx]} alt=""
                    className="max-w-[92vw] max-h-[92vh] object-contain"
                    onClick={e => e.stopPropagation()}
                />
            </AnimatePresence>

            <button onClick={onClose}
                className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {imgs.length > 1 && (
                <>
                    <button onClick={e => { e.stopPropagation(); onPrev(); }}
                        className="absolute left-4 md:left-8 w-11 h-11 bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <button onClick={e => { e.stopPropagation(); onNext(); }}
                        className="absolute right-4 md:right-8 w-11 h-11 bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs font-bold uppercase tracking-[0.24em] bg-black/60 px-4 py-1.5">
                        {idx + 1} / {imgs.length}
                    </div>
                </>
            )}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   GALLERY HEADER
───────────────────────────────────────────────────────────────── */
function GalleryHeader({ gallery, index }: { gallery: any; index: number }) {
    return (
        <div className="mb-6 pb-4 border-b border-white/10">
            <div className="flex items-end justify-between">
                <div className="flex items-end gap-5">
                    <span className="text-[#ffc000] font-display font-bold text-sm tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-display font-bold text-white leading-none">
                        {gallery.title}
                    </h2>
                </div>
                <div className="flex flex-col items-end gap-1">
                    {gallery.category && (
                        <span className="text-[10px] text-[#6b6250] font-bold uppercase tracking-[0.32em]">
                            {gallery.category}
                        </span>
                    )}
                    <span className="text-[10px] text-[#3d3828] font-bold uppercase tracking-[0.2em]">
                        {gallery.layout || 'masonry'}
                    </span>
                </div>
            </div>
            {gallery.description && (
                <p className="mt-3 text-[#7a7260] text-sm leading-relaxed max-w-xl">
                    {gallery.description}
                </p>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   LAYOUT 1 — MASONRY
   CSS columns, images fall to natural heights, editorial columns
───────────────────────────────────────────────────────────────── */
function LayoutMasonry({ imgs, title, onOpen }: { imgs: string[]; title: string; onOpen: (i: number) => void }) {
    const cols = imgs.length <= 4 ? 2 : imgs.length <= 9 ? 3 : 4;
    const colClass = cols === 2 ? 'columns-2' : cols === 3 ? 'columns-2 md:columns-3' : 'columns-2 md:columns-3 lg:columns-4';

    return (
        <div className={`${colClass} gap-0.5`}>
            {imgs.map((img, i) => (
                <div
                    key={i}
                    className="break-inside-avoid mb-0.5 overflow-hidden cursor-zoom-in group bg-[#0d0c08]"
                    onClick={() => onOpen(i)}
                >
                    <img
                        src={img} alt={`${title} ${i + 1}`}
                        className="w-full h-auto object-contain group-hover:scale-[1.025] transition-transform duration-700"
                    />
                </div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   LAYOUT 2 — GRID
   Equal-height square crops, clean and minimal
───────────────────────────────────────────────────────────────── */
function LayoutGrid({ imgs, title, onOpen }: { imgs: string[]; title: string; onOpen: (i: number) => void }) {
    // Use a numeric colCount so we can compute the remainder for the last row
    const colCount = imgs.length <= 4 ? 2 : imgs.length <= 9 ? 3 : 4;
    const colClass = colCount === 2
        ? 'grid-cols-2'
        : colCount === 3
            ? 'grid-cols-2 md:grid-cols-3'
            : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
    const remainder = imgs.length % colCount;

    return (
        <div className={`grid ${colClass} gap-0.5`}>
            {imgs.map((img, i) => {
                // Lone last item in an incomplete row → span full width, no empty cells
                const isLone = remainder === 1 && i === imgs.length - 1;
                return (
                    <div
                        key={i}
                        className={`overflow-hidden cursor-zoom-in group bg-[#0d0c08] ${isLone ? 'col-span-full h-52 sm:h-64 md:h-80' : 'aspect-square'}`}
                        onClick={() => onOpen(i)}
                    >
                        <img
                            src={img} alt={`${title} ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700"
                        />
                    </div>
                );
            })}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   LAYOUT 3 — SLIDESHOW
   Full-width cinematic one image at a time, with thumbnail strip
───────────────────────────────────────────────────────────────── */
function LayoutSlideshow({ imgs, title, onOpen }: { imgs: string[]; title: string; onOpen: (i: number) => void }) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    const go = (i: number) => {
        setDirection(i > current ? 1 : -1);
        setCurrent(i);
    };
    const goPrev = () => go((current - 1 + imgs.length) % imgs.length);
    const goNext = () => go((current + 1) % imgs.length);

    useEffect(() => {
        const timer = setInterval(goNext, 5000);
        return () => clearInterval(timer);
    }, [current]);

    return (
        <div>
            {/* Main stage */}
            <div className="relative overflow-hidden bg-[#0a0a08] aspect-[16/9] md:aspect-[21/9] cursor-zoom-in"
                onClick={() => onOpen(current)}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.img
                        key={current}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -60 }}
                        transition={{ duration: 0.55, ease: 'easeInOut' }}
                        src={imgs[current]} alt={`${title} ${current + 1}`}
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                </AnimatePresence>

                {/* Nav arrows */}
                <button
                    onClick={e => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-[#ffc000] hover:text-[#0a0a08] text-white flex items-center justify-center transition-all duration-200 z-10"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                </button>
                <button
                    onClick={e => { e.stopPropagation(); goNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-[#ffc000] hover:text-[#0a0a08] text-white flex items-center justify-center transition-all duration-200 z-10"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                {/* Counter */}
                <div className="absolute bottom-4 right-5 text-white/50 text-[10px] font-bold uppercase tracking-[0.24em] bg-black/60 px-3 py-1">
                    {current + 1} / {imgs.length}
                </div>
            </div>

            {/* Thumbnail strip */}
            {imgs.length > 1 && (
                <div className="flex gap-0.5 mt-0.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                    {imgs.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => go(i)}
                            className={`flex-none w-16 h-11 overflow-hidden transition-opacity duration-200 ${i === current ? 'opacity-100 ring-1 ring-[#ffc000]' : 'opacity-40 hover:opacity-70'}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* Dot indicators */}
            <div className="flex gap-1.5 justify-center mt-4">
                {imgs.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => go(i)}
                        className={`transition-all duration-300 ${i === current ? 'w-6 h-1 bg-[#ffc000]' : 'w-1.5 h-1 bg-white/20 hover:bg-white/40'}`}
                    />
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   LAYOUT 4 — EDITORIAL
   Magazine spread: large hero left + 2 stacked right + bottom row
───────────────────────────────────────────────────────────────── */
function LayoutEditorial({ imgs, title, onOpen }: { imgs: string[]; title: string; onOpen: (i: number) => void }) {
    const hero = imgs[0];
    const side = imgs.slice(1, 3);
    const bottom = imgs.slice(3);

    return (
        <div className="space-y-0.5">
            {/* Top block: hero + 2 side */}
            <div className="grid grid-cols-12 gap-0.5">
                {/* Hero — large left */}
                <div
                    className="col-span-12 md:col-span-8 overflow-hidden cursor-zoom-in group bg-[#0d0c08]"
                    onClick={() => onOpen(0)}
                >
                    <img src={hero} alt={title}
                        className="w-full h-full min-h-[280px] md:min-h-[480px] object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                </div>

                {/* 2 stacked side images */}
                {side.length > 0 && (
                    <div className="col-span-12 md:col-span-4 flex flex-row md:flex-col gap-0.5">
                        {side.map((img, i) => (
                            <div
                                key={i}
                                className="flex-1 overflow-hidden cursor-zoom-in group bg-[#0d0c08] min-h-[160px]"
                                onClick={() => onOpen(i + 1)}
                            >
                                <img src={img} alt={`${title} ${i + 2}`}
                                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom row for remaining images */}
            {bottom.length > 0 && (
                <div className={`grid gap-0.5 ${
                    bottom.length === 1 ? 'grid-cols-1' :
                    bottom.length === 2 ? 'grid-cols-2' :
                    bottom.length === 3 ? 'grid-cols-3' :
                    'grid-cols-2 md:grid-cols-4'
                }`}>
                    {bottom.map((img, i) => (
                        <div
                            key={i}
                            className="overflow-hidden cursor-zoom-in group bg-[#0d0c08]"
                            onClick={() => onOpen(i + 3)}
                        >
                            <img src={img} alt={`${title} ${i + 4}`}
                                className="w-full h-auto object-contain group-hover:scale-[1.025] transition-transform duration-700" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   LAYOUT 5 — FILM STRIP (horizontal scroll)
   Cinema contact sheet feel, scroll horizontally
───────────────────────────────────────────────────────────────── */
function LayoutStrip({ imgs, title, onOpen }: { imgs: string[]; title: string; onOpen: (i: number) => void }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' });
        }
    };

    return (
        <div>
            {/* Film-strip header decoration */}
            <div className="flex items-center gap-0 mb-0.5 overflow-hidden h-3 bg-[#0d0c08]">
                {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="flex-none w-5 h-2 border border-[#1c1a12] mx-0.5 bg-[#0a0908]" />
                ))}
            </div>

            {/* Scroll controls */}
            <div className="relative">
                <button
                    onClick={() => scroll(-1)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#0a0a08]/90 hover:bg-[#ffc000] hover:text-[#0a0a08] text-white flex items-center justify-center transition-all duration-200"
                >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-0.5 overflow-x-auto px-11"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {imgs.map((img, i) => (
                        <div
                            key={i}
                            className="flex-none w-72 md:w-96 overflow-hidden cursor-zoom-in group bg-[#0d0c08]"
                            onClick={() => onOpen(i)}
                        >
                            <img
                                src={img} alt={`${title} ${i + 1}`}
                                className="w-full h-72 md:h-96 object-contain group-hover:scale-[1.03] transition-transform duration-500"
                            />
                            {/* Frame number */}
                            <div className="flex items-center justify-between px-2 py-1 bg-[#0a0908]">
                                <span className="text-[9px] text-[#3d3828] font-bold uppercase tracking-[0.3em]">
                                    {String(i + 1).padStart(3, '0')}
                                </span>
                                <span className="w-3 h-px bg-[#2a2618]" />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll(1)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#0a0a08]/90 hover:bg-[#ffc000] hover:text-[#0a0a08] text-white flex items-center justify-center transition-all duration-200"
                >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
            </div>

            {/* Film-strip footer decoration */}
            <div className="flex items-center gap-0 mt-0.5 overflow-hidden h-3 bg-[#0d0c08]">
                {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="flex-none w-5 h-2 border border-[#1c1a12] mx-0.5 bg-[#0a0908]" />
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   LAYOUT 6 — SPOTLIGHT
   One commanding hero image, supporting strip below
───────────────────────────────────────────────────────────────── */
function LayoutSpotlight({ imgs, title, onOpen }: { imgs: string[]; title: string; onOpen: (i: number) => void }) {
    const [featured, setFeatured] = useState(0);
    const hero = imgs[featured];
    const others = imgs.filter((_, i) => i !== featured);

    const handleThumb = (originalIdx: number) => setFeatured(originalIdx);

    return (
        <div className="space-y-0.5">
            {/* Hero spotlight */}
            <div
                className="relative overflow-hidden bg-[#0a0a08] cursor-zoom-in group"
                onClick={() => onOpen(featured)}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={featured}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        src={hero} alt={title}
                        className="w-full max-h-[70vh] object-contain group-hover:scale-[1.015] transition-transform duration-1000"
                    />
                </AnimatePresence>

                {/* Subtle vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.4)] pointer-events-none" />

                {/* Image index */}
                <div className="absolute top-4 left-5 text-[#ffc000]/60 font-display font-bold text-xs uppercase tracking-[0.3em]">
                    {String(featured + 1).padStart(2, '0')} / {String(imgs.length).padStart(2, '0')}
                </div>
            </div>

            {/* Supporting thumbnail strip */}
            {imgs.length > 1 && (
                <div className="flex gap-0.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                    {imgs.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => handleThumb(i)}
                            className={`flex-none w-20 h-14 md:w-28 md:h-20 overflow-hidden transition-all duration-200 ${
                                i === featured
                                    ? 'ring-1 ring-[#ffc000] opacity-100'
                                    : 'opacity-35 hover:opacity-65'
                            }`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   LAYOUT DISPATCHER
───────────────────────────────────────────────────────────────── */
function GalleryLayout({ gallery, onOpen }: { gallery: any; onOpen: (i: number) => void }) {
    const imgs = [gallery.featuredImage, ...(gallery.images || [])].filter(Boolean);
    const layout = gallery.layout || 'masonry';
    const title = gallery.title;

    if (imgs.length === 0) return null;

    // Single or two images: always show naturally
    if (imgs.length === 1) {
        return (
            <div className="overflow-hidden cursor-zoom-in group" onClick={() => onOpen(0)}>
                <img src={imgs[0]} alt={title}
                    className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700" />
            </div>
        );
    }

    switch (layout) {
        case 'grid':      return <LayoutGrid imgs={imgs} title={title} onOpen={onOpen} />;
        case 'slideshow': return <LayoutSlideshow imgs={imgs} title={title} onOpen={onOpen} />;
        case 'editorial': return <LayoutEditorial imgs={imgs} title={title} onOpen={onOpen} />;
        case 'strip':     return <LayoutStrip imgs={imgs} title={title} onOpen={onOpen} />;
        case 'spotlight': return <LayoutSpotlight imgs={imgs} title={title} onOpen={onOpen} />;
        default:          return <LayoutMasonry imgs={imgs} title={title} onOpen={onOpen} />;
    }
}

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────── */
export default function PortfolioClient({ galleries, allMediaUrls, heroTitle, heroLabel }: Props) {
    const [lightbox, setLightbox] = useState<{ imgs: string[]; idx: number } | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const allGalleryImages = galleries.flatMap((g: any) => [g.featuredImage, ...(g.images || [])].filter(Boolean));
    const heroImgs = (allGalleryImages.length > 0 ? allGalleryImages : allMediaUrls).slice(0, 5);

    const categories = ['All', ...Array.from(new Set(galleries.map((g: any) => g.category).filter(Boolean)))];
    const filteredGalleries = activeCategory === 'All' ? galleries : galleries.filter((g: any) => g.category === activeCategory);

    const openLightbox = (imgs: string[], idx: number) => setLightbox({ imgs, idx });
    const closeLightbox = useCallback(() => setLightbox(null), []);
    const prevImg = useCallback(() => setLightbox(lb => lb ? { ...lb, idx: (lb.idx - 1 + lb.imgs.length) % lb.imgs.length } : null), []);
    const nextImg = useCallback(() => setLightbox(lb => lb ? { ...lb, idx: (lb.idx + 1) % lb.imgs.length } : null), []);

    return (
        <div className="bg-[#090805] min-h-screen text-[#f2efe7]">

            {/* ══════════════════════════════════════════════════
                HERO — horizontal film strip
            ══════════════════════════════════════════════════ */}
            <section className="relative h-[52vh] sm:h-[55vh] md:h-[62vh] overflow-hidden">
                {heroImgs.length > 0 ? (
                    <div className="absolute inset-0 flex gap-px bg-[#090805]">
                        {heroImgs.map((img: string, i: number) => (
                            <div
                                key={i}
                                className={`overflow-hidden bg-[#0d0b07] ${i === 0 ? 'flex-[2]' : 'flex-1'}${i === 1 ? ' hidden sm:block' : ''}${i >= 2 ? ' hidden md:block' : ''}`}
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

                <div className="absolute inset-0 bg-gradient-to-t from-[#090805] via-[#090805]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#090805]/80 via-[#090805]/30 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-8 lg:px-20 pb-8 md:pb-12">
                    <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.44em] text-[10px] mb-3 md:mb-4 flex items-center gap-4">
                            <span className="w-8 md:w-10 h-px bg-[#ffc000]" />
                            {heroLabel || 'Selected Archives'}
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-display font-bold leading-[0.88] tracking-tight text-white">
                            {heroTitle || 'Portfolio'}
                        </h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-24">

                {/* ── Category filter ── */}
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
                            const galleryImgs = [gallery.featuredImage, ...(gallery.images || [])].filter(Boolean);
                            return (
                                <motion.section
                                    key={gallery._id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.9 }}
                                >
                                    <GalleryHeader gallery={gallery} index={gIdx} />
                                    <GalleryLayout
                                        gallery={gallery}
                                        onOpen={(i) => openLightbox(galleryImgs, i)}
                                    />
                                    <p className="text-[#3d3828] text-[10px] mt-3 text-right uppercase tracking-[0.24em] font-bold">
                                        {galleryImgs.length} frame{galleryImgs.length !== 1 ? 's' : ''}
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
                                <div className="mb-6 pb-4 border-b border-white/10">
                                    <div className="flex items-end justify-between">
                                        <div className="flex items-end gap-5">
                                            <span className="text-[#ffc000] font-display font-bold text-sm tabular-nums">
                                                {String(filteredGalleries.length + 1).padStart(2, '0')}
                                            </span>
                                            <h2 className="text-2xl md:text-4xl font-display font-bold text-white leading-none">
                                                From the Archives
                                            </h2>
                                        </div>
                                        <span className="text-[10px] text-[#6b6250] font-bold uppercase tracking-[0.32em]">
                                            {allMediaUrls.length} Images
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5">
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

            {/* ── Lightbox ── */}
            <AnimatePresence>
                {lightbox && (
                    <Lightbox
                        imgs={lightbox.imgs}
                        idx={lightbox.idx}
                        onClose={closeLightbox}
                        onPrev={prevImg}
                        onNext={nextImg}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
