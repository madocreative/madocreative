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
        description:
            'Timeless coverage for engagements, private celebrations, and destination events with cinematic delivery.',
        note: 'Photography + Film',
    },
    {
        title: 'Fashion and Editorial',
        description:
            'Bold campaign visuals for models, designers, and publications with direction tailored to brand identity.',
        note: 'Editorial Production',
    },
    {
        title: 'Commercial and Product',
        description:
            'Clean, conversion-focused visuals for products, launches, and digital marketing assets across platforms.',
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

function getList<T>(value: unknown, fallback: T[]): T[] {
    return Array.isArray(value) ? (value as T[]) : fallback;
}

function getString(value: unknown, fallback: string): string {
    return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function ParallaxImage({
    src,
    alt,
    containerClassName,
    imageClassName,
    movement = 36,
    delay = 0,
}: {
    src: string;
    alt: string;
    containerClassName: string;
    imageClassName: string;
    movement?: number;
    delay?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [movement, -movement]);

    return (
        <div ref={ref} className={containerClassName}>
            <motion.img
                src={src}
                alt={alt}
                className={imageClassName}
                style={{ y }}
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 1.1, delay, ease: 'easeOut' }}
            />
        </div>
    );
}

export default function HomeClient({ content, galleries }: { content: HomeContent | null; galleries: GalleryItem[] }) {
    const sections = content?.sections || {};

    const title = content?.title || "Where Vision Becomes <span class='text-[#ffc000]'>Visual Legacy</span>";
    const subtitle =
        content?.subtitle ||
        'Premium visual storytelling for brands, entrepreneurs, and modern creatives. Crafted with precision. Delivered with excellence.';
    const heroLabel = getString(sections.heroLabel, 'Mado Creatives Studio');
    const ctaText = getString(sections.ctaText, 'View Portfolio');
    const ctaLink = getString(sections.ctaLink, '/portfolio');
    const secondaryCtaText = getString(sections.secondaryCtaText, 'Start a Project');
    const secondaryCtaLink = getString(sections.secondaryCtaLink, '/contact');

    const introLabel = getString(sections.introLabel, 'About the Studio');
    const introTitle = getString(sections.introTitle, 'Creative Agency and Premium Production Partner');
    const introDescription = getString(
        sections.introDescription,
        'From luxury weddings to commercial campaigns, Mado Creatives builds high-impact visuals that blend emotion, strategy, and international creative standards.',
    );
    const highlightCards = getList<HighlightCard>(sections.highlightCards, defaultHighlightCards);

    const servicePillarsLabel = getString(sections.servicePillarsLabel, 'Premium Photography Services');
    const servicePillarsTitle = getString(sections.servicePillarsTitle, 'Signature Service Pillars');
    const servicePillars = getList<ServicePillar>(sections.servicePillars, defaultServicePillars);

    const worksLabel = getString(sections.worksLabel, 'Portfolio Showcase');
    const worksTitle = getString(sections.worksTitle, 'Selected Work');
    const worksDescription = getString(
        sections.worksDescription,
        'A curated selection of wedding, editorial, brand, and product projects created for clients across Africa and international markets.',
    );

    const processLabel = getString(sections.processLabel, 'How We Work');
    const processTitle = getString(sections.processTitle, 'A Clear Production Flow');
    const processSubtitle = getString(
        sections.processSubtitle,
        'Our process keeps every project strategic, efficient, and creatively strong from first brief to final delivery.',
    );
    const processSteps = getList<ProcessStep>(sections.processSteps, defaultProcessSteps);

    const clientLabel = getString(sections.clientLabel, 'Trusted by Past Clients');
    const clientTitle = getString(sections.clientTitle, 'Brands and Businesses We Worked With');
    const clientSubtitle = getString(
        sections.clientSubtitle,
        'Each collaboration is built on trust, consistency, and premium output.',
    );
    const clientLogos = getList<ClientLogo>(sections.clientLogos, defaultClientLogos);

    const statsLabel = getString(sections.statsLabel, 'Why Clients Choose Mado');
    const statsTitle = getString(sections.statsTitle, 'Premium Quality with Measurable Impact');
    const stats = getList<StatItem>(sections.stats, defaultStats);

    const ctaTitle = getString(sections.ctaTitle, 'Ready to build your next visual campaign?');
    const ctaSubtitle = getString(
        sections.ctaSubtitle,
        'Book a photography session, request a campaign shoot, or discuss a custom production plan with our team.',
    );
    const ctaButtonText = getString(sections.ctaButtonText, 'Book a Session');
    const ctaButtonLink = getString(sections.ctaButtonLink, '/booking');

    const heroImgs = [content?.heroImage, ...galleries.flatMap(g => [g.featuredImage, ...(g.images || [])])]
        .filter((img): img is string => typeof img === 'string' && img.length > 0)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 5);

    return (
        <div className="flex flex-col bg-[#090805] text-[#f2efe7]">
            <section className="relative min-h-[94vh] overflow-hidden border-b border-white/10 bg-[#0a0906]">
                {heroImgs.length > 0 && (
                    <div className="absolute inset-0 grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-[2px]">
                        {heroImgs.map((img, i) => (
                            <ParallaxImage
                                key={`${img}-${i}`}
                                src={img}
                                alt=""
                                movement={i === 0 ? 22 : 14 + i * 3}
                                delay={i * 0.08}
                                containerClassName={`overflow-hidden bg-[#12100b] ${i === 0 ? 'col-span-2 row-span-2 lg:col-span-2' : ''}`}
                                imageClassName="w-full h-full object-contain p-2 md:p-3"
                            />
                        ))}
                    </div>
                )}

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,5,0.22)_0%,rgba(10,8,5,0.28)_48%,rgba(10,8,5,0.68)_100%)]" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pt-36 pb-20 md:pb-28 min-h-[94vh] flex items-end">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="max-w-4xl bg-[#0a0906]/58 border border-white/20 px-5 py-6 md:px-8 md:py-8 backdrop-blur-[1px]"
                    >
                        <p className="text-[#ffc000] font-bold tracking-[0.35em] uppercase text-[11px] mb-4">{heroLabel}</p>
                        <h1
                            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.98] mb-5"
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                        <p className="text-base md:text-xl text-[#e8e2d3] max-w-3xl leading-relaxed mb-8">{subtitle}</p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={ctaLink}
                                className="inline-flex items-center gap-2 bg-[#ffc000] text-[#090805] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] hover:bg-[#f2efe7] transition-colors"
                            >
                                {ctaText}
                                <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                            </Link>
                            <Link
                                href={secondaryCtaLink}
                                className="inline-flex items-center gap-2 border border-white/45 text-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] hover:border-[#ffc000] hover:text-[#ffc000] transition-colors"
                            >
                                {secondaryCtaText}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-20 md:py-24 bg-[#0d0c08]">
                <div className="max-w-7xl mx-auto px-6 lg:px-16 grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-14">
                    <motion.div
                        initial={{ opacity: 0, y: 26 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="text-[#ffc000] font-bold tracking-[0.35em] uppercase text-[11px] mb-4">{introLabel}</p>
                        <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight text-white mb-6">{introTitle}</h2>
                        <p className="text-[#c3bcab] leading-relaxed text-base md:text-lg mb-8">{introDescription}</p>
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 text-[#ffc000] uppercase tracking-[0.22em] text-xs font-bold border-b border-[#ffc000]/50 pb-1 hover:text-white hover:border-white/30 transition-colors"
                        >
                            Explore Services
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                    </motion.div>

                    <div className="grid gap-4">
                        {highlightCards.map((card, idx) => (
                            <motion.article
                                key={`${card.title}-${idx}`}
                                initial={{ opacity: 0, x: 28 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.7, delay: idx * 0.1 }}
                                className="bg-[#14130d] border border-white/10 p-6 md:p-7"
                            >
                                <p className="text-[#ffc000] text-[10px] uppercase tracking-[0.26em] font-bold mb-2">{card.stat}</p>
                                <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-3">{card.title}</h3>
                                <p className="text-sm md:text-base text-[#bdb59f] leading-relaxed">{card.description}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-24 bg-[#12110b] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="mb-10 md:mb-12"
                    >
                        <p className="text-[#ffc000] font-bold tracking-[0.35em] uppercase text-[11px] mb-3">{servicePillarsLabel}</p>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white">{servicePillarsTitle}</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {servicePillars.map((pillar, idx) => (
                            <motion.article
                                key={`${pillar.title}-${idx}`}
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.6, delay: idx * 0.12 }}
                                className="bg-[#090805] border border-white/10 p-6 md:p-7 min-h-[280px] flex flex-col"
                            >
                                <p className="text-[#ffc000] text-2xl font-display font-bold mb-5">{String(idx + 1).padStart(2, '0')}</p>
                                <h3 className="text-2xl font-display font-bold text-white mb-4 leading-tight">{pillar.title}</h3>
                                <p className="text-[#bdb59f] text-sm leading-relaxed mb-5">{pillar.description}</p>
                                <p className="text-[10px] uppercase tracking-[0.26em] text-[#867c66] font-bold mt-auto">{pillar.note}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-24 bg-[#090805]">
                <div className="max-w-7xl mx-auto px-6 lg:px-16 mb-10 md:mb-12 flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="max-w-3xl"
                    >
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.35em] text-[11px] mb-3">{worksLabel}</p>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">{worksTitle}</h2>
                        <p className="text-[#bdb59f] leading-relaxed">{worksDescription}</p>
                    </motion.div>
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 self-start lg:self-auto uppercase tracking-[0.2em] text-xs font-bold text-[#ffc000] border-b border-[#ffc000]/50 pb-1 hover:text-white hover:border-white/30 transition-colors"
                    >
                        View Full Portfolio
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-16 grid md:grid-cols-12 gap-4">
                    {galleries.slice(0, 6).map((gallery, idx) => {
                        const galleryImage = gallery.featuredImage || gallery.images?.[0];
                        return (
                            <motion.a
                                key={gallery._id}
                                href="/portfolio"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.7, delay: idx * 0.08 }}
                                className={`group relative overflow-hidden bg-[#111109] border border-white/5 ${
                                    idx === 0 ? 'md:col-span-7 md:row-span-2 aspect-[5/4] md:aspect-auto' : 'md:col-span-5 aspect-[4/3]'
                                }`}
                            >
                                {galleryImage ? (
                                    <ParallaxImage
                                        src={galleryImage}
                                        alt={gallery.title}
                                        movement={16 + (idx % 3) * 6}
                                        containerClassName="absolute inset-0 overflow-hidden bg-[#100f0a]"
                                        imageClassName="w-full h-full object-contain p-2 md:p-3 transition-transform duration-700 group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#8a816f] text-sm uppercase tracking-widest">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#090805]/80 via-[#090805]/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                                    <p className="text-[#ffc000] uppercase tracking-[0.2em] text-[10px] font-bold mb-2">
                                        {gallery.category || 'Portfolio'}
                                    </p>
                                    <div className="flex items-end justify-between gap-4">
                                        <h3 className="text-xl md:text-2xl font-display font-bold text-white leading-tight">{gallery.title}</h3>
                                        <span className="material-symbols-outlined text-[#ffc000]">arrow_outward</span>
                                    </div>
                                </div>
                            </motion.a>
                        );
                    })}
                    {galleries.length === 0 && (
                        <div className="md:col-span-12 py-16 text-center text-[#8a816f] border border-white/10">
                            No galleries created yet.
                        </div>
                    )}
                </div>
            </section>

            <section className="py-20 md:py-24 bg-[#0e0d08] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="mb-10 md:mb-12 max-w-3xl"
                    >
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.35em] text-[11px] mb-3">{processLabel}</p>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">{processTitle}</h2>
                        <p className="text-[#bdb59f] leading-relaxed">{processSubtitle}</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {processSteps.map((step, idx) => (
                            <motion.article
                                key={`${step.title}-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: idx * 0.1 }}
                                className="bg-[#14120d] border border-white/10 p-5 md:p-6"
                            >
                                <p className="text-[#ffc000] font-bold tracking-[0.26em] text-[11px] uppercase mb-4">
                                    Step {String(idx + 1).padStart(2, '0')}
                                </p>
                                <h3 className="text-xl font-display font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-sm text-[#b3ac98] leading-relaxed">{step.description}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-[#111009]">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65 }}
                        className="mb-10 md:mb-12"
                    >
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.35em] text-[11px] mb-3">{clientLabel}</p>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">{clientTitle}</h2>
                        <p className="text-[#bdb59f] leading-relaxed">{clientSubtitle}</p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {clientLogos.map((logo, idx) => (
                            <motion.div
                                key={`${logo.name}-${idx}`}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: idx * 0.04 }}
                                className="group bg-[#ece5d6] border border-[#f5efdf]/40 px-3 py-4 min-h-[118px] flex items-center justify-center"
                                title={logo.name}
                            >
                                <img
                                    src={logo.image}
                                    alt={`${logo.name} logo`}
                                    className="w-full h-[72px] object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20 bg-[#090805] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-16 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-end">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="text-[#ffc000] uppercase tracking-[0.35em] text-[11px] font-bold mb-3">{statsLabel}</p>
                        <h3 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">{statsTitle}</h3>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={`${stat.label}-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                                className="bg-[#15140e] border border-white/10 p-5"
                            >
                                <p className="text-3xl md:text-4xl text-[#ffc000] font-display font-bold mb-2">{stat.value}</p>
                                <p className="text-[11px] uppercase tracking-[0.18em] text-[#91876f] font-bold">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#ffc000] py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65 }}
                    >
                        <h2 className="text-3xl md:text-6xl font-display font-bold text-[#090805] mb-4 leading-tight">{ctaTitle}</h2>
                        <p className="text-[#090805]/75 text-base md:text-lg mb-9 max-w-2xl mx-auto">{ctaSubtitle}</p>
                        <Link
                            href={ctaButtonLink}
                            className="inline-flex items-center gap-2 bg-[#090805] text-white px-9 py-4 font-bold text-sm md:text-base uppercase tracking-[0.17em] hover:bg-[#1a1812] transition-colors"
                        >
                            {ctaButtonText}
                            <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
