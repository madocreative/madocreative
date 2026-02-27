'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

interface GalleryItem {
    _id: string;
    title: string;
    category?: string;
    featuredImage?: string;
    images?: string[];
}

interface HighlightCard {
    stat: string;
    title: string;
    description: string;
}

interface ServicePillar {
    title: string;
    description: string;
    note: string;
}

interface ProcessStep {
    title: string;
    description: string;
}

interface ClientLogo {
    name: string;
    image: string;
}

interface StatItem {
    value: string;
    label: string;
}

interface HomeContent {
    title?: string;
    subtitle?: string;
    heroImage?: string;
    sections?: Record<string, unknown>;
}

const defaultHighlightCards: HighlightCard[] = [
    {
        stat: 'Creative + Tech',
        title: 'Dual Expertise Under One Studio',
        description:
            'Mado Creatives combines premium visual storytelling with trusted electronics solutions for modern brands and creators.',
    },
    {
        stat: 'International Reach',
        title: 'Multi-Country Presence',
        description:
            'Productions and client support run across Addis Ababa, Kigali, Nairobi, and Dubai with a consistent premium standard.',
    },
];

const defaultServicePillars: ServicePillar[] = [
    {
        title: 'Luxury Weddings and Events',
        description: 'Timeless coverage for engagements, private celebrations, and destination events with cinematic delivery.',
        note: 'Photography + Film',
    },
    {
        title: 'Fashion and Editorial',
        description: 'Bold campaign visuals for models, designers, and publications with direction tailored to brand identity.',
        note: 'Editorial Production',
    },
    {
        title: 'Commercial and Product',
        description: 'Clean, conversion-focused visuals for products, launches, and digital marketing assets across platforms.',
        note: 'Brand Campaigns',
    },
];

const defaultProcessSteps: ProcessStep[] = [
    { title: 'Consultation', description: 'We align on objectives, references, budget, and production priorities.' },
    { title: 'Creative Direction', description: 'Moodboards, shot list, styling direction, and production planning.' },
    { title: 'Production', description: 'Photo and video execution with on-set quality control and precision.' },
    { title: 'Delivery', description: 'Premium editing, final exports, and post-project support.' },
];

const defaultClientLogos: ClientLogo[] = [
    { name: 'Legacy Studio', image: '/client-logos/legacy-studio.jpg' },
    { name: 'Maraki Decorations', image: '/client-logos/maraki-decorations.jpg' },
    { name: 'Photo Factory', image: '/client-logos/photo-factory.jpg' },
    { name: 'Pop Studio', image: '/client-logos/pop-studio.jpg' },
    { name: 'Lumvra Visa Solution', image: '/client-logos/lumvra-visa-solution.jpg' },
    { name: 'Clicklvra Digital Marketing', image: '/client-logos/clicklvra.jpg' },
];

const defaultStats: StatItem[] = [
    { value: '15+', label: 'Years of Practice' },
    { value: '500+', label: 'Projects Delivered' },
    { value: '4', label: 'Operating Locations' },
    { value: '24/7', label: 'Client Support' },
];

const TICKER_LABELS = [
    'Photography', 'Editorial', 'Commercial', 'Weddings',
    'Fashion', 'Events', 'Portraits', 'Campaigns',
];

function getList<T>(value: unknown, fallback: T[]): T[] {
    return Array.isArray(value) ? (value as T[]) : fallback;
}

function getString(value: unknown, fallback: string): string {
    return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function ParallaxImage({
    src, alt, containerClassName, imageClassName, movement = 36, delay = 0,
}: {
    src: string; alt: string; containerClassName: string; imageClassName: string;
    movement?: number; delay?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], [movement, -movement]);
    return (
        <div ref={ref} className={containerClassName}>
            <motion.img
                src={src} alt={alt} className={imageClassName} style={{ y }}
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 1.1, delay, ease: 'easeOut' }}
            />
        </div>
    );
}

