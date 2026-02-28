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

const AUTOPLAY_MS = 5500;

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
        setDirection(next > index ? 1 : -1);
        setIndex((next + SLIDES.length) % SLIDES.length);
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
            className="relative h-[56vh] md:h-[70vh] overflow-hidden bg-[#090805]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Sliding images */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={index}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6, ease: [0.32, 0, 0.67, 0] }}
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

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090805] via-[#090805]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090805]/85 via-[#090805]/30 to-transparent pointer-events-none" />

            {/* Prev / Next */}
            <button
                onClick={goPrev}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#090805] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                aria-label="Previous"
            >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
                onClick={goNext}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#090805] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                aria-label="Next"
            >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>

            {/* Dot indicators — bottom-left, aligned with text */}
            <div className="absolute bottom-16 left-6 md:left-20 z-20 flex items-center gap-2">
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

            {/* Slide counter — top-right */}
            <div className="absolute top-5 right-5 z-20 hidden md:block bg-black/40 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold px-3 py-1.5">
                {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </div>

            {/* Progress bar — top */}
            {!paused && (
                <motion.div
                    key={`prog-${index}`}
                    className="absolute top-0 left-0 h-[3px] bg-[#ffc000] z-20"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                />
            )}

            {/* Text overlay — bottom-left */}
            <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-8 lg:px-20 pb-8 md:pb-12 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-[#ffc000] font-bold uppercase tracking-[0.44em] text-[10px] mb-3 md:mb-4 flex items-center gap-4">
                        <span className="w-8 md:w-10 h-px bg-[#ffc000]" />
                        The Journal
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-display font-bold leading-[0.88] tracking-tight text-white">
                        Journal
                    </h1>
                </motion.div>
            </div>
        </section>
    );
}
