'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/components/ThemeProvider';

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
export default function HomeClient({
    content,
    galleries,
    excludedImages = [],
}: {
    content: HomeContent | null;
    galleries: GalleryItem[];
    excludedImages?: string[];
}) {
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

    const excludedSet = new Set(
        excludedImages
            .map((img) => (typeof img === 'string' ? img.trim() : ''))
            .filter(Boolean),
    );
    const workImages = Array.from(
        new Set(
            (galleries.flatMap((g) => [g.featuredImage, ...(g.images || [])].filter(Boolean)) as string[])
                .map((img) => img.trim())
                .filter((img) => img.length > 0 && !excludedSet.has(img)),
        ),
    );

    const statsParallaxImg  = galleries[2]?.featuredImage || galleries[0]?.featuredImage;
    const ctaBgImg          = galleries[0]?.featuredImage;
    const servicesImg       = galleries[1]?.featuredImage || galleries[0]?.featuredImage;

    return (
        <div className="flex flex-col bg-[var(--app-bg)] text-[var(--app-text)]">

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
                <section className="bg-[#03292b] py-16 md:py-24 border-y border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10 mb-9 md:mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                            >
                                <SectionLabel text="Our Work" />
                                <h2 className="text-[2.2rem] sm:text-5xl md:text-6xl font-display font-bold text-white leading-[0.95]">
                                    Selected <span className="text-[#ffc000]">Work</span>
                                </h2>
                                <p className="mt-4 text-sm md:text-base max-w-xl text-white/72 leading-relaxed">
                                    A curated visual selection from recent projects. Tap any frame to open the full portfolio.
                                </p>
                            </motion.div>

                            <Link
                                href="/portfolio"
                                className="self-start inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 h-11 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/85 hover:border-[#ffc000] hover:text-[#ffc000] transition-colors"
                            >
                                Full Portfolio
                                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                            </Link>
                        </div>

                        <SelectedWorkGallery images={workImages.slice(0, 24)} />

                        <div className="mt-10 md:mt-12 flex justify-center">
                            <Link
                                href="/portfolio"
                                className="inline-flex items-center gap-2 rounded-full bg-[#ffc000] text-[#091314] px-8 md:px-10 h-11 md:h-12 text-sm font-semibold tracking-[0.1em] uppercase hover:bg-white transition-colors"
                            >
                                See More on Portfolio
                                <span className="material-symbols-outlined text-[18px]">north_east</span>
                            </Link>
                        </div>
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
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-[#111009]">Brands We&apos;ve Worked With.</h2>
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
const selectedWorkTileSpans = [
    'row-span-2',
    'row-span-3',
    'row-span-2',
    'row-span-3',
    'row-span-2',
    'row-span-2',
    'row-span-3',
    'row-span-2',
    'row-span-3',
    'row-span-2',
    'row-span-2',
    'row-span-3',
];

function SelectedWorkGallery({ images }: { images: string[] }) {
    const galleryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!galleryRef.current || images.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.selected-work-card',
                { autoAlpha: 0, y: 24 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.72,
                    stagger: 0.05,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: galleryRef.current,
                        start: 'top 82%',
                        once: true,
                    },
                },
            );
        }, galleryRef);

        return () => ctx.revert();
    }, [images.length]);

    return (
        <div
            ref={galleryRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 auto-rows-[120px] sm:auto-rows-[150px] lg:auto-rows-[180px]"
        >
            {images.map((img, index) => {
                const spanClass = selectedWorkTileSpans[index % selectedWorkTileSpans.length];
                const idleDuration = 8 + (index % 5);
                const driftX = index % 2 === 0 ? [0, -1.5, 0, 1.2, 0] : [0, 1.5, 0, -1.2, 0];

                return (
                    <motion.div
                        key={`${img}-${index}`}
                        className={`selected-work-card relative overflow-hidden rounded-[0.95rem] border border-white/12 bg-[#041a1f] ${spanClass}`}
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        <Link href="/portfolio" className="group relative block h-full w-full">
                            <motion.img
                                src={img}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover scale-[1.09] group-hover:scale-100 group-hover:brightness-[0.9] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.2,1,0.22,1)]"
                                animate={index < 14 ? { x: driftX, y: [0, -4, 0, 2, 0] } : undefined}
                                transition={
                                    index < 14
                                        ? { duration: idleDuration, repeat: Infinity, ease: 'easeInOut' }
                                        : undefined
                                }
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-75 group-hover:opacity-95 transition-opacity duration-400" />
                            <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/35 px-2.5 h-6 flex items-center text-[10px] tracking-[0.16em] uppercase text-white/90">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-white/85">
                                <span>Portfolio</span>
                                <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}

gsap.registerPlugin(ScrollTrigger);

const AUTOPLAY_DELAY = 6200;

function HeroSection({ heroImgs, ctaText, ctaLink, secondaryCtaLink }: {
    heroImgs: string[]; ctaText: string; ctaLink: string; secondaryCtaLink: string;
}) {
    const { theme } = useTheme();
    const sectionRef = useRef<HTMLElement>(null);
    const figureRef = useRef<HTMLImageElement>(null);

    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const images = heroImgs.length > 0 ? heroImgs : ['/logo.png'];
    const activeImage = images[index % images.length];

    useEffect(() => {
        if (images.length <= 1 || isPaused) return;
        const t = window.setTimeout(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, AUTOPLAY_DELAY);
        return () => window.clearTimeout(t);
    }, [images.length, index, isPaused]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

            timeline
                .from('.legacy-hero-kicker', { y: 24, autoAlpha: 0, duration: 0.55 })
                .from('.legacy-hero-title-line', { y: 56, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, '-=0.2')
                .from('.legacy-hero-copy', { y: 22, autoAlpha: 0, duration: 0.55 }, '-=0.24')
                .from('.legacy-hero-actions', { y: 18, autoAlpha: 0, duration: 0.48 }, '-=0.2');

            if (figureRef.current && sectionRef.current) {
                gsap.fromTo(
                    figureRef.current,
                    { scale: 1.08, autoAlpha: 0.45 },
                    { scale: 1, autoAlpha: 1, duration: 1.05, ease: 'power2.out' },
                );

                gsap.to(figureRef.current, {
                    yPercent: -8,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [index]);

    const isLight = theme === 'light';

    return (
        <section
            ref={sectionRef}
            className="relative px-3 md:px-5 pt-[104px] md:pt-[116px] pb-6 md:pb-10"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative mx-auto max-w-[1320px] min-h-[calc(100vh-130px)] rounded-[1.55rem] overflow-hidden border border-[var(--app-border)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,192,0,0.18),transparent_40%),linear-gradient(102deg,var(--hero-accent)_0%,#130607_52%,#050404_100%)]" />

                <img
                    ref={figureRef}
                    key={activeImage}
                    src={activeImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center md:object-[center_20%] mix-blend-normal opacity-95"
                />

                <div className={`absolute inset-0 ${isLight ? 'bg-[linear-gradient(90deg,rgba(9,8,7,0.88)_0%,rgba(9,8,7,0.58)_43%,rgba(9,8,7,0.12)_80%)]' : 'bg-[linear-gradient(90deg,rgba(9,8,7,0.96)_0%,rgba(9,8,7,0.62)_45%,rgba(9,8,7,0.18)_80%)]'}`} />
                <div className="absolute inset-0 border border-white/8 rounded-[1.55rem]" />

                <div className="relative z-10 px-6 md:px-10 lg:px-16 py-14 md:py-16 lg:py-18 flex min-h-[calc(100vh-130px)] items-center">
                    <div className="max-w-3xl">
                        <p className="legacy-hero-kicker flex items-center gap-3 text-[11px] font-semibold tracking-[0.38em] text-white/80 uppercase mb-6 md:mb-7">
                            <span className="block h-px w-10 bg-[#ffc000]" />
                            Legacy Style Hero
                        </p>

                        <h1 className="font-black text-white uppercase leading-[0.9] tracking-tight text-[clamp(2.8rem,8vw,7rem)]">
                            <span className="legacy-hero-title-line block">Welcome</span>
                            <span className="legacy-hero-title-line block">To The Home</span>
                        </h1>

                        <p className="legacy-hero-copy mt-7 md:mt-8 max-w-[42rem] text-white/78 text-sm md:text-[1.04rem] uppercase leading-[1.62] tracking-[0.02em]">
                            Welcome to Mado Creatives, where we transform your unique story into timeless art and cinematic visuals that
                            preserve every grand moment and subtle glance.
                        </p>

                        <div className="legacy-hero-actions mt-8 md:mt-10 flex flex-wrap gap-3 md:gap-4">
                            <Link
                                href={ctaLink}
                                className="inline-flex items-center gap-2 rounded-full bg-white text-[#111] px-6 md:px-7 h-11 md:h-12 text-sm font-semibold tracking-tight hover:bg-[#ffe4a4] transition-colors"
                            >
                                {ctaText}
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </Link>
                            <Link
                                href={secondaryCtaLink}
                                className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-6 md:px-7 h-11 md:h-12 text-sm font-semibold tracking-tight hover:bg-white/12 transition-colors"
                            >
                                Start Project
                            </Link>
                        </div>
                    </div>
                </div>

                {images.length > 1 && (
                    <div className="absolute right-4 md:right-8 bottom-5 md:bottom-8 z-20 flex items-center gap-2">
                        {images.map((_, itemIndex) => (
                            <button
                                key={itemIndex}
                                type="button"
                                onClick={() => setIndex(itemIndex)}
                                className={`h-2.5 rounded-full transition-all ${itemIndex === index ? 'w-7 bg-[#ffc000]' : 'w-2.5 bg-white/36 hover:bg-white/65'}`}
                                aria-label={`Go to hero slide ${itemIndex + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
