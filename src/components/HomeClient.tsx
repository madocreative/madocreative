'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomeClient({ content, galleries }: { content: any; galleries: any[] }) {
    const sections = content?.sections || {};

    const title = content?.title || "Capturing<br />The <span class='text-[#ffc000]'>Unseen</span>";
    const subtitle = content?.subtitle || 'We are Mado Creatives, an independent studio crafting premium imagery for visionaries.';
    const ctaText = sections.ctaText || 'View Our Work';
    const ctaLink = sections.ctaLink || '/portfolio';
    const worksLabel = sections.worksLabel || 'Selected Works';
    const worksTitle = sections.worksTitle || 'Featured Portfolio';

    // Pull all gallery images for the hero collage
    const heroImgs = galleries
        .flatMap(g => [g.featuredImage, ...(g.images || [])].filter(Boolean))
        .filter((v, i, a) => a.indexOf(v) === i);

    return (
        <div className="flex flex-col bg-[#0a0a08]">
            {/* ── Hero — full-bleed collage ──────────────────────────────── */}
            <section className="relative h-screen overflow-hidden">
                {/* Photography collage */}
                {heroImgs.length > 0 && (
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-px">
                        {heroImgs.slice(0, 3).map((img, i) => (
                            <div key={i} className={`overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                                <motion.img
                                    src={img}
                                    className="w-full h-full object-contain bg-[#111109]"
                                    initial={{ scale: 1.06, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 1.8, delay: i * 0.08, ease: 'easeOut' }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Solid overlay — top and right tint only, no gradient */}
                <div className="absolute inset-0 bg-[#0a0a08]/40 pointer-events-none" />

                {/* Hard solid bottom bar — editorial hard-cut */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0a08]" />

                {/* Text block — sits above the solid bar */}
                <div className="absolute inset-0 flex flex-col items-start justify-end pb-24 px-6 lg:px-16 max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.6 }}
                    >
                        <p className="text-[#ffc000] font-bold tracking-[0.45em] uppercase text-xs mb-3">
                            Visual Storytelling
                        </p>
                        <h1
                            className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold uppercase text-white leading-none mb-6"
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                        <div className="flex items-center gap-5 flex-wrap">
                            <Link href={ctaLink}
                                className="bg-[#ffc000] text-[#0a0a08] px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors">
                                {ctaText}
                            </Link>
                            <Link href="/contact"
                                className="border border-white/30 text-white px-8 py-4 font-bold text-sm uppercase tracking-wider hover:border-[#ffc000] hover:text-[#ffc000] transition-colors">
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll cue */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }}
                    className="absolute bottom-6 right-8 flex flex-col items-center gap-1.5">
                    <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
                        <span className="material-symbols-outlined text-slate-600 text-[20px]">keyboard_arrow_down</span>
                    </motion.div>
                    <span className="text-slate-700 text-[9px] uppercase tracking-widest font-bold rotate-180 [writing-mode:vertical-rl]">Scroll</span>
                </motion.div>
            </section>

            {/* ── Featured Works ─────────────────────────────────────────── */}
            <section className="py-10 bg-[#0a0a08]">
                <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.8 }}
                    >
                        <p className="text-[#ffc000] font-bold uppercase tracking-widest text-xs mb-3">{worksLabel}</p>
                        <h2 className="text-3xl md:text-6xl font-display font-bold text-white leading-tight">{worksTitle}</h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.8 }}
                    >
                        <Link href="/portfolio"
                            className="text-white border-b border-[#ffc000] pb-1 uppercase tracking-widest text-xs font-bold hover:text-[#ffc000] transition-colors">
                            See All Projects
                        </Link>
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-1">
                    {galleries.slice(0, 4).map((gallery, idx) => (
                        <motion.a key={gallery._id} href="/portfolio"
                            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="group block cursor-pointer relative overflow-hidden">
                            <div className={`overflow-hidden relative ${idx % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
                                <img src={gallery.featuredImage} alt={gallery.title}
                                    className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" />
                                {/* Hard solid colour bar at bottom — no gradient */}
                                <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a08] translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex items-center justify-between px-6 py-4">
                                    <div>
                                        <h3 className="text-white font-display font-bold text-xl">{gallery.title}</h3>
                                        <p className="text-[#ffc000] uppercase tracking-widest text-[10px] mt-0.5 font-bold">{gallery.category || 'Portfolio'}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-[#ffc000]">arrow_outward</span>
                                </div>
                            </div>
                            {/* Always-visible label below image */}
                            <div className="bg-[#111109] px-5 py-3 flex items-center justify-between border-t border-white/5">
                                <h3 className="text-white font-display font-bold text-lg group-hover:text-[#ffc000] transition-colors">{gallery.title}</h3>
                                <p className="text-slate-600 uppercase tracking-widest text-[10px] font-bold">{gallery.category || 'Portfolio'}</p>
                            </div>
                        </motion.a>
                    ))}
                    {galleries.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-500 border border-white/10">
                            No galleries created yet.
                        </div>
                    )}
                </div>
            </section>

            {/* ── Stats strip ───────────────────────────────────────────── */}
            <section className="bg-[#111109] py-12 border-t border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.7 }}
                        className="max-w-lg"
                    >
                        <p className="text-[#ffc000] font-bold tracking-[0.3em] uppercase text-xs mb-4">Why Mado</p>
                        <h3 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                            Where luxury meets authentic storytelling.
                        </h3>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-10 sm:gap-16 shrink-0"
                    >
                        {[{ v: '15+', l: 'Years' }, { v: '500+', l: 'Projects' }, { v: '4', l: 'Locations' }].map(s => (
                            <div key={s.l} className="text-center">
                                <p className="text-[#ffc000] font-bold text-5xl font-display mb-2">{s.v}</p>
                                <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">{s.l}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CTA strip ─────────────────────────────────────────────── */}
            <section className="bg-[#ffc000] py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-3xl md:text-6xl font-display font-bold text-[#0a0a08] mb-10 leading-tight">
                            Ready to create something extraordinary?
                        </h2>
                        <Link href="/booking"
                            className="inline-flex items-center gap-3 bg-[#0a0a08] text-white px-10 py-4 font-bold text-lg uppercase tracking-wider hover:bg-[#1a1812] transition-colors">
                            Book a Session <span className="material-symbols-outlined">arrow_right_alt</span>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
