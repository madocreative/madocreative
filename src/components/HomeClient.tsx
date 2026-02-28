'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────── */
interface GalleryItem {
    _id: string;
    title: string;
    category?: string;
    layout?: string;
    description?: string;
    featuredImage?: string;
    images?: string[];
}
interface ServicePillar  { title: string; description: string; note: string; }
interface ProcessStep    { title: string; description: string; }
interface ClientLogo     { name: string; image: string; }
interface StatItem       { value: string; label: string; }
interface HomeContent    { title?: string; subtitle?: string; heroImage?: string; sections?: Record<string, unknown>; }

/* ─────────────────────────────────────────────────────────────────
   DEFAULTS
───────────────────────────────────────────────────────────────── */
const defaultServicePillars: ServicePillar[] = [
    { title: 'Luxury Weddings and Events', description: 'Timeless coverage for engagements, private celebrations, and destination events with cinematic delivery.', note: 'Photography + Film' },
    { title: 'Fashion and Editorial', description: 'Bold campaign visuals for models, designers, and publications with direction tailored to brand identity.', note: 'Editorial Production' },
    { title: 'Commercial and Product', description: 'Clean, conversion-focused visuals for products, launches, and digital marketing assets across platforms.', note: 'Brand Campaigns' },
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
const TICKER_LABELS = ['Photography', 'Editorial', 'Commercial', 'Weddings', 'Fashion', 'Events', 'Portraits', 'Campaigns'];

/* ─────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────── */
function getList<T>(v: unknown, fb: T[]): T[] { return Array.isArray(v) ? (v as T[]) : fb; }
function getString(v: unknown, fb: string): string { return typeof v === 'string' && v.trim() ? v : fb; }

/* ─────────────────────────────────────────────────────────────────
   PARALLAX IMAGE — reusable component
───────────────────────────────────────────────────────────────── */
function ParallaxImage({
    src, alt, containerClassName, imageClassName, movement = 36, delay = 0,
}: { src: string; alt: string; containerClassName: string; imageClassName: string; movement?: number; delay?: number; }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], [movement, -movement]);
    return (
        <div ref={ref} className={containerClassName}>
            <motion.img src={src} alt={alt} className={imageClassName} style={{ y }}
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1.2, delay, ease: 'easeOut' }}
            />
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   SECTION LABEL — reusable eyebrow label
───────────────────────────────────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-5 mb-6">
            <span className="w-12 h-px bg-[#ffc000]" />
            <p className="text-[#ffc000] font-bold tracking-[0.42em] uppercase text-[11px]">{text}</p>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────── */
