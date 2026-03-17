'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
interface HighlightCard  { stat: string; title: string; description: string; }
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
const defaultHighlightCards: HighlightCard[] = [
    { stat: 'Creative + Tech', title: 'Dual Expertise Under One Studio', description: 'Photography, film, branding content, and premium electronics support under one creative ecosystem.' },
    { stat: 'International Reach', title: 'Multi-Country Presence', description: 'Consistent production quality across Addis Ababa, Kigali, Nairobi, and Dubai.' },
];
const defaultHeroImages = [
    '/hero/hero-01.jpg',
    '/hero/hero-02.jpg',
    '/hero/hero-03.jpg',
    '/hero/hero-04.jpg',
    '/hero/hero-05.jpg',
    '/hero/hero-06.jpg',
    '/hero/hero-07.jpg',
    '/hero/hero-08.jpg',
    '/hero/hero-09.jpg',
    '/hero/hero-10.jpg',
];

/* ─────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────── */
function getList<T>(v: unknown, fb: T[]): T[] { return Array.isArray(v) ? (v as T[]) : fb; }
function getString(v: unknown, fb: string): string { return typeof v === 'string' && v.trim() ? v : fb; }
function getImageList(v: unknown): string[] {
    return Array.isArray(v)
        ? v.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean)
        : [];
}
function withLineBreaks(value: string): string {
    return value.includes('<') ? value : value.replace(/\n/g, '<br />');
}
function toPlainText(value: string): string {
    return value
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\r\n/g, '\n')
        .trim();
}

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
    const heroLabel        = getString(sections.heroLabel,        'Premium Visual Studio · Kigali');
    const heroTitle        = getString(content?.title,            'Mado<br />Creatives');
    const heroSubtitle     = getString(content?.subtitle,         'Independent studio crafting premium imagery for visionaries.');
    const ctaText          = getString(sections.ctaText,           'View Portfolio');
    const ctaLink          = getString(sections.ctaLink,           '/portfolio');
    const secondaryCtaText = getString(sections.secondaryCtaText,  'Book a Session');
    const secondaryCtaLink = getString(sections.secondaryCtaLink,  '/contact');
    const introLabel       = getString(sections.introLabel,       'About the Studio');
    const introTitle       = getString(sections.introTitle,       'Creative Agency. Premium Production Partner.');
    const introDescription = getString(sections.introDescription,  'From luxury weddings to commercial campaigns, Mado Creatives builds high-impact visuals that blend emotion, strategy, and international creative standards.');
    // highlightCards removed — section replaced by dense gallery grid
    const highlightCards   = getList<HighlightCard>(sections.highlightCards, defaultHighlightCards);
    const worksLabel       = getString(sections.worksLabel,       'Our Work');
    const worksTitle       = getString(sections.worksTitle,       'Selected Work');
    const worksDescription = getString(sections.worksDescription, 'A curated visual selection from recent projects. Tap any frame to open the full portfolio.');
    const servicePillarsLabel = getString(sections.servicePillarsLabel, 'Signature Services');
    const servicePillarsTitle = getString(sections.servicePillarsTitle, 'Signature Service Pillars');
    const servicePillars   = getList<ServicePillar>(sections.servicePillars,  defaultServicePillars);
    const processLabel     = getString(sections.processLabel,     'How We Work');
    const processTitle     = getString(sections.processTitle,     'A Clear Production Flow.');
    const processSubtitle  = getString(sections.processSubtitle,  'Our process keeps every project strategic, efficient, and creatively strong from first brief to final delivery.');
    const processSteps     = getList<ProcessStep>(sections.processSteps,      defaultProcessSteps);
    const clientLabel      = getString(sections.clientLabel,      'Trusted by Past Clients');
    const clientTitle      = getString(sections.clientTitle,      'Brands We\'ve Worked With.');
    const clientSubtitle   = getString(sections.clientSubtitle,   '');
    const clientLogos      = getList<ClientLogo>(sections.clientLogos,        defaultClientLogos);
    const statsLabel       = getString(sections.statsLabel,       'Why Clients Choose Mado');
    const statsTitle       = getString(sections.statsTitle,       'Premium Quality with Measurable Impact');
    const stats            = getList<StatItem>(sections.stats,                defaultStats);
    const ctaLabel         = getString(sections.ctaLabel,        'Start Your Project');
    const ctaTitle         = getString(sections.ctaTitle,       'Ready to build your next visual campaign?');
    const ctaSubtitle      = getString(sections.ctaSubtitle,    'Book a photography session, request a campaign shoot, or discuss a custom production plan with our team.');
    const ctaButtonText    = getString(sections.ctaButtonText,  'Book a Session');
    const ctaButtonLink    = getString(sections.ctaButtonLink,  '/booking');
    const customHeroImages = getImageList(sections.heroImages);
    const customWorkImages = getImageList(sections.workImages);
    const introImageOverride = getString(sections.introImage, '');
    const servicesImageOverride = getString(sections.servicesImage, '');
    const statsImageOverride = getString(sections.statsImage, '');
    const ctaImageOverride = getString(sections.ctaImage, '');

    // Hero images: use curated hero set first; keep CMS hero as optional fallback.
    const heroImgs = (customHeroImages.length > 0 ? customHeroImages : [
        content?.heroImage,
        ...defaultHeroImages,
    ])
        .filter((img): img is string => typeof img === 'string' && img.length > 0)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 10);


    const excludedSet = new Set(
        excludedImages
            .map((img) => (typeof img === 'string' ? img.trim() : ''))
            .filter(Boolean),
    );
    const galleryWorkImages = Array.from(
        new Set(
            (galleries.flatMap((g) => [g.featuredImage, ...(g.images || [])].filter(Boolean)) as string[])
                .map((img) => img.trim())
                .filter((img) => img.length > 0 && !excludedSet.has(img)),
        ),
    );
    const workImages = customWorkImages.length > 0 ? customWorkImages : galleryWorkImages;
    const introImage = introImageOverride || galleries[0]?.featuredImage || '';
    const servicesImg = servicesImageOverride || galleries[1]?.featuredImage || galleries[0]?.featuredImage || '';
    const statsParallaxImg = statsImageOverride || galleries[2]?.featuredImage || galleries[0]?.featuredImage || '';
    const ctaBgImg = ctaImageOverride || galleries[0]?.featuredImage || '';
    const featuredHighlights = highlightCards.filter((card) => card?.title || card?.description || card?.stat).slice(0, 2);

    return (
        <div className="flex flex-col bg-[var(--app-bg)] text-[var(--app-text)]">

            {/* ══════════════════════════════════════════════════════════
                1. HERO — cinematic 3-col parallax grid + text + ticker
            ══════════════════════════════════════════════════════════ */}
            <HeroSection
                heroImgs={heroImgs}
                heroLabel={heroLabel}
                heroTitle={heroTitle}
                heroSubtitle={heroSubtitle}
                ctaText={ctaText}
                ctaLink={ctaLink}
                secondaryCtaText={secondaryCtaText}
                secondaryCtaLink={secondaryCtaLink}
            />


            {/* ══════════════════════════════════════════════════════════
                3. ABOUT — parallax split: text left, tall image right
            ══════════════════════════════════════════════════════════ */}
            <section className="py-28 md:py-40 bg-[#f9f8f5] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <SectionLabel text={introLabel} />

                    <div className="grid lg:grid-cols-[1.15fr_1fr] gap-16 lg:gap-28 items-start">
                        {/* Left */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.85 }}
                        >
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.0] text-[#111009] mb-8 whitespace-pre-line">
                                {introTitle}
                            </h2>
                            <p className="text-[#4a4535] leading-relaxed text-base md:text-lg mb-10 max-w-lg">
                                {introDescription}
                            </p>
                            {featuredHighlights.length > 0 && (
                                <div className="grid gap-4 sm:grid-cols-2 mb-10">
                                    {featuredHighlights.map((card, index) => (
                                        <div key={`${card.title}-${index}`} className="border border-black/10 bg-white/65 px-5 py-5 backdrop-blur-sm">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#ffc000] mb-3">{card.stat}</p>
                                            <h3 className="text-lg font-display font-bold text-[#111009] mb-2 leading-tight">{card.title}</h3>
                                            <p className="text-sm text-[#6b6250] leading-relaxed">{card.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                        {introImage && (
                            <div className="relative hidden lg:block">
                                {/* Gold vertical accent */}
                                <div className="absolute -left-14 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#ffc000]/40 to-transparent" />
                                <ParallaxImage
                                    src={introImage}
                                    alt="Featured work"
                                    containerClassName="relative aspect-[3/4] overflow-hidden bg-[#e8e4dc]"
                                    imageClassName="w-full h-[120%] object-cover"
                                    movement={60}
                                />
                                {/* Overlay caption */}
                                {!introImageOverride && galleries[0]?.featuredImage && (
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#111009]/80 to-transparent">
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#ffc000] mb-1">{galleries[0]?.category || 'Featured'}</p>
                                        <p className="text-white font-display font-bold text-base">{galleries[0]?.title}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                4. OUR WORK — dense masonry image grid (Legacy Studio style)
            ══════════════════════════════════════════════════════════ */}
            {workImages.length > 0 && (
                <section className="bg-[var(--section-bg)] py-16 md:py-24 border-y border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10 mb-9 md:mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                            >
                                <SectionLabel text={worksLabel} />
                                <h2 className="text-[2.2rem] sm:text-5xl md:text-6xl font-display font-bold text-white leading-[0.95] whitespace-pre-line">
                                    {worksTitle}
                                </h2>
                                <p className="mt-4 text-sm md:text-base max-w-xl text-white/72 leading-relaxed">
                                    {worksDescription}
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
                                className="inline-flex items-center gap-2 rounded-full bg-[#ffc000] text-[#05070a] px-8 md:px-10 h-11 md:h-12 text-sm font-semibold tracking-[0.1em] uppercase hover:bg-white transition-colors"
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
                            <SectionLabel text={servicePillarsLabel} />
                            <h2 className="mt-6 text-4xl md:text-5xl font-display font-bold text-[#111009] leading-tight max-w-3xl whitespace-pre-line">
                                {servicePillarsTitle}
                            </h2>
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
                            <SectionLabel text={processLabel} />
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="text-4xl md:text-5xl font-display font-bold text-[#111009] leading-tight whitespace-pre-line"
                            >
                                {processTitle}
                            </motion.h2>
                        </div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.12 }}
                            className="text-[#4a4535] leading-relaxed text-base md:text-lg"
                        >
                            {processSubtitle}
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
                    <div className="mb-12 md:mb-16">
                        <SectionLabel text={statsLabel} />
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white max-w-3xl leading-tight whitespace-pre-line">
                            {statsTitle}
                        </h2>
                    </div>
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
                    <SectionLabel text={clientLabel} />
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-[#111009] whitespace-pre-line">{clientTitle}</h2>
                    {clientSubtitle && (
                        <p className="mt-4 max-w-2xl text-[#6b6250] leading-relaxed">{clientSubtitle}</p>
                    )}
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
                        <SectionLabel text={ctaLabel} />
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.9] mb-8 max-w-4xl">
                            {ctaTitle}
                        </h2>
                        <p className="text-[#7a7260] text-lg mb-14 max-w-xl leading-relaxed">{ctaSubtitle}</p>
                        <div className="flex flex-wrap gap-4">
                            <Link href={ctaButtonLink}
                                className="inline-flex items-center gap-2 bg-[#ffc000] text-[#090805] px-10 py-5 font-bold text-sm uppercase tracking-[0.2em] hover:bg-white transition-colors">
                                {ctaButtonText}
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

                return (
                    <div
                        key={`${img}-${index}`}
                        className={`selected-work-card relative overflow-hidden bg-[var(--app-card)] ${spanClass}`}
                    >
                        <Link href="/portfolio" className="group relative block h-full w-full">
                            <img
                                src={img}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover scale-100 group-hover:scale-[1.07] transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.22,1)]"
                            />
                            {/* Dark overlay — brightens on hover to reveal image more */}
                            <div className="absolute inset-0 bg-[#05070a]/40 group-hover:bg-[#05070a]/0 transition-colors duration-500" />
                            {/* Bottom gradient + info strip */}
                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#05070a]/80 to-transparent translate-y-1 group-hover:translate-y-0 transition-transform duration-500" />
                            <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/70 group-hover:text-white translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                                <span>View</span>
                                <span className="material-symbols-outlined text-[14px]">north_east</span>
                            </div>
                            {/* Index badge */}
                            <div className="absolute left-3 top-3 border border-white/20 bg-black/30 px-2 h-5 flex items-center text-[9px] tracking-[0.2em] uppercase text-white/60 group-hover:border-[#ffc000]/60 group-hover:text-[#ffc000] transition-colors duration-400">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}

gsap.registerPlugin(ScrollTrigger);

const HERO_ROTATE_MS = 7000;

/** Add Cloudinary auto-quality + format + resize for hero display */
function optimizeHeroUrl(url: string): string {
    if (!url.includes('res.cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/q_auto:best,f_auto,dpr_auto,w_2400/');
}

const CROSSFADE_MS = 1400;

function HeroSection({ heroImgs, heroLabel, heroTitle, heroSubtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink }: {
    heroImgs: string[];
    heroLabel: string;
    heroTitle: string;
    heroSubtitle: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
}) {
    const sectionRef = useRef<HTMLElement>(null);
    const [slide, setSlide] = useState(0);
    const [prevSlide, setPrevSlide] = useState<number | null>(null);
    const prevCleanup = useRef<ReturnType<typeof setTimeout> | null>(null);

    const imgs = heroImgs.length > 0 ? heroImgs : ['/hero/hero-01.jpg'];
    const slideCount = Math.max(1, imgs.length);
    const cleanHeroLabel = toPlainText(heroLabel);
    const cleanHeroSubtitle = toPlainText(heroSubtitle);

    const goTo = useCallback((next: number) => {
        setPrevSlide((p) => (p === null ? slide : p));
        setSlide(next);
        if (prevCleanup.current) clearTimeout(prevCleanup.current);
        prevCleanup.current = setTimeout(() => setPrevSlide(null), CROSSFADE_MS + 100);
    }, [slide]);

    useEffect(() => {
        if (slideCount <= 1) return;
        const t = setInterval(() => {
            setSlide((p) => {
                const next = (p + 1) % slideCount;
                setPrevSlide(p);
                if (prevCleanup.current) clearTimeout(prevCleanup.current);
                prevCleanup.current = setTimeout(() => setPrevSlide(null), CROSSFADE_MS + 100);
                return next;
            });
        }, HERO_ROTATE_MS);
        return () => {
            clearInterval(t);
            if (prevCleanup.current) clearTimeout(prevCleanup.current);
        };
    }, [slideCount]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline({ defaults: { ease: 'power3.out' } })
                .from('.hero-overlay', { y: 28, autoAlpha: 0, duration: 0.75 })
                .from('.hero-title-line', { y: 32, autoAlpha: 0, duration: 0.65 }, '-=0.35')
                .from('.hero-meta', { y: 14, autoAlpha: 0, duration: 0.5 }, '-=0.28')
                .from('.hero-ctas', { y: 14, autoAlpha: 0, duration: 0.45 }, '-=0.22');
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const scrollToNext = () => {
        const next = sectionRef.current?.nextElementSibling as HTMLElement | null;
        if (!next) return;
        window.scrollTo({ top: next.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
    };

    return (
        <section
            ref={sectionRef}
            className="relative mt-[72px] md:mt-[88px] h-[calc(100svh-72px)] md:h-[calc(100svh-88px)] min-h-[520px] md:min-h-[600px] max-h-[1100px] overflow-hidden bg-[#050403]"
        >
            {prevSlide !== null && (
                <div key={`prev-${prevSlide}`} className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
                    <img
                        src={optimizeHeroUrl(imgs[prevSlide])}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                </div>
            )}

            <div
                key={`curr-${slide}`}
                className="absolute inset-0 overflow-hidden hero-crossfade-in"
                style={{ zIndex: 2 }}
            >
                <img
                    src={optimizeHeroUrl(imgs[slide])}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center hero-ken-burns"
                    loading="eager"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#050403]/78 via-[#050403]/18 to-[#050403]/12 md:from-[#050403]/70 md:via-[#050403]/12 md:to-[#050403]/18" style={{ zIndex: 3 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050403]/24 via-transparent to-transparent md:from-[#050403]/48" style={{ zIndex: 3 }} />

            <div className="hero-overlay absolute inset-0 flex flex-col justify-end px-5 sm:px-6 md:px-12 lg:px-20 pb-16 md:pb-20" style={{ zIndex: 4 }}>
                <div className="max-w-[22rem] sm:max-w-[30rem] md:max-w-[42rem]">
                    {cleanHeroLabel && (
                        <p className="hero-meta hidden md:inline-flex items-center gap-3 rounded-full border border-[#ffc000]/20 bg-black/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#f2d28b] backdrop-blur-sm mb-5">
                            <span className="h-px w-6 bg-[#d4af6a] shrink-0" />
                            <span>{cleanHeroLabel}</span>
                        </p>
                    )}

                    <h1
                        className="hero-title-line font-display font-bold text-white leading-[0.88] tracking-[-0.03em] mb-4 md:mb-5 text-balance"
                        style={{ fontSize: 'clamp(2.9rem, 11vw, 9rem)' }}
                        dangerouslySetInnerHTML={{ __html: withLineBreaks(heroTitle) }}
                    />

                    {cleanHeroSubtitle && (
                        <p className="hero-meta hidden md:block max-w-xl text-sm md:text-base text-white/76 leading-relaxed mb-7 whitespace-pre-line">
                            {cleanHeroSubtitle}
                        </p>
                    )}

                    <div className="hero-ctas flex flex-wrap gap-3 items-center">
                        <Link
                            href={ctaLink}
                            className="inline-flex items-center gap-2 bg-[#d4af6a] text-[#050403] px-6 sm:px-7 h-11 text-[0.68rem] sm:text-[0.7rem] font-bold tracking-[0.18em] uppercase hover:bg-[#f2d28b] transition-colors"
                        >
                            {ctaText}
                            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </Link>
                        <Link
                            href={secondaryCtaLink}
                            className="hidden sm:inline-flex items-center gap-2 border border-white/30 text-white/90 px-7 h-11 text-[0.7rem] font-semibold tracking-[0.18em] uppercase hover:border-white/60 hover:bg-white/8 transition-colors"
                        >
                            {secondaryCtaText}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute left-5 md:left-12 lg:left-20 bottom-5 md:bottom-6 hidden sm:block font-mono text-[10px] tracking-[0.28em] text-white/40 select-none" style={{ zIndex: 5 }}>
                <span className="text-white/75">{String(slide + 1).padStart(2, '0')}</span>
                <span className="mx-1.5">-</span>
                {String(slideCount).padStart(2, '0')}
            </div>

            {slideCount > 1 && (
                <div className="absolute right-5 md:right-10 bottom-5 md:bottom-6 flex items-center gap-1.5" style={{ zIndex: 5 }}>
                    {Array.from({ length: slideCount }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            className={`transition-all duration-400 rounded-full ${
                                i === slide
                                    ? 'w-5 h-[3px] bg-[#d4af6a]'
                                    : 'w-[5px] h-[5px] bg-white/28 hover:bg-white/55'
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            <button
                type="button"
                onClick={scrollToNext}
                className="absolute left-1/2 -translate-x-1/2 bottom-5 hidden md:flex flex-col items-center gap-1.5 text-[9px] tracking-[0.32em] uppercase text-white/45 hover:text-white/80 transition-colors"
                style={{ zIndex: 5 }}
                aria-label="Scroll to content"
            >
                <span>Scroll</span>
                <span className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
            </button>
        </section>
    );
}
