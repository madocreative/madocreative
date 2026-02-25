'use client';

import { motion } from 'framer-motion';
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
}

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function ServicesClient({ data }: { data: PageData }) {
    const heroImgs = data.services.map(s => s.image).filter(Boolean);

    return (
        <div className="flex flex-col bg-[#0a0a08]">
            {/* Hero — photography collage */}
            <section className="relative h-[72vh] overflow-hidden">
                {heroImgs.length > 0 ? (
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-px">
                        {heroImgs.slice(0, 6).map((img, i) => (
                            <div key={i} className={`overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-[#111109]" />
                )}
                {/* Tint */}
                <div className="absolute inset-0 bg-[#0a0a08]/30 pointer-events-none" />
                {/* Hard solid bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0a08]" />
                {/* Text */}
                <div className="absolute inset-0 flex flex-col items-start justify-end pb-24 px-6 lg:px-16 max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-3">What We Do</p>
                        <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase text-white leading-none">
                            {data.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Subtitle + stats */}
            <section className="bg-[#0a0a08] py-16 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row gap-10 md:gap-20 items-start">
                    <motion.p
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl font-light leading-relaxed flex-1"
                    >
                        {data.subtitle}
                    </motion.p>
                    {data.stats.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
                            className="grid grid-cols-2 gap-x-12 gap-y-6 shrink-0"
                        >
                            {data.stats.map((s, i) => (
                                <div key={i}>
                                    <p className="text-[#ffc000] font-bold text-3xl font-display mb-1">{s.value}</p>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Services — alternating image/text */}
            <div className="w-full">
                {data.services.map((service, index) => {
                    const tags = service.tags ? service.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                    const reverse = index % 2 !== 0;
                    return (
                        <section key={index} className={`w-full ${index % 2 === 0 ? 'bg-[#0a0a08]' : 'bg-[#111109]'}`}>
                            <div className={`max-w-7xl mx-auto flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch`}>
                                <motion.div
                                    variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9 }}
                                    className="w-full lg:w-1/2 aspect-[4/5] lg:aspect-auto overflow-hidden group min-h-[400px]"
                                >
                                    {service.image ? (
                                        <img
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            src={service.image}
                                            alt={service.title}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#1a1812] flex items-center justify-center min-h-[400px]">
                                            <span className="material-symbols-outlined text-slate-700 text-6xl">image</span>
                                        </div>
                                    )}
                                </motion.div>
                                <motion.div
                                    variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, delay: 0.2 }}
                                    className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24"
                                >
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="text-[#ffc000] font-mono text-sm font-bold">0{index + 1}</span>
                                        <div className="h-px w-8 bg-[#ffc000]/30"></div>
                                        <div className="flex gap-2 flex-wrap">
                                            {tags.map((tag, i) => (
                                                <span key={i} className="text-[10px] uppercase tracking-widest text-slate-500 border border-white/10 px-3 py-1">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-white mb-6 leading-tight uppercase">
                                        {service.title}
                                    </h2>
                                    <p className="text-lg text-slate-400 mb-12 leading-relaxed font-light">
                                        {service.description}
                                    </p>
                                    <Link href="/portfolio"
                                        className="group/link flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs w-max hover:text-[#ffc000] transition-colors">
                                        <span className="w-8 h-px bg-[#ffc000] transition-all duration-300 group-hover/link:w-14"></span>
                                        View Related Work
                                        <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover/link:translate-x-1">arrow_right_alt</span>
                                    </Link>
                                </motion.div>
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* CTA */}
            <motion.section
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.8 }}
                className="w-full bg-[#ffc000] py-32"
            >
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-6xl font-display font-extrabold text-[#0a0a08] mb-8 leading-tight uppercase">
                        {data.ctaTitle}
                    </h2>
                    <p className="text-xl text-[#0a0a08]/70 mb-12 max-w-2xl mx-auto font-medium">
                        {data.ctaSubtitle}
                    </p>
                    <Link href="/contact"
                        className="inline-flex items-center gap-3 bg-[#0a0a08] text-white px-10 py-4 font-bold text-lg uppercase tracking-wider hover:bg-[#1a1812] transition-colors">
                        {data.ctaButton}
                    </Link>
                </div>
            </motion.section>
        </div>
    );
}