export default function HomeClient({ content, galleries }: { content: HomeContent | null; galleries: GalleryItem[] }) {
    const sections         = content?.sections || {};
    const ctaText          = getString(sections.ctaText,           'View Portfolio');
    const ctaLink          = getString(sections.ctaLink,           '/portfolio');
    const secondaryCtaLink = getString(sections.secondaryCtaLink,  '/contact');
    const introDescription = getString(sections.introDescription,  'From luxury weddings to commercial campaigns, Mado Creatives builds high-impact visuals that blend emotion, strategy, and international creative standards.');
    // highlightCards removed — section replaced by dense gallery grid
    const servicePillars   = getList<ServicePillar>(sections.servicePillars,  defaultServicePillars);
    const processSteps     = getList<ProcessStep>(sections.processSteps,      defaultProcessSteps);
    const clientLogos      = getList<ClientLogo>(sections.clientLogos,        defaultClientLogos);
    const stats            = getList<StatItem>(sections.stats,                defaultStats);
    const ctaTitle         = getString(sections.ctaTitle,       'Ready to build your next visual campaign?');
    const ctaSubtitle      = getString(sections.ctaSubtitle,    'Book a photography session, request a campaign shoot, or discuss a custom production plan with our team.');
    const ctaButtonLink    = getString(sections.ctaButtonLink,  '/booking');

    // Hero images: CMS heroImage first, then gallery images
    const heroImgs = [content?.heroImage, ...galleries.flatMap(g => [g.featuredImage, ...(g.images || [])])]
        .filter((img): img is string => typeof img === 'string' && img.length > 0)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 5);

    // Gallery reel: all unique images from all galleries
    const reelImgs = galleries.flatMap(g => [g.featuredImage, ...(g.images || [])].filter(Boolean)) as string[];
    const reelRow1 = reelImgs.filter((_, i) => i % 2 === 0).slice(0, 14);
    const reelRow2 = reelImgs.filter((_, i) => i % 2 === 1).slice(0, 14);

    // All gallery images for the dense "Our Work" grid
    const workImages        = galleries.flatMap(g => [g.featuredImage, ...(g.images || [])].filter(Boolean)) as string[];
    // Unique categories for pill tags
    const galleryCategories = Array.from(new Set(galleries.map(g => g.category).filter(Boolean))) as string[];

    const statsParallaxImg  = galleries[2]?.featuredImage || galleries[0]?.featuredImage;
    const ctaBgImg          = galleries[0]?.featuredImage;
    const servicesImg       = galleries[1]?.featuredImage || galleries[0]?.featuredImage;

    return (
        <div className="flex flex-col bg-[#090805] text-[#f2efe7]">

            {/* ══════════════════════════════════════════════════════════
                1. HERO — cinematic 3-col parallax grid + text + ticker
            ══════════════════════════════════════════════════════════ */}
            <HeroSection heroImgs={heroImgs} ctaText={ctaText} ctaLink={ctaLink} secondaryCtaLink={secondaryCtaLink} />

            {/* ══════════════════════════════════════════════════════════
                2. GALLERY REEL — double-row auto-scroll strip
            ══════════════════════════════════════════════════════════ */}
            {reelImgs.length > 0 && (
                <Link href="/portfolio" className="block relative overflow-hidden bg-[#060504] group cursor-pointer">
                    {/* Top + bottom gradient blend */}
                    <div className="absolute inset-0 pointer-events-none z-10">
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#090805] to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#060504] to-transparent" />
                        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#060504] to-transparent" />
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#060504] to-transparent" />
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#090805]/0 group-hover:bg-[#090805]/40 flex items-center justify-center z-20 transition-all duration-500">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center gap-3 border border-[#ffc000]/60 text-[#ffc000] px-8 py-3 text-xs font-bold uppercase tracking-[0.32em] bg-[#090805]/70">
                            Explore Portfolio
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-0.5 py-0.5">
                        {/* Row 1 — scrolls left */}
                        {reelRow1.length > 0 && (
                            <div className="overflow-hidden h-[130px] md:h-[160px]">
                                <motion.div
                                    className="flex gap-0.5"
                                    style={{ width: 'max-content' }}
                                    animate={{ x: ['0%', '-50%'] }}
                                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                                >
                                    {[...reelRow1, ...reelRow1].map((img, i) => (
                                        <div key={i} className="flex-none w-[200px] md:w-[260px] h-[130px] md:h-[160px] overflow-hidden bg-[#0d0c08]">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        )}
                        {/* Row 2 — scrolls right */}
                        {reelRow2.length > 0 && (
                            <div className="overflow-hidden h-[130px] md:h-[160px]">
                                <motion.div
                                    className="flex gap-0.5"
                                    style={{ width: 'max-content' }}
                                    animate={{ x: ['-50%', '0%'] }}
                                    transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
                                >
                                    {[...reelRow2, ...reelRow2].map((img, i) => (
                                        <div key={i} className="flex-none w-[200px] md:w-[260px] h-[130px] md:h-[160px] overflow-hidden bg-[#0d0c08]">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        )}
                    </div>
                </Link>
            )}

            {/* ══════════════════════════════════════════════════════════
                3. ABOUT — parallax split: text left, tall image right
            ══════════════════════════════════════════════════════════ */}
            <section className="py-28 md:py-40 bg-[#f9f8f5] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <SectionLabel text="About the Studio" />

                    <div className="grid lg:grid-cols-[1.15fr_1fr] gap-16 lg:gap-28 items-start">
                        {/* Left */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.85 }}
                        >
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.0] text-[#111009] mb-8">
                                Creative Agency.<br />Premium Production<br />
                                <span className="text-[#ffc000]">Partner.</span>
                            </h2>
                            <p className="text-[#4a4535] leading-relaxed text-base md:text-lg mb-10 max-w-lg">
                                {introDescription}
                            </p>
                            <Link href="/services"
                                className="inline-flex items-center gap-2 text-[#ffc000] uppercase tracking-[0.26em] text-xs font-bold border-b border-[#ffc000]/60 pb-1 hover:text-[#111009] hover:border-[#111009]/40 transition-colors">
                                Explore Services
                                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                            </Link>

                            <div className="grid grid-cols-2 gap-8 mt-16 pt-10 border-t border-black/10">
                                {stats.slice(0, 2).map((s, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: i * 0.12 }}>
                                        <p className="text-5xl md:text-6xl font-display font-bold text-[#ffc000] leading-none mb-3">{s.value}</p>
                                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#6b6250] font-bold">{s.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right — tall parallax image */}
                        {(galleries[0]?.featuredImage) && (
                            <div className="relative hidden lg:block">
                                {/* Gold vertical accent */}
                                <div className="absolute -left-14 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#ffc000]/40 to-transparent" />
                                <ParallaxImage
                                    src={galleries[0].featuredImage!}
                                    alt="Featured work"
                                    containerClassName="relative aspect-[3/4] overflow-hidden bg-[#e8e4dc]"
                                    imageClassName="w-full h-[120%] object-cover"
                                    movement={60}
                                />
                                {/* Overlay caption */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#111009]/80 to-transparent">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#ffc000] mb-1">{galleries[0]?.category || 'Featured'}</p>
                                    <p className="text-white font-display font-bold text-base">{galleries[0]?.title}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                4. OUR WORK — dense masonry image grid (Legacy Studio style)
            ══════════════════════════════════════════════════════════ */}
            {workImages.length > 0 && (
                <section className="bg-[#090805] pb-20">
                    {/* Section header */}
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <SectionLabel text="Our Work" />
                            <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-none">
                                Selected <span className="text-[#ffc000]">Work.</span>
                            </h2>
                        </motion.div>
                        <Link href="/portfolio"
                            className="self-start inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50 border border-white/15 px-5 py-3 hover:border-[#ffc000] hover:text-[#ffc000] transition-colors flex-shrink-0">
                            Full Portfolio
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                    </div>

                    {/* Dense masonry grid — full-bleed, tight gaps */}
                    <div className="px-1 md:px-2">
                        <div className="columns-2 sm:columns-3 lg:columns-4 gap-px">
                            {workImages.slice(0, 24).map((img, i) => (
                                <motion.a
                                    key={i}
                                    href="/portfolio"
                                    className="break-inside-avoid mb-px block overflow-hidden group relative bg-[#0d0c08] cursor-pointer"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true, margin: '-30px' }}
                                    transition={{ duration: 0.55, delay: Math.min(i * 0.025, 0.35) }}
                                >
                                    <img
                                        src={img} alt=""
                                        className="w-full h-auto object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out block"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-400" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="material-symbols-outlined text-white text-[28px]">open_in_full</span>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Category pill tags + CTA */}
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 flex flex-col items-center gap-8">
                        {galleryCategories.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="flex flex-wrap gap-2.5 justify-center"
                            >
                                {['All Work', ...galleryCategories].map(cat => (
                                    <Link
                                        key={cat}
                                        href="/portfolio"
                                        className="rounded-full border border-white/15 px-5 py-2 text-[11px] font-medium text-white/50 uppercase tracking-[0.22em] hover:border-[#ffc000] hover:text-[#ffc000] transition-all duration-200"
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </motion.div>
                        )}
                        <Link href="/portfolio"
                            className="inline-flex items-center gap-3 bg-[#ffc000] text-[#090805] px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] hover:bg-white transition-colors">
                            View All {galleries.length} Galleries
                            <span className="material-symbols-outlined text-[18px]">collections</span>
                        </Link>
                    </div>
                </section>
            )}

            {/* ══════════════════════════════════════════════════════════
                5. SERVICES — numbered list + tall parallax image column
            ══════════════════════════════════════════════════════════ */}
            <section className="py-28 md:py-40 bg-[#f9f8f5] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <SectionLabel text="Signature Services" />
                        </div>
                        <Link href="/services"
                            className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6b6250] hover:text-[#ffc000] transition-colors">
                            All Services
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_360px] gap-16 items-start">
                        {/* Numbered list */}
                        <div className="border-t border-black/10">
                            {servicePillars.map((pillar, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.65, delay: idx * 0.1 }}
                                    className="group grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr_auto] items-center gap-6 md:gap-12 py-10 md:py-14 border-b border-black/10 hover:bg-black/[0.025] transition-colors"
                                >
                                    <span className="text-5xl md:text-7xl font-display font-bold text-[#ffc000]/20 group-hover:text-[#ffc000]/60 transition-colors leading-none tabular-nums select-none">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="text-xl md:text-3xl font-display font-bold text-[#111009] group-hover:text-[#ffc000] transition-colors leading-tight mb-3">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-[#6b6250] text-sm md:text-base leading-relaxed">{pillar.description}</p>
                                    </div>
                                    <div className="hidden lg:flex flex-col items-end gap-3 flex-shrink-0">
                                        <p className="text-[10px] uppercase tracking-[0.32em] text-[#6b6250] font-bold">{pillar.note}</p>
                                        <span className="material-symbols-outlined text-[#ffc000]/40 group-hover:text-[#ffc000] transition-colors">arrow_outward</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Tall parallax image — desktop only */}
                        {servicesImg && (
                            <div className="hidden lg:block sticky top-24">
                                <ParallaxImage
                                    src={servicesImg}
                                    alt="Studio work"
                                    containerClassName="relative overflow-hidden bg-[#e8e4dc]"
                                    imageClassName="w-full h-[520px] object-cover"
                                    movement={55}
                                    delay={0.1}
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f9f8f5] to-transparent pointer-events-none" />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                6. PROCESS — 4-step numbered flow
            ══════════════════════════════════════════════════════════ */}
            <section className="py-28 md:py-36 bg-[#f4f2ee]">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="grid md:grid-cols-2 gap-6 items-end mb-20">
                        <div>
                            <SectionLabel text="How We Work" />
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="text-4xl md:text-5xl font-display font-bold text-[#111009] leading-tight"
                            >
                                A Clear<br />Production Flow.
                            </motion.h2>
                        </div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.12 }}
                            className="text-[#4a4535] leading-relaxed text-base md:text-lg"
                        >
                            Our process keeps every project strategic, efficient, and creatively strong from first brief to final delivery.
                        </motion.p>
                    </div>

                    <div className="relative">
                        <div className="hidden md:block absolute h-px bg-black/8 left-9 right-9" style={{ top: '2.2rem' }} />
                        <div className="grid md:grid-cols-4 gap-10">
                            {processSteps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 26 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.14 }}
                                    className="relative group"
                                >
                                    <div className="w-[4.4rem] h-[4.4rem] flex items-center justify-center border border-[#ffc000]/40 bg-[#f4f2ee] mb-7 relative z-10 group-hover:border-[#ffc000] group-hover:bg-[#ffc000]/8 transition-colors">
                                        <span className="text-[#ffc000] font-bold font-display text-xl">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-display font-bold text-[#111009] mb-3">{step.title}</h3>
                                    <p className="text-sm text-[#6b6250] leading-relaxed">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                7. STATS — mega numbers on parallax image background
            ══════════════════════════════════════════════════════════ */}
            <section className="relative py-24 bg-[#090805] border-y border-white/5 overflow-hidden">
                {/* Parallax background image */}
                {statsParallaxImg && (
                    <div className="absolute inset-0">
                        <ParallaxImage
                            src={statsParallaxImg}
                            alt=""
                            containerClassName="w-full h-full"
                            imageClassName="w-full h-[130%] object-cover opacity-10"
                            movement={60}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#090805]/80 via-[#090805]/50 to-[#090805]/80" />
                    </div>
                )}
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.09 }}
                                className={[
                                    'px-6 md:px-10 py-14 text-center',
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

            {/* ══════════════════════════════════════════════════════════
                8. CLIENTS — infinite marquee with edge fades
            ══════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-28 bg-[#f9f8f5]">
                <div className="max-w-7xl mx-auto px-6 lg:px-16 mb-14">
                    <SectionLabel text="Trusted by Past Clients" />
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-[#111009]">Brands We've Worked With.</h2>
                </div>
                <div className="relative overflow-hidden border-y border-black/8 py-8">
                    {/* Edge fades */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f9f8f5] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f9f8f5] to-transparent z-10 pointer-events-none" />
                    <motion.div
                        className="flex items-center gap-5 whitespace-nowrap"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ duration: 24, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                        style={{ width: 'max-content' }}
                    >
                        {[...clientLogos, ...clientLogos].map((logo, idx) => (
                            <div key={idx} className="flex-shrink-0 bg-[#ece5d6] w-36 h-20 md:w-44 md:h-24 flex items-center justify-center px-4">
                                <img src={logo.image} alt={logo.name} className="w-full h-14 object-contain" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                9. CTA — dramatic full-bleed parallax
            ══════════════════════════════════════════════════════════ */}
            <section className="relative py-32 md:py-48 bg-[#060504] overflow-hidden">
                {ctaBgImg && (
                    <div className="absolute inset-0">
                        <ParallaxImage
                            src={ctaBgImg}
                            alt=""
                            containerClassName="w-full h-full"
                            imageClassName="w-full h-[130%] object-cover opacity-25"
                            movement={80}
                        />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#060504] via-[#060504]/90 to-[#060504]/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060504] via-transparent to-[#060504]/40" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffc000]/40 to-transparent" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9 }}
                    >
                        <SectionLabel text="Start Your Project" />
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.9] mb-8 max-w-4xl">
                            {ctaTitle}
                        </h2>
                        <p className="text-[#7a7260] text-lg mb-14 max-w-xl leading-relaxed">{ctaSubtitle}</p>
                        <div className="flex flex-wrap gap-4">
                            <Link href={ctaButtonLink}
                                className="inline-flex items-center gap-2 bg-[#ffc000] text-[#090805] px-10 py-5 font-bold text-sm uppercase tracking-[0.2em] hover:bg-white transition-colors">
                                Book a Session
                                <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                            </Link>
                            <Link href="/contact"
                                className="inline-flex items-center gap-2 border border-white/20 text-white px-10 py-5 font-bold text-sm uppercase tracking-[0.2em] hover:border-[#ffc000] hover:text-[#ffc000] transition-colors">
                                Get in Touch
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   HERO — full-screen image slider
───────────────────────────────────────────────────────────────── */
const AUTOPLAY_DELAY = 6000;

const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

function HeroSection({ heroImgs, ctaText, ctaLink, secondaryCtaLink }: {
    heroImgs: string[]; ctaText: string; ctaLink: string; secondaryCtaLink: string;
}) {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });

    const [index, setIndex]     = useState(0);
    const [direction, setDir]   = useState(1);
    const [paused, setPaused]   = useState(false);

    const images = heroImgs.length > 0 ? heroImgs : [];

    const go = useCallback((next: number) => {
        if (images.length === 0) return;
        const bounded = (next + images.length) % images.length;
        setDir(next > index ? 1 : -1);
        setIndex(bounded);
    }, [index, images.length]);

    const goNext = useCallback(() => go(index + 1), [go, index]);
    const goPrev = useCallback(() => go(index - 1), [go, index]);

    useEffect(() => {
        if (paused || images.length <= 1) return;
        const t = setTimeout(goNext, AUTOPLAY_DELAY);
        return () => clearTimeout(t);
    }, [index, paused, goNext, images.length]);

    return (
        <section
            ref={containerRef}
            className="relative h-screen flex flex-col overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Sliding background images */}
            {images.length > 0 ? (
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={index}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.7, ease: [0.32, 0, 0.67, 0] }}
                        className="absolute inset-0 bg-[#090805]"
                    >
                        {/* Blurred ambient background — fills empty space on sides */}
                        <img
                            src={images[index]}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30"
                            aria-hidden="true"
                        />
                        {/* Full image — object-contain so nothing is cropped */}
                        <img
                            src={images[index]}
                            alt=""
                            className="relative z-10 w-full h-full object-contain"
                        />
                    </motion.div>
                </AnimatePresence>
            ) : (
                <div className="absolute inset-0 bg-[#090805]" />
            )}

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#090805]/95 via-[#090805]/55 to-[#090805]/10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090805]/80 via-transparent to-[#090805]/30 pointer-events-none" />

            {/* Prev / Next arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={goPrev}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#090805] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200 group"
                        aria-label="Previous"
                    >
                        <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">chevron_left</span>
                    </button>
                    <button
                        onClick={goNext}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#090805] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200 group"
                        aria-label="Next"
                    >
                        <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">chevron_right</span>
                    </button>
                </>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
                <div className="absolute bottom-20 left-8 lg:left-20 z-20 flex items-center gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                            className={`transition-all duration-300 rounded-full ${i === index ? 'bg-[#ffc000] w-7 h-2' : 'bg-white/30 hover:bg-white/60 w-2 h-2'}`}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Slide counter */}
            {images.length > 1 && (
                <div className="absolute top-6 right-6 z-20 hidden md:block bg-black/40 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold px-3 py-1.5">
                    {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </div>
            )}

            {/* Auto-play progress bar */}
            {images.length > 1 && !paused && (
                <motion.div
                    key={`prog-${index}`}
                    className="absolute top-0 left-0 h-[3px] bg-[#ffc000] z-20"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTOPLAY_DELAY / 1000, ease: 'linear' }}
                />
            )}

            {/* Hero text */}
            <div className="relative z-10 flex-1 flex items-center px-8 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    className="max-w-2xl"
                >
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-[#ffc000] font-bold tracking-[0.44em] uppercase text-[10px] mb-8 flex items-center gap-4"
                    >
                        <span className="block w-10 h-px bg-[#ffc000]" />
                        Mado Creatives Studio
                    </motion.p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.9] tracking-tight mb-8">
                        Where Vision<br />Becomes<br />
                        <span className="text-[#ffc000]">Visual Legacy.</span>
                    </h1>
                    <p className="text-base md:text-lg text-[#c3bcab] max-w-lg leading-relaxed mb-10">
                        Premium visual storytelling for brands, entrepreneurs, and modern creatives across Africa and beyond.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href={ctaLink}
                            className="inline-flex items-center gap-2 bg-[#ffc000] text-[#090805] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors">
                            {ctaText}
                            <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                        </Link>
                        <Link href={secondaryCtaLink}
                            className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:border-[#ffc000] hover:text-[#ffc000] transition-colors">
                            Start a Project
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="relative z-10 px-8 lg:px-20 pb-20 flex items-center gap-3 text-[#6b6250]"
            >
                <motion.span
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="block w-px h-10 bg-[#ffc000]/40"
                />
                <span className="text-[10px] uppercase tracking-[0.38em]">Scroll to Explore</span>
            </motion.div>

            {/* Gold ticker strip */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#ffc000] z-20 flex items-center overflow-hidden">
                <motion.div
                    className="flex items-center whitespace-nowrap"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 28, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                    style={{ width: 'max-content' }}
                >
                    {[...TICKER_LABELS, ...TICKER_LABELS].map((label, i) => (
                        <span key={i} className="inline-flex items-center gap-7 px-7 text-[#090805] font-bold text-[11px] uppercase tracking-[0.38em]">
                            {label}
                            <span className="text-[#090805]/25 text-[7px]">◆</span>
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
