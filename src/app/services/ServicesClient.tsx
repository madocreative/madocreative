'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface ServiceItem { title: string; description: string; image: string; tags: string }
interface StatItem    { value: string; label: string }

interface PageData {
    title: string;
    subtitle: string;
    stats: StatItem[];
    services: ServiceItem[];
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    ctaLink?: string;
    ctaSecondaryButton?: string;
    ctaSecondaryLink?: string;
}

const heroSlideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

export default function ServicesClient({ data }: { data: PageData }) {
    const heroImgs = data.services.map(s => s.image).filter(Boolean);

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
        const t = setTimeout(goHeroNext, 5000);
        return () => clearTimeout(t);
    }, [heroIdx, heroPaused, goHeroNext, heroImgs.length]);

    return (
        <div className="flex flex-col bg-[#090805] text-[#f2efe7]">

            {/* ══════════════════════════════════════════════════
                HERO — full-width image slider
            ══════════════════════════════════════════════════ */}
            <section
                className="relative h-[56vh] md:h-[70vh] overflow-hidden bg-[#090805]"
                onMouseEnter={() => setHeroPaused(true)}
                onMouseLeave={() => setHeroPaused(false)}
            >
                {/* Slides */}
                {heroImgs.length > 0 ? (
                    <AnimatePresence initial={false} custom={heroDir} mode="popLayout">
                        <motion.div
                            key={heroIdx}
                            custom={heroDir}
                            variants={heroSlideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.55, ease: [0.32, 0, 0.67, 0] }}
                            className="absolute inset-0"
                        >
                            {/* Blurred ambient background */}
                            <img
                                src={heroImgs[heroIdx]}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30"
                                aria-hidden="true"
                            />
                            {/* Full image — object-contain so nothing is cropped */}
                            <img
                                src={heroImgs[heroIdx]}
                                alt=""
                                className="relative z-10 w-full h-full object-contain"
                            />
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="absolute inset-0 bg-[#0d0c08]" />
                )}

                {/* Directional overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#090805] via-[#090805]/80 to-[#090805]/20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090805] via-transparent to-[#090805]/40 pointer-events-none" />

                {/* Text overlay */}
                <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-8 lg:px-20 max-w-[680px] pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.44em] text-[10px] mb-5 md:mb-6 flex items-center gap-4">
                            <span className="w-8 md:w-10 h-px bg-[#ffc000]" />
                            What We Do
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.92] tracking-tight mb-4 md:mb-6">
                            {data.title}
                        </h1>
                        <p className="text-[#c3bcab] text-sm md:text-lg leading-relaxed max-w-lg hidden sm:block">
                            {data.subtitle}
                        </p>
                    </motion.div>
                </div>

                {/* Prev / Next arrows */}
                {heroImgs.length > 1 && (
                    <>
                        <button
                            onClick={goHeroPrev}
                            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#090805] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
                            aria-label="Previous"
                        >
                            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">chevron_left</span>
                        </button>
                        <button
                            onClick={goHeroNext}
                            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#090805] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
                            aria-label="Next"
                        >
                            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">chevron_right</span>
                        </button>
                    </>
                )}

                {/* Dot indicators */}
                {heroImgs.length > 1 && (
                    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                        {heroImgs.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setHeroDir(i > heroIdx ? 1 : -1); setHeroIdx(i); }}
                                className={`transition-all duration-300 rounded-full ${i === heroIdx
                                    ? 'bg-[#ffc000] w-6 h-1.5'
                                    : 'bg-white/30 hover:bg-white/60 w-1.5 h-1.5'
                                }`}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Auto-play progress bar */}
                {heroImgs.length > 1 && !heroPaused && (
                    <motion.div
                        key={`progress-${heroIdx}`}
                        className="absolute bottom-0 left-0 h-[3px] bg-[#ffc000] z-10"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: 'linear' }}
                    />
                )}

                {/* Stats bar — horizontally scrollable on mobile */}
                {data.stats.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-[#ffc000] z-10">
                        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <div className="flex items-center gap-6 md:gap-10 px-6 md:px-8 lg:px-20 py-3 md:py-4 min-w-max">
                                {data.stats.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                                        <span className="text-[#090805] font-display font-bold text-lg md:text-2xl">{s.value}</span>
                                        <span className="text-[#090805]/60 text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.28em] font-bold">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* ══════════════════════════════════════════════════
                SERVICE BLOCKS — edge-to-edge alternating sections
            ══════════════════════════════════════════════════ */}
            {data.services.map((service, index) => {
                const tags = service.tags ? service.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                const reverse = index % 2 !== 0;
                const bgColor = index % 2 === 0 ? 'bg-[#090805]' : 'bg-[#0d0c08]';

                return (
                    <section key={index} className={`w-full ${bgColor} border-b border-white/5`}>
                        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch min-h-[540px]`}>

                            {/* Image — fills its half edge-to-edge */}
                            <motion.div
                                initial={{ opacity: 0, x: reverse ? 30 : -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 1.0 }}
                                className="w-full lg:w-1/2 overflow-hidden bg-[#111109] min-h-[320px] lg:min-h-0"
                            >
                                {service.image ? (
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover"
                                        style={{ minHeight: '320px' }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center min-h-[400px] bg-[#1a1812]">
                                        <span className="material-symbols-outlined text-[#4a4438] text-7xl">image</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Text — flex col justify-center */}
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.9, delay: 0.15 }}
                                className="relative w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 xl:px-20 py-14 lg:py-20 overflow-hidden"
                            >
                                {/* Large faded background number */}
                                <span
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[140px] lg:text-[180px] font-display font-bold leading-none select-none pointer-events-none"
                                    style={{ color: 'rgba(255,192,0,0.04)' }}
                                    aria-hidden
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8 flex-wrap">
                                        <span className="text-[#ffc000] font-display font-bold text-sm">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="w-6 h-px bg-[#ffc000]/40" />
                                        {tags.map((tag, i) => (
                                            <span key={i} className="text-[10px] uppercase tracking-[0.28em] text-[#6b6250] border border-white/10 px-3 py-1 font-bold">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
                                        {service.title}
                                    </h2>
                                    <p className="text-[#9a9078] text-base leading-relaxed mb-10 max-w-md">
                                        {service.description}
                                    </p>

                                    <Link
                                        href="/portfolio"
                                        className="group/lnk inline-flex items-center gap-3 text-white font-bold uppercase tracking-[0.22em] text-xs hover:text-[#ffc000] transition-colors w-fit"
                                    >
                                        <span className="w-8 h-px bg-[#ffc000] transition-all duration-300 group-hover/lnk:w-14" />
                                        View Related Work
                                        <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover/lnk:translate-x-1">
                                            arrow_right_alt
                                        </span>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                );
            })}

            {/* ══════════════════════════════════════════════════
                CTA — dark editorial, left-aligned
            ══════════════════════════════════════════════════ */}
            <section className="relative py-28 md:py-36 bg-[#060504] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffc000]/30 to-transparent" />
                <div className="max-w-7xl mx-auto px-8 lg:px-20">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.85 }}
                    >
                        <div className="flex items-center gap-5 mb-10">
                            <span className="w-12 h-px bg-[#ffc000]" />
                            <p className="text-[#ffc000] font-bold tracking-[0.42em] uppercase text-[11px]">Next Step</p>
                        </div>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[0.92] mb-8 max-w-3xl">
                            {data.ctaTitle}
                        </h2>
                        <p className="text-[#7a7260] text-lg mb-12 max-w-xl leading-relaxed">{data.ctaSubtitle}</p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={data.ctaLink || '/contact'}
                                className="inline-flex items-center gap-2 bg-[#ffc000] text-[#090805] px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] hover:bg-white transition-colors"
                            >
                                {data.ctaButton}
                                <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                            </Link>
                            <Link
                                href={data.ctaSecondaryLink || '/portfolio'}
                                className="inline-flex items-center gap-2 border border-white/20 text-white px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] hover:border-[#ffc000] hover:text-[#ffc000] transition-colors"
                            >
                                {data.ctaSecondaryButton || 'View Portfolio'}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
