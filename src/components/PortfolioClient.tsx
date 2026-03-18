'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface Props {
    galleries: any[];
    allMediaUrls: string[];
    heroTitle?: string;
    heroLabel?: string;
}

function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function getGalleryGroupName(gallery: any): string {
    const group = String(gallery?.category || gallery?.title || '').trim();
    return group || 'Uncategorized';
}

function formatLayoutLabel(layout: string | undefined): string {
    const normalized = String(layout || 'masonry').trim().toLowerCase();

    switch (normalized) {
        case 'strip':
            return 'Film Strip';
        case 'spotlight':
            return 'Spotlight';
        case 'slideshow':
            return 'Slideshow';
        case 'editorial':
            return 'Editorial';
        case 'grid':
            return 'Grid';
        default:
            return 'Masonry';
    }
}

function toNoCropUrl(url: string): string {
    if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
    const marker = '/upload/';
    const [prefix, restRaw] = url.split(marker);
    if (!restRaw) return url;

    const segments = restRaw.split('/').filter(Boolean);
    if (segments.length === 0) return url;

    // Drop existing transformation segment so server-side crops like c_fill don't persist.
    if (!segments[0].startsWith('v')) {
        segments.shift();
    }

    const path = segments.join('/');
    return `${prefix}${marker}c_fit,w_2400,h_2400,q_auto:best,f_auto/${path}`;
}

/* ─────────────────────────────────────────────────────────────────
   LIGHTBOX — swipe + direction-aware slide transitions
───────────────────────────────────────────────────────────────── */
const lightboxVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '55%' : '-55%', opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:  (dir: number) => ({ x: dir < 0 ? '55%' : '-55%', opacity: 0, scale: 0.96 }),
};

