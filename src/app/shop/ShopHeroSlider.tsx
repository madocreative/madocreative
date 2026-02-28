'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
    {
        img: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971882/mado-creatives/nlw9iu68433ngreltzwt.jpg',
        tag: 'New Arrivals',
        title: 'Premium Electronics',
        sub: 'Smartphones, Laptops & Creator Gear',
    },
    {
        img: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971892/mado-creatives/zupngrotm2mt5yqblvta.jpg',
        tag: 'Cameras & Equipment',
        title: 'Capture Every Moment',
        sub: 'Professional cameras & lenses',
    },
    {
        img: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/i8xewrxxjabg40c1nhd8.jpg',
        tag: 'Audio & Gadgets',
        title: 'Sound Perfected',
        sub: 'Headphones, speakers & studio gear',
    },
    {
        img: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971901/mado-creatives/nm1vvf8uukzdsq6ubiyq.jpg',
        tag: 'Laptops & Computers',
        title: 'Work Without Limits',
        sub: 'High-performance machines for creators',
    },
    {
        img: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971902/mado-creatives/gwd4ikdny7f7ve03wxnl.jpg',
        tag: 'Smartphones',
        title: 'Stay Connected',
        sub: 'Latest flagship phones & accessories',
    },
];

const AUTOPLAY_MS = 5000;

const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

export default function ShopHeroSlider() {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [paused, setPaused] = useState(false);

    const go = useCallback((next: number) => {
        const bounded = (next + SLIDES.length) % SLIDES.length;
        setDirection(next > index ? 1 : -1);
        setIndex(bounded);
    }, [index]);

    const goNext = useCallback(() => go(index + 1), [go, index]);
    const goPrev = useCallback(() => go(index - 1), [go, index]);

    useEffect(() => {
        if (paused) return;
        const t = setTimeout(goNext, AUTOPLAY_MS);
        return () => clearTimeout(t);
    }, [index, paused, goNext]);

    const slide = SLIDES[index];

    return (
        <section
            className="relative h-[70vh] md:h-[85vh] overflow-hidden bg-[#0a0a08] mx-3 md:mx-5 mt-[104px] md:mt-[116px] rounded-[1.55rem] border border-[var(--app-border)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Slides */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={index}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: [0.32, 0, 0.67, 0] }}
                    className="absolute inset-0"
                >
                    {/* Blurred ambient background — fills empty space */}
                    <img
                        src={slide.img}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30"
                        aria-hidden="true"
                    />
                    {/* Full image — object-contain so nothing is cropped */}
                    <img
                        src={slide.img}
                        alt={slide.title}
                        className="relative z-10 w-full h-full object-contain"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a08]/85 via-[#0a0a08]/40 to-[#0a0a08]/10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a08] via-transparent to-[#0a0a08]/30 pointer-events-none" />

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-16 md:pb-20 pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`text-${index}`}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.45, delay: 0.15 }}
                    >
                        <p className="text-[#ffc000] font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-2 flex items-center gap-3">
                            <span className="w-6 md:w-10 h-px bg-[#ffc000]" />
                            {slide.tag}
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold uppercase text-white leading-none tracking-tight mb-2">
                            {slide.title}
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base max-w-sm">{slide.sub}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Prev / Next arrows */}
            <button
                onClick={goPrev}
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#0a0a08] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
                aria-label="Previous"
            >
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">chevron_left</span>
            </button>
            <button
                onClick={goNext}
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#0a0a08] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
                aria-label="Next"
            >
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">chevron_right</span>
            </button>

            {/* Dot indicators + progress bar */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                        className={`transition-all duration-300 rounded-full ${i === index
                            ? 'bg-[#ffc000] w-7 h-2'
                            : 'bg-white/30 hover:bg-white/60 w-2 h-2'
                        }`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* Slide counter top-right */}
            <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold px-3 py-1.5 z-10 hidden md:block">
                {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </div>

            {/* Auto-play progress bar */}
            {!paused && (
                <motion.div
                    key={`progress-${index}`}
                    className="absolute bottom-0 left-0 h-[3px] bg-[#ffc000] z-10"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                />
            )}
        </section>
    );
}
