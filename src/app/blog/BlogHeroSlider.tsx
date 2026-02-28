'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/luhwozrxtp1u5oehdyej.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971885/mado-creatives/kgwmhi695gjdyey0qauv.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971887/mado-creatives/enbiztasgcryipz6x8py.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971889/mado-creatives/lgrj87iype8vbp5qiuzn.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971891/mado-creatives/kw9xzrjaw2mk62tv7z0o.jpg',
];

const AUTOPLAY_MS = 5000;

const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

export default function BlogHeroSlider() {
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

    return (
        <section
            className="relative h-[44vh] md:h-[52vh] overflow-hidden bg-[#0a0a08]"
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
                        src={SLIDES[index]}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30"
                        aria-hidden="true"
                    />
                    {/* Full image — object-contain so nothing is cropped */}
                    <img
                        src={SLIDES[index]}
                        alt=""
                        className="relative z-10 w-full h-full object-contain"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a08]/90 via-[#0a0a08]/50 to-[#0a0a08]/10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a08] via-transparent to-[#0a0a08]/30 pointer-events-none" />

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-8 lg:px-12 pb-8 md:pb-10 pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`text-${index}`}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.45, delay: 0.15 }}
                    >
                        <p className="text-[#ffc000] font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-2 flex items-center gap-3">
                            <span className="w-6 md:w-8 h-px bg-[#ffc000]" />
                            The Journal
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-none tracking-tight">
                            Journal
                        </h1>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Prev / Next arrows */}
            <button
                onClick={goPrev}
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#0a0a08] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
                aria-label="Previous"
            >
                <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">chevron_left</span>
            </button>
            <button
                onClick={goNext}
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#0a0a08] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
                aria-label="Next"
            >
                <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">chevron_right</span>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                        className={`transition-all duration-300 rounded-full ${i === index
                            ? 'bg-[#ffc000] w-6 h-1.5'
                            : 'bg-white/30 hover:bg-white/60 w-1.5 h-1.5'
                        }`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
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