function Lightbox({ imgs, idx, onClose, onPrev, onNext }: {
    imgs: string[]; idx: number;
    onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
    const [direction, setDirection] = useState(0);
    const [localIdx, setLocalIdx] = useState(idx);
    const pointerStartX = useRef(0);
    const pointerStartY = useRef(0);

    const go = useCallback((next: number, dir: number) => {
        setDirection(dir);
        setLocalIdx(next);
        if (dir > 0) onNext();
        else onPrev();
    }, [onNext, onPrev]);

    // Keep in sync if parent forces idx change (shouldn't happen but safe)
    useEffect(() => { setLocalIdx(idx); }, [idx]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && imgs.length > 1)  go((localIdx - 1 + imgs.length) % imgs.length, -1);
            if (e.key === 'ArrowRight' && imgs.length > 1) go((localIdx + 1) % imgs.length, 1);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, localIdx, imgs.length, go]);

    const onPointerDown = (e: React.PointerEvent) => {
        pointerStartX.current = e.clientX;
        pointerStartY.current = e.clientY;
    };
    const onPointerUp = (e: React.PointerEvent) => {
        const dx = pointerStartX.current - e.clientX;
        const dy = Math.abs(pointerStartY.current - e.clientY);
        if (Math.abs(dx) > 48 && dy < 80 && imgs.length > 1) {
            if (dx > 0) go((localIdx + 1) % imgs.length, 1);
            else        go((localIdx - 1 + imgs.length) % imgs.length, -1);
        }
    };

    const hasPrev = localIdx > 0;
    const hasNext = localIdx < imgs.length - 1;

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-[#050403]/98 flex items-center justify-center"
            onClick={onClose}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
        >
            {/* Image */}
            <AnimatePresence mode="wait" custom={direction}>
                <motion.img
                    key={localIdx}
                    custom={direction}
                    variants={lightboxVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.38, ease: [0.25, 1, 0.5, 1] }}
                    src={toNoCropUrl(imgs[localIdx])} alt=""
                    className="max-w-[92vw] max-h-[88vh] object-contain select-none"
                    draggable={false}
                    onClick={e => e.stopPropagation()}
                />
            </AnimatePresence>

            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-black/70 to-transparent z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/40">
                    {String(localIdx + 1).padStart(2, '0')} / {String(imgs.length).padStart(2, '0')}
                </p>
                <button
                    onClick={e => { e.stopPropagation(); onClose(); }}
                    className="w-9 h-9 grid place-items-center border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                    aria-label="Close"
                >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>

            {/* Navigation arrows */}
            {imgs.length > 1 && (
                <>
                    <button
                        onClick={e => { e.stopPropagation(); if (hasPrev) go(localIdx - 1, -1); }}
                        className={`absolute left-4 md:left-7 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center border transition-all duration-200 z-10 ${hasPrev ? 'border-white/25 text-white hover:bg-white hover:text-black' : 'border-white/8 text-white/18 cursor-default'}`}
                        aria-label="Previous"
                    >
                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); if (hasNext) go(localIdx + 1, 1); }}
                        className={`absolute right-4 md:right-7 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center border transition-all duration-200 z-10 ${hasNext ? 'border-white/25 text-white hover:bg-white hover:text-black' : 'border-white/8 text-white/18 cursor-default'}`}
                        aria-label="Next"
                    >
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </button>
                </>
            )}

            {/* Bottom dot progress */}
            {imgs.length > 1 && imgs.length <= 20 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {imgs.map((_, i) => (
                        <button
                            key={i}
                            onClick={e => { e.stopPropagation(); go(i, i > localIdx ? 1 : -1); }}
                            className={`transition-all duration-300 rounded-full ${i === localIdx ? 'w-5 h-[3px] bg-[#ffc000]' : 'w-[5px] h-[5px] bg-white/28 hover:bg-white/55'}`}
                            aria-label={`Image ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   GALLERY HEADER
───────────────────────────────────────────────────────────────── */
function GalleryHeader({ gallery, index, frameCount }: { gallery: any; index: number; frameCount: number }) {
    const galleryLabel = getGalleryGroupName(gallery);
    const galleryTitle = String(gallery?.title || galleryLabel);
    const layoutLabel = formatLayoutLabel(gallery?.layout);

    return (
        <div className="mb-7 md:mb-9">
            <div className="mb-4 h-px w-14 bg-[#d4af6a]/65 md:w-20" />
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8">
                <div className="space-y-3 md:space-y-4">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="text-[#d4af6a] font-display font-bold text-[11px] tracking-[0.28em] tabular-nums">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="h-px w-8 bg-[#d4af6a]/35 md:w-10" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/48">
                            {galleryLabel}
                        </span>
                    </div>
                    <h2 className="max-w-4xl font-display font-bold text-[2rem] leading-[0.95] tracking-[0.02em] text-[#EAEAEA] md:text-[2.8rem]">
                        {galleryTitle}
                    </h2>
                    {gallery.description && (
                        <p className="max-w-2xl text-[15px] leading-7 text-[rgba(255,255,255,0.68)] md:text-base md:leading-8">
                            {gallery.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-3 md:flex-col md:items-end md:justify-end md:border-t-0 md:pt-0">
                    <span className="text-[11px] font-bold uppercase tracking-[0.36em] text-[#EAEAEA]">
                        {frameCount} Frame{frameCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/46">
                        {layoutLabel}
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   SHARED — image cell hover overlay
───────────────────────────────────────────────────────────────── */
function ImgOverlay({ label }: { label: string }) {
    return (
        <div className="absolute inset-0 bg-[#050403]/0 group-hover:bg-[#050403]/55 transition-all duration-500 flex items-end justify-between p-3 pointer-events-none">
            <span className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out text-[9px] font-bold uppercase tracking-[0.28em] text-white/80">
                {label}
            </span>
            <span className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out delay-[40ms] material-symbols-outlined text-white text-[18px]">
                zoom_in
            </span>
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
                    className="break-inside-avoid mb-0.5 overflow-hidden cursor-zoom-in group relative bg-[#0d0c08]"
                    onClick={() => onOpen(i)}
                >
                    <img
                        src={toNoCropUrl(img)} alt={`${title} ${i + 1}`}
                        className="w-full h-auto object-contain group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    <ImgOverlay label={`${title} · ${String(i + 1).padStart(2, '0')}`} />
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
                const isLone = remainder === 1 && i === imgs.length - 1;
                return (
                    <div
                        key={i}
                        className={`overflow-hidden cursor-zoom-in group relative bg-[#0d0c08] ${isLone ? 'col-span-full h-52 sm:h-64 md:h-80' : 'aspect-square'}`}
                        onClick={() => onOpen(i)}
                    >
                        <img
                            src={toNoCropUrl(img)} alt={`${title} ${i + 1}`}
                            className="w-full h-full object-contain group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                        />
                        <ImgOverlay label={`${title} · ${String(i + 1).padStart(2, '0')}`} />
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
                        src={toNoCropUrl(imgs[current])} alt={`${title} ${current + 1}`}
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
                            <img src={toNoCropUrl(img)} alt="" className="w-full h-full object-contain" />
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
                    <img src={toNoCropUrl(hero)} alt={title}
                        className="w-full h-full min-h-[280px] md:min-h-[480px] object-contain group-hover:scale-[1.03] transition-transform duration-700" />
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
                                <img src={toNoCropUrl(img)} alt={`${title} ${i + 2}`}
                                    className="w-full h-full object-contain group-hover:scale-[1.04] transition-transform duration-700" />
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
                            <img src={toNoCropUrl(img)} alt={`${title} ${i + 4}`}
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
            const distance = Math.max(scrollRef.current.clientWidth * 0.82, 280);
            scrollRef.current.scrollBy({ left: dir * distance, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-2 md:space-y-3">
            {/* Film-strip header decoration */}
            <div className="flex items-center gap-0 overflow-hidden h-2.5 rounded-full bg-[#0d0c08]">
                {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="flex-none w-5 h-2 border border-[#1c1a12] mx-0.5 bg-[#0a0908]" />
                ))}
            </div>

            {/* Scroll controls */}
            <div className="relative">
                <button
                    onClick={() => scroll(-1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0a0a08]/88 text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-all duration-200 hover:border-[#ffc000] hover:bg-[#ffc000] hover:text-[#0a0a08] md:flex"
                    aria-label="Scroll gallery left"
                >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                <div
                    ref={scrollRef}
                    className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-0 sm:px-1 md:px-14"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {imgs.map((img, i) => (
                        <div
                            key={i}
                            className="group flex-none snap-start overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#0d0c08] shadow-[0_24px_50px_rgba(0,0,0,0.22)] w-[82vw] sm:w-[22rem] md:w-[26rem] cursor-zoom-in"
                            onClick={() => onOpen(i)}
                        >
                            <div className="relative bg-[radial-gradient(circle_at_top,rgba(212,175,106,0.16),transparent_62%)]">
                                <img
                                    src={toNoCropUrl(img)} alt={`${title} ${i + 1}`}
                                    className="w-full aspect-[4/5] object-contain px-3 py-4 sm:px-4 sm:py-5 md:aspect-[5/6] md:px-5 md:py-6 group-hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                            {/* Frame number */}
                            <div className="flex items-center justify-between border-t border-white/8 bg-[#11151B] px-4 py-3">
                                <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#EAEAEA]">
                                    {String(i + 1).padStart(3, '0')}
                                </span>
                                <span className="h-px w-8 bg-[#d4af6a]/40" />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll(1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0a0a08]/88 text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-all duration-200 hover:border-[#ffc000] hover:bg-[#ffc000] hover:text-[#0a0a08] md:flex"
                    aria-label="Scroll gallery right"
                >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
            </div>

            {/* Film-strip footer decoration */}
            <div className="flex items-center gap-0 overflow-hidden h-2.5 rounded-full bg-[#0d0c08]">
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
                        src={toNoCropUrl(hero)} alt={title}
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
                            <img src={toNoCropUrl(img)} alt="" className="w-full h-full object-contain" />
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
                <img src={toNoCropUrl(imgs[0])} alt={title}
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
    const searchParams = useSearchParams();

    const allGalleryImages = galleries.flatMap((g: any) => [g.featuredImage, ...(g.images || [])].filter(Boolean));
    const heroImgs = (allGalleryImages.length > 0 ? allGalleryImages : allMediaUrls).slice(0, 5);

    const galleriesWithGroup = useMemo(
        () =>
            galleries.map((gallery: any) => ({
                ...gallery,
                __group: getGalleryGroupName(gallery),
            })),
        [galleries],
    );
    const categories = useMemo(
        () => ['All', ...Array.from(new Set(galleriesWithGroup.map((g: any) => g.__group).filter(Boolean)))],
        [galleriesWithGroup],
    );
    const filteredGalleries = useMemo(
        () =>
            activeCategory === 'All'
                ? galleriesWithGroup
                : galleriesWithGroup.filter((g: any) => g.__group === activeCategory),
        [activeCategory, galleriesWithGroup],
    );
    const categoryFromQuery = searchParams.get('category');

    useEffect(() => {
        if (!categoryFromQuery) return;
        const normalized = slugify(categoryFromQuery);
        if (!normalized) return;
        const match = categories.find((cat) => slugify(String(cat)) === normalized);
        if (match) {
            setActiveCategory((prev) => (prev === match ? prev : match));
            // Jump to the gallery collection block when coming from header dropdown links.
            window.setTimeout(() => {
                const target = document.getElementById('portfolio-collections');
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 90);
        }
    }, [categoryFromQuery, categories]);

    const openLightbox = (imgs: string[], idx: number) => setLightbox({ imgs, idx });
    const closeLightbox = useCallback(() => setLightbox(null), []);
    const prevImg = useCallback(() => setLightbox(lb => lb ? { ...lb, idx: (lb.idx - 1 + lb.imgs.length) % lb.imgs.length } : null), []);
    const nextImg = useCallback(() => setLightbox(lb => lb ? { ...lb, idx: (lb.idx + 1) % lb.imgs.length } : null), []);

    // Hero slider
    const [heroIdx, setHeroIdx] = useState(0);
    const [heroDir, setHeroDir] = useState(1);
    const [heroPaused, setHeroPaused] = useState(false);
    const goHero = useCallback((next: number) => {
        if (heroImgs.length === 0) return;
        setHeroDir(next > heroIdx ? 1 : -1);
        setHeroIdx((next + heroImgs.length) % heroImgs.length);
    }, [heroIdx, heroImgs.length]);
    const goHeroNext = useCallback(() => goHero(heroIdx + 1), [goHero, heroIdx]);
    const goHeroPrev = useCallback(() => goHero(heroIdx - 1), [goHero, heroIdx]);
    useEffect(() => {
        if (heroPaused || heroImgs.length <= 1) return;
        const t = setTimeout(goHeroNext, 5500);
        return () => clearTimeout(t);
    }, [heroIdx, heroPaused, goHeroNext, heroImgs.length]);

    const heroSlideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit:  (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
    };

    return (
        <div className="bg-[var(--app-bg)] min-h-screen text-[var(--app-text)]">

            {/* ══════════════════════════════════════════════════
                HERO — full-screen image slider
            ══════════════════════════════════════════════════ */}
            <section
                className="relative h-[58vh] md:h-[74vh] overflow-hidden bg-[#080806] mx-3 md:mx-5 mt-[104px] md:mt-[116px] rounded-[1.25rem]"
                onMouseEnter={() => setHeroPaused(true)}
                onMouseLeave={() => setHeroPaused(false)}
            >
                {/* Sliding images */}
                {heroImgs.length > 0 ? (
                    <AnimatePresence initial={false} custom={heroDir} mode="popLayout">
                        <motion.div
                            key={heroIdx}
                            custom={heroDir}
                            variants={heroSlideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.6, ease: [0.32, 0, 0.67, 0] }}
                            className="absolute inset-0"
                        >
                            {/* Blurred ambient background — fills empty space */}
                            <img
                                src={toNoCropUrl(heroImgs[heroIdx])}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30"
                                aria-hidden="true"
                            />
                            {/* Full image — object-contain so nothing is cropped */}
                            <img
                                src={toNoCropUrl(heroImgs[heroIdx])}
                                alt=""
                                className="relative z-10 w-full h-full object-contain"
                            />
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="absolute inset-0 bg-[#0d0c08]" />
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/28 via-transparent to-transparent pointer-events-none" />

                {/* Prev / Next */}
                {heroImgs.length > 1 && (
                    <>
                        <button onClick={goHeroPrev}
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#090805] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                            aria-label="Previous">
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <button onClick={goHeroNext}
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#090805] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                            aria-label="Next">
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </>
                )}

                {/* Dot indicators */}
                {heroImgs.length > 1 && (
                    <div className="absolute bottom-6 right-6 md:right-10 z-20 flex items-center gap-2">
                        {heroImgs.map((_, i) => (
                            <button key={i}
                                onClick={() => { setHeroDir(i > heroIdx ? 1 : -1); setHeroIdx(i); }}
                                className={`transition-all duration-300 rounded-full ${i === heroIdx ? 'bg-[#ffc000] w-7 h-2' : 'bg-white/30 hover:bg-white/60 w-2 h-2'}`}
                                aria-label={`Slide ${i + 1}`} />
                        ))}
                    </div>
                )}

                {/* Slide counter */}
                {heroImgs.length > 1 && (
                    <div className="absolute top-5 right-5 z-20 hidden md:block bg-black/40 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold px-3 py-1.5">
                        {String(heroIdx + 1).padStart(2, '0')} / {String(heroImgs.length).padStart(2, '0')}
                    </div>
                )}

                {/* Progress bar */}
                {heroImgs.length > 1 && !heroPaused && (
                    <motion.div
                        key={`prog-${heroIdx}`}
                        className="absolute top-0 left-0 h-[3px] bg-[#ffc000] z-20"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5.5, ease: 'linear' }}
                    />
                )}

                {/* Text overlay */}
                <div className="absolute inset-x-0 bottom-0 z-10 px-5 md:px-8 pb-5 md:pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="inline-flex flex-col gap-2 rounded-xl border border-white/20 bg-black/35 px-4 py-3 backdrop-blur-sm"
                    >
                        <p className="text-[#ffd24d] font-bold uppercase tracking-[0.32em] text-[10px]">
                            {heroLabel || 'Portfolio Collection'}
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-[0.95] tracking-tight text-white">
                            {heroTitle || 'Portfolio'}
                        </h1>
                    </motion.div>
                </div>
            </section>

            <div id="portfolio-collections" className="max-w-7xl mx-auto px-6 lg:px-12 pt-14 pb-28 md:pt-16 md:pb-32 scroll-mt-28">

                {/* ── Category filter ── */}
                {categories.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-0 mb-14 border-b border-[var(--app-border)]"
                    >
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-3 text-xs font-bold uppercase tracking-[0.28em] transition-all border-b-2 -mb-px ${
                                    activeCategory === cat
                                        ? 'border-[#ffc000] text-[#ffc000]'
                                        : 'border-transparent text-[var(--app-subtle)] hover:text-[var(--app-text)]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* ── Gallery sections ── */}
                {filteredGalleries.length === 0 && allMediaUrls.length === 0 ? (
                    <div className="py-24 text-center border border-[var(--app-border)]">
                        <p className="text-xl text-[var(--app-subtle)] font-display uppercase tracking-widest">No galleries yet. Add one in the admin.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-24 md:gap-28">
                        {filteredGalleries.map((gallery: any, gIdx: number) => {
                            const galleryImgs = [gallery.featuredImage, ...(gallery.images || [])].filter(Boolean);
                            return (
                                <motion.section
                                    key={gallery._id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.9 }}
                                    className="border-b border-white/8 pb-10 md:pb-12 last:border-b-0 last:pb-0"
                                >
                                    <GalleryHeader gallery={gallery} index={gIdx} frameCount={galleryImgs.length} />
                                    <GalleryLayout
                                        gallery={gallery}
                                        onOpen={(i) => openLightbox(galleryImgs, i)}
                                    />
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
                                className="border-b border-white/8 pb-10 md:pb-12 last:border-b-0 last:pb-0"
                            >
                                <div className="mb-7 md:mb-9">
                                    <div className="mb-4 h-px w-14 bg-[#d4af6a]/65 md:w-20" />
                                    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8">
                                        <div className="space-y-3 md:space-y-4">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                                <span className="text-[#d4af6a] font-display font-bold text-[11px] tracking-[0.28em] tabular-nums">
                                                    {String(filteredGalleries.length + 1).padStart(2, '0')}
                                                </span>
                                                <span className="h-px w-8 bg-[#d4af6a]/35 md:w-10" />
                                                <span className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/48">
                                                    Studio Archive
                                                </span>
                                            </div>
                                            <h2 className="max-w-4xl font-display font-bold text-[2rem] leading-[0.95] tracking-[0.02em] text-[#EAEAEA] md:text-[2.8rem]">
                                                From the Archives
                                            </h2>
                                            <p className="max-w-2xl text-[15px] leading-7 text-[rgba(255,255,255,0.68)] md:text-base md:leading-8">
                                                A wider sweep of moments, studies, and frames from the studio archive.
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-3 md:flex-col md:items-end md:justify-end md:border-t-0 md:pt-0">
                                            <span className="text-[11px] font-bold uppercase tracking-[0.36em] text-[#EAEAEA]">
                                                {allMediaUrls.length} Images
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/46">
                                                Archive
                                            </span>
                                        </div>
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
                                            <img src={toNoCropUrl(url)} alt={`Archive ${i + 1}`}
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
