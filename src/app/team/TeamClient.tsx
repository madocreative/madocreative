'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface TeamMember { name: string; role: string; image: string }
interface PageData {
    title: string;
    subtitle: string;
    teamMembers: TeamMember[];
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    philosophyQuote?: string;
    philosophyAttribution?: string;
}

export default function TeamClient({ data }: { data: PageData }) {
    return (
        <div className="flex flex-col bg-[#090805] text-[#f2efe7]">

            {/* ══════════════════════════════════════════════════
                HERO — pure typographic, no images
            ══════════════════════════════════════════════════ */}
            <section className="relative bg-[#090805] pt-36 pb-20 border-b border-white/5 overflow-hidden">
                <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[200px] md:text-[280px] font-display font-bold leading-none select-none pointer-events-none opacity-[0.015] text-white"
                    aria-hidden
                >
                    TEAM
                </span>

                <div className="max-w-7xl mx-auto px-8 lg:px-20 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                    >
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.44em] text-[10px] mb-8 flex items-center gap-4">
                            <span className="w-10 h-px bg-[#ffc000]" />
                            The People
                        </p>
                        <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-display font-bold leading-[0.88] tracking-tight text-white max-w-4xl">
                            {data.title}
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                        className="flex items-center gap-10 mt-14 pt-10 border-t border-white/10 flex-wrap"
                    >
                        <div>
                            <p className="text-4xl font-display font-bold text-[#ffc000] leading-none mb-2">
                                {data.teamMembers.length}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.28em] text-[#6b6250] font-bold">Creatives</p>
                        </div>
                        <div className="w-px h-10 bg-white/10 hidden md:block" />
                        <p className="text-[#9a9078] text-base md:text-lg leading-relaxed max-w-2xl">
                            {data.subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                TEAM GRID — portrait cards with slide-up reveal
            ══════════════════════════════════════════════════ */}
            <section className="bg-[#090805] py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                        {data.teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.7, delay: (index % 3) * 0.1 }}
                                className="group relative aspect-[3/4] overflow-hidden bg-[#111109]"
                            >
                                <span className="absolute top-4 left-4 z-20 text-[#ffc000]/50 font-display font-bold text-sm group-hover:text-[#ffc000] transition-colors">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                {member.image && (
                                    <img
                                        src={member.image}
                                        alt={`${member.name}, ${member.role}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                    />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-[#090805]/80 via-transparent to-transparent" />

                                {/* Default name bar */}
                                <div className="absolute bottom-0 left-0 right-0 bg-[#090805]/80 backdrop-blur-sm px-5 py-4 translate-y-0 group-hover:translate-y-full transition-transform duration-400">
                                    <p className="text-white font-bold text-sm uppercase tracking-wider">{member.name}</p>
                                    <p className="text-[#6b6250] text-xs uppercase tracking-widest mt-1">{member.role}</p>
                                </div>

                                {/* Hover reveal — gold bar slides up */}
                                <div className="absolute bottom-0 left-0 right-0 bg-[#ffc000] px-5 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                                    <p className="text-[#090805] font-display font-bold text-lg">{member.name}</p>
                                    <p className="text-[#090805]/65 text-xs uppercase tracking-widest mt-0.5 font-bold">{member.role}</p>
                                </div>
                            </motion.div>
                        ))}

                        {data.teamMembers.length === 0 && (
                            <div className="col-span-full py-20 text-center border border-white/10 text-[#6b6250] uppercase tracking-widest text-sm">
                                No team members added yet.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                PHILOSOPHY PULL-QUOTE
            ══════════════════════════════════════════════════ */}
            <section className="py-20 md:py-24 bg-[#0d0c08] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-8 lg:px-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="border-l-4 border-[#ffc000] pl-8 md:pl-12"
                    >
                        <p className="text-2xl md:text-4xl font-display font-bold text-white leading-tight max-w-3xl mb-6">
                            &ldquo;{data.philosophyQuote || "We don't just take photographs — we craft visual narratives that outlive the moment."}&rdquo;
                        </p>
                        <p className="text-[#6b6250] text-sm uppercase tracking-[0.3em] font-bold">
                            {data.philosophyAttribution || '— Mado Creatives Studio Philosophy'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                CTA — dark editorial split layout
            ══════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-[#060504]">
                <div className="max-w-7xl mx-auto px-8 lg:px-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-5 mb-8">
                                <span className="w-12 h-px bg-[#ffc000]" />
                                <p className="text-[#ffc000] font-bold tracking-[0.42em] uppercase text-[11px]">Work With Us</p>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-6">
                                {data.ctaTitle}
                            </h2>
                            <p className="text-[#7a7260] text-lg mb-10 leading-relaxed">{data.ctaSubtitle}</p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 bg-[#ffc000] text-[#090805] px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] hover:bg-white transition-colors"
                            >
                                {data.ctaButton}
                                <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                            </Link>
                        </motion.div>

                        {/* Right: team name list */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="divide-y divide-white/8"
                        >
                            {data.teamMembers.slice(0, 4).map((m, i) => (
                                <div key={i} className="flex items-center justify-between py-4">
                                    <span className="text-white font-display font-bold text-lg">{m.name}</span>
                                    <span className="text-[#5c5544] text-xs uppercase tracking-[0.28em] font-bold">{m.role}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