export default function HomeClient({
    content, galleries,
}: {
    content: HomeContent | null; galleries: GalleryItem[];
}) {
    const sections = content?.sections || {};

    const ctaText      = getString(sections.ctaText, 'View Portfolio');
    const ctaLink      = getString(sections.ctaLink, '/portfolio');
    const secondaryCtaLink = getString(sections.secondaryCtaLink, '/contact');
    const introDescription = getString(
        sections.introDescription,
        'From luxury weddings to commercial campaigns, Mado Creatives builds high-impact visuals that blend emotion, strategy, and international creative standards.',
    );

    const highlightCards  = getList<HighlightCard>(sections.highlightCards, defaultHighlightCards);
    const servicePillars  = getList<ServicePillar>(sections.servicePillars, defaultServicePillars);
    const processSteps    = getList<ProcessStep>(sections.processSteps, defaultProcessSteps);
    const clientLogos     = getList<ClientLogo>(sections.clientLogos, defaultClientLogos);
    const stats           = getList<StatItem>(sections.stats, defaultStats);
    const ctaTitle        = getString(sections.ctaTitle, 'Ready to build your next visual campaign?');
    const ctaSubtitle     = getString(sections.ctaSubtitle, 'Book a photography session, request a campaign shoot, or discuss a custom production plan with our team.');
    const ctaButtonLink   = getString(sections.ctaButtonLink, '/booking');

    const heroImgs = [content?.heroImage, ...galleries.flatMap(g => [g.featuredImage, ...(g.images || [])])]
        .filter((img): img is string => typeof img === 'string' && img.length > 0)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 5);

    const featureGallery = galleries[0];
    const ctaBgGallery   = galleries[galleries.length - 1];

    // Portfolio grid: col spans and aspect ratios per index (Z-pattern)
    const gridColSpan = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7', 'md:col-span-6', 'md:col-span-6'];
    const gridAspect  = ['aspect-[16/10]', 'aspect-[16/10]', 'aspect-[4/3]', 'aspect-[4/3]', 'aspect-[4/3]', 'aspect-[4/3]'];

    return (
        <div className="flex flex-col bg-[#090805] text-[#f2efe7]">

            {/* ═══════════════════════════════════════════════════════
                1. HERO — cinematic 3-col grid + left text + ticker
            ═══════════════════════════════════════════════════════ */}
            <section className="relative h-screen flex flex-col overflow-hidden">

                {/* Background: 3-col 2-row image grid */}
                {heroImgs.length > 0 ? (
                    <div className="absolute inset-0 grid grid-cols-[1.35fr_1fr_1fr] grid-rows-2 gap-[2px] bg-[#090805]">
                        {heroImgs.map((img, i) => (
                            <div
                                key={`hero-${i}`}
                                className={`overflow-hidden bg-[#0d0b07] ${i === 0 ? 'row-span-2' : ''}`}
                            >
                                <motion.img
                                    src={img} alt=""
                                    className="w-full h-full object-cover"
                                    initial={{ opacity: 0, scale: 1.08 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1.5, delay: i * 0.12, ease: 'easeOut' }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-[#090805]" />
                )}

                {/* Directional overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#090805]/95 via-[#090805]/55 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090805]/75 via-transparent to-[#090805]/30" />

                {/* Hero text — vertically centred */}
                <div className="relative z-10 flex-1 flex items-center px-8 lg:px-20">
                    <motion.div
                        initial={{ opacity: 0, y: 36 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.05, ease: 'easeOut' }}
                        className="max-w-2xl"
                    >
                        <p className="text-[#ffc000] font-bold tracking-[0.44em] uppercase text-[10px] mb-8 flex items-center gap-4">
                            <span className="block w-10 h-px bg-[#ffc000]" />
                            Mado Creatives Studio
                        </p>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.9] tracking-tight mb-8">
                            Where Vision<br />Becomes<br />
                            <span className="text-[#ffc000]">Visual Legacy.</span>
                        </h1>
                        <p className="text-base md:text-lg text-[#c3bcab] max-w-lg leading-relaxed mb-10">
                            Premium visual storytelling for brands, entrepreneurs, and modern creatives across Africa and beyond.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={ctaLink}
                                className="inline-flex items-center gap-2 bg-[#ffc000] text-[#090805] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors"
                            >
                                {ctaText}
                                <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                            </Link>
                            <Link
                                href={secondaryCtaLink}
                                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:border-[#ffc000] hover:text-[#ffc000] transition-colors"
                            >
                                Start a Project
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator — sits above ticker */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                    className="relative z-10 px-8 lg:px-20 pb-20 flex items-center gap-3 text-[#6b6250]"
                >
                    <span className="block w-px h-10 bg-[#ffc000]/45" />
                    <span className="text-[10px] uppercase tracking-[0.38em]">Scroll to Explore</span>
                </motion.div>

                {/* Bottom ticker strip */}
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#ffc000] z-20 flex items-center overflow-hidden">
                    <motion.div
                        className="flex items-center whitespace-nowrap"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ duration: 28, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                        style={{ width: 'max-content' }}
                    >
                        {[...TICKER_LABELS, ...TICKER_LABELS].map((label, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-7 px-7 text-[#090805] font-bold text-[11px] uppercase tracking-[0.38em]"
                            >
                                {label}
                                <span className="text-[#090805]/25 text-[7px]">◆</span>
                            </span>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                2. ABOUT — split: editorial text left, cards + image right
            ═══════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-[#0d0c08]">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="flex items-center gap-5 mb-16">
                        <span className="w-12 h-px bg-[#ffc000]" />
                        <p className="text-[#ffc000] font-bold tracking-[0.42em] uppercase text-[11px]">About the Studio</p>
                    </div>

                    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-24 items-start">

                        {/* Left — large text */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.0] text-white mb-8">
                                Creative Agency.<br />Premium Production<br />Partner.
                            </h2>
                            <p className="text-[#c3bcab] leading-relaxed text-base md:text-lg mb-10 max-w-lg">
                                {introDescription}
                            </p>
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 text-[#ffc000] uppercase tracking-[0.26em] text-xs font-bold border-b border-[#ffc000]/40 pb-1 hover:text-white hover:border-white/30 transition-colors"
                            >
                                Explore Services
                                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                            </Link>

                            {/* Mini stats below text */}
                            <div className="grid grid-cols-2 gap-6 mt-14 pt-10 border-t border-white/10">
                                {stats.slice(0, 2).map((s, i) => (
                                    <div key={i}>
                                        <p className="text-4xl md:text-5xl font-display font-bold text-[#ffc000] leading-none mb-2">{s.value}</p>
                                        <p className="text-[11px] uppercase tracking-[0.22em] text-[#6b6250] font-bold">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right — highlight cards + featured gallery image */}
                        <div className="flex flex-col gap-5">
                            {highlightCards.map((card, idx) => (
                                <motion.article
                                    key={idx}
                                    initial={{ opacity: 0, x: 28 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: idx * 0.12 }}
                                    className="bg-[#141210] border border-white/10 p-6 md:p-7 hover:border-[#ffc000]/25 transition-colors group"
                                >
                                    <p className="text-[#ffc000] text-[10px] uppercase tracking-[0.32em] font-bold mb-3">{card.stat}</p>
                                    <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-[#ffc000] transition-colors">{card.title}</h3>
                                    <p className="text-sm text-[#9a9078] leading-relaxed">{card.description}</p>
                                </motion.article>
                            ))}

                            {/* Featured gallery preview */}
                            {featureGallery && (featureGallery.featuredImage || featureGallery.images?.[0]) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.25 }}
                                    className="relative aspect-[16/10] overflow-hidden bg-[#0d0c08]"
                                >
                                    <img
                                        src={featureGallery.featuredImage || featureGallery.images![0]}
                                        alt={featureGallery.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#090805]/70 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#ffc000] mb-1">
                                            {featureGallery.category || 'Portfolio'}
                                        </p>
                                        <p className="text-white font-display font-bold text-sm">{featureGallery.title}</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                3. SERVICES — editorial magazine numbered list
            ═══════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-[#060504]">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">

                    <div className="flex items-center justify-between mb-16">
                        <div className="flex items-center gap-5">
                            <span className="w-12 h-px bg-[#ffc000]" />
                            <p className="text-[#ffc000] font-bold tracking-[0.42em] uppercase text-[11px]">Signature Services</p>
                        </div>
                        <Link
                            href="/services"
                            className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/35 hover:text-[#ffc000] transition-colors"
                        >
                            All Services
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="border-t border-white/10">
                        {servicePillars.map((pillar, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.65, delay: idx * 0.1 }}
                                className="group grid grid-cols-[60px_1fr] md:grid-cols-[88px_1fr_auto] items-center gap-6 md:gap-14 py-10 md:py-14 border-b border-white/10 hover:bg-white/[0.02] transition-colors cursor-default"
                            >
                                {/* Large number */}
                                <span className="text-5xl md:text-7xl font-display font-bold text-[#ffc000]/15 group-hover:text-[#ffc000]/45 transition-colors leading-none tabular-nums select-none">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>

                                {/* Title + desc */}
                                <div className="min-w-0">
                                    <h3 className="text-2xl md:text-4xl font-display font-bold text-white group-hover:text-[#ffc000] transition-colors leading-tight mb-3">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-[#7a7260] text-sm md:text-base leading-relaxed">{pillar.description}</p>
                                </div>

                                {/* Right label + arrow */}
                                <div className="hidden lg:flex flex-col items-end gap-3 flex-shrink-0">
                                    <p className="text-[10px] uppercase tracking-[0.32em] text-[#5c5544] font-bold">{pillar.note}</p>
                                    <span className="material-symbols-outlined text-[#ffc000]/25 group-hover:text-[#ffc000] transition-colors">
                                        arrow_outward
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                4. PORTFOLIO — Z-pattern asymmetric editorial grid
            ═══════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-[#0a0906]">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="flex items-center gap-5 mb-5">
                                <span className="w-12 h-px bg-[#ffc000]" />
                                <p className="text-[#ffc000] font-bold uppercase tracking-[0.42em] text-[11px]">Portfolio Showcase</p>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-display font-bold text-white">Selected Work.</h2>
                        </motion.div>
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50 border border-white/15 px-5 py-2.5 hover:border-[#ffc000] hover:text-[#ffc000] transition-colors self-start lg:self-auto flex-shrink-0"
                        >
                            View Full Portfolio
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-12 gap-3">
                        {galleries.slice(0, 6).map((gallery, idx) => {
                            const img = gallery.featuredImage || gallery.images?.[0];
                            const colSpan = gridColSpan[idx] ?? 'md:col-span-6';
                            const aspect  = gridAspect[idx]  ?? 'aspect-[4/3]';
                            return (
                                <motion.a
                                    key={gallery._id}
                                    href="/portfolio"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.7, delay: idx * 0.09 }}
                                    className={`group relative overflow-hidden bg-[#111109] ${colSpan} ${aspect}`}
                                >
                                    {img ? (
                                        <img
                                            src={img}
                                            alt={gallery.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#8a816f] text-sm uppercase tracking-widest">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#090805]/90 via-[#090805]/15 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-[#ffc000] uppercase tracking-[0.22em] text-[10px] font-bold mb-2">
                                            {gallery.category || 'Portfolio'}
                                        </p>
                                        <div className="flex items-end justify-between gap-3">
                                            <h3 className="text-lg md:text-2xl font-display font-bold text-white leading-tight">
                                                {gallery.title}
                                            </h3>
                                            <span className="material-symbols-outlined text-[#ffc000] flex-shrink-0">arrow_outward</span>
                                        </div>
                                    </div>
                                </motion.a>
                            );
                        })}
                        {galleries.length === 0 && (
                            <div className="md:col-span-12 py-20 text-center text-[#8a816f] border border-white/10 uppercase tracking-widest text-sm">
                                No galleries yet.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                5. PROCESS — numbered squares on connecting line
            ═══════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-[#0e0d09]">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">

                    <div className="grid md:grid-cols-2 gap-6 items-end mb-16">
                        <div>
                            <div className="flex items-center gap-5 mb-6">
                                <span className="w-12 h-px bg-[#ffc000]" />
                                <p className="text-[#ffc000] font-bold tracking-[0.42em] uppercase text-[11px]">How We Work</p>
                            </div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="text-4xl md:text-5xl font-display font-bold text-white leading-tight"
                            >
                                A Clear<br />Production Flow.
                            </motion.h2>
                        </div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.12 }}
                            className="text-[#9a9078] leading-relaxed text-base md:text-lg"
                        >
                            Our process keeps every project strategic, efficient, and creatively strong from first brief to final delivery.
                        </motion.p>
                    </div>

                    <div className="relative">
                        {/* Connecting line — desktop */}
                        <div
                            className="hidden md:block absolute left-9 right-9 bg-white/8 h-px"
                            style={{ top: '2.2rem' }}
                        />
                        <div className="grid md:grid-cols-4 gap-8">
                            {processSteps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 26 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.14 }}
                                    className="relative"
                                >
                                    {/* Square numbered badge */}
                                    <div className="w-[4.4rem] h-[4.4rem] flex items-center justify-center border border-[#ffc000]/30 bg-[#0e0d09] mb-7 relative z-10">
                                        <span className="text-[#ffc000] font-bold font-display text-xl">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-display font-bold text-white mb-3">{step.title}</h3>
                                    <p className="text-sm text-[#7a7260] leading-relaxed">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                6. STATS — mega numbers, 4-column borderless
            ═══════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#090805] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.09 }}
                                className={[
                                    'px-6 md:px-10 py-12 text-center',
                                    idx < 3 ? 'border-r border-white/8' : '',
                                    idx < 2 ? 'border-b border-white/8 lg:border-b-0' : '',
                                ].join(' ')}
                            >
                                <p className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-[#ffc000] leading-none mb-4">
                                    {stat.value}
                                </p>
                                <p className="text-[10px] uppercase tracking-[0.28em] text-[#5c5544] font-bold">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                7. CLIENTS — infinite horizontal marquee
            ═══════════════════════════════════════════════════════ */}
            <section className="py-20 md:py-24 bg-[#0c0b07]">
                <div className="max-w-7xl mx-auto px-6 lg:px-16 mb-12">
                    <div className="flex items-center gap-5 mb-5">
                        <span className="w-12 h-px bg-[#ffc000]" />
                        <p className="text-[#ffc000] font-bold tracking-[0.42em] uppercase text-[11px]">Trusted by Past Clients</p>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Brands We've Worked With.</h2>
                </div>

                {/* Marquee */}
                <div className="overflow-hidden border-y border-white/5 py-8">
                    <motion.div
                        className="flex items-center gap-5 whitespace-nowrap"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                        style={{ width: 'max-content' }}
                    >
                        {[...clientLogos, ...clientLogos].map((logo, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 bg-[#ece5d6] w-36 h-20 md:w-44 md:h-24 flex items-center justify-center px-4"
                            >
                                <img src={logo.image} alt={logo.name} className="w-full h-14 object-contain" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                8. CTA — dark editorial with gallery background
            ═══════════════════════════════════════════════════════ */}
            <section className="relative py-28 md:py-40 bg-[#060504] overflow-hidden">
                {/* Subtle background image */}
                {ctaBgGallery && (ctaBgGallery.featuredImage || ctaBgGallery.images?.[0]) && (
                    <div className="absolute inset-0">
                        <img
                            src={ctaBgGallery.featuredImage || ctaBgGallery.images![0]}
                            alt=""
                            className="w-full h-full object-cover opacity-10"
                        />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#060504] via-[#060504]/93 to-[#060504]/65" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffc000]/35 to-transparent" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.85 }}
                    >
                        <div className="flex items-center gap-5 mb-10">
                            <span className="w-12 h-px bg-[#ffc000]" />
                            <p className="text-[#ffc000] font-bold tracking-[0.42em] uppercase text-[11px]">Start Your Project</p>
                        </div>
                        <h2 className="text-5xl md:text-7xl lg:text-[5rem] font-display font-bold text-white leading-[0.92] mb-8 max-w-4xl">
                            {ctaTitle}
                        </h2>
                        <p className="text-[#7a7260] text-lg mb-14 max-w-xl leading-relaxed">{ctaSubtitle}</p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={ctaButtonLink}
                                className="inline-flex items-center gap-2 bg-[#ffc000] text-[#090805] px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] hover:bg-white transition-colors"
                            >
                                Book a Session
                                <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 border border-white/20 text-white px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] hover:border-[#ffc000] hover:text-[#ffc000] transition-colors"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
