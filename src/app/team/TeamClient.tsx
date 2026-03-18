'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface TeamMember {
    name: string;
    role: string;
    image: string;
}

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
        <div className="flex flex-col bg-[var(--app-bg)] text-[var(--app-text)]">
            <section className="relative overflow-hidden rounded-[1.55rem] bg-[#090805] mx-3 md:mx-5 mt-[104px] md:mt-[116px] pt-20 sm:pt-24 md:pt-36 pb-12 md:pb-20">
                <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[100px] md:text-[200px] lg:text-[280px] font-display font-bold leading-none select-none pointer-events-none opacity-[0.015] text-white"
                    aria-hidden
                >
                    TEAM
                </span>

                <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-20">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                    >
                        <p className="mb-5 md:mb-8 flex items-center gap-4 text-[#ffc000] font-bold uppercase tracking-[0.38em] md:tracking-[0.44em] text-[10px]">
                            <span className="w-8 md:w-10 h-px bg-[#ffc000]" />
                            The People
                        </p>
                        <h1 className="max-w-4xl text-[2.6rem] sm:text-5xl md:text-7xl lg:text-[6rem] font-display font-bold leading-[0.92] md:leading-[0.88] tracking-[-0.02em] text-white">
                            {data.title}
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                        className="mt-7 md:mt-14 pt-7 md:pt-10 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10"
                    >
                        <div className="flex-shrink-0">
                            <p className="mb-2 text-3xl md:text-4xl font-display font-bold text-[#ffc000] leading-none">
                                {data.teamMembers.length}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#6b6250] font-bold">
                                Creatives
                            </p>
                        </div>
                        <div className="h-px w-full sm:w-px sm:h-10 bg-white/10" />
                        <p className="text-[#9a9078] text-sm md:text-base lg:text-lg leading-[1.8] tracking-[0.01em]">
                            {data.subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="bg-[#090805] py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
                    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                        {data.teamMembers.map((member, index) => (
                            <motion.article
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.7, delay: (index % 3) * 0.1 }}
                                className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-[1.25rem] border border-white/6 bg-[#111109] shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                            >
                                <span className="absolute top-3 left-3 z-20 rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[#ffc000]/72 font-display font-bold text-[11px] backdrop-blur-sm group-hover:text-[#ffc000] transition-colors">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                {member.image && (
                                    <img
                                        src={member.image}
                                        alt={`${member.name}, ${member.role}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                    />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a]/92 via-[#05070a]/28 to-transparent" />

                                <div className="absolute inset-x-0 bottom-0 px-3 pb-3 sm:px-4 sm:pb-4">
                                    <div className="rounded-[1rem] border border-white/10 bg-black/42 px-4 py-4 sm:px-5 sm:py-5 backdrop-blur-md">
                                        <p className="text-white font-bold text-[0.95rem] sm:text-[1.05rem] uppercase tracking-[0.08em] leading-tight group-hover:text-[#f2d28b] transition-colors">
                                            {member.name}
                                        </p>
                                        <p className="mt-2 text-white/55 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] leading-[1.65]">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                            </motion.article>
                        ))}

                        {data.teamMembers.length === 0 && (
                            <div className="col-span-full py-20 text-center border border-white/10 text-[#6b6250] uppercase tracking-widest text-sm">
                                No team members added yet.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-24 bg-[#0d0c08] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="border-l-4 border-[#ffc000] pl-6 md:pl-12"
                    >
                        <p className="max-w-3xl mb-5 md:mb-6 text-[1.7rem] md:text-4xl font-display font-bold text-white leading-[1.16]">
                            &ldquo;{data.philosophyQuote || "We don't just take photographs - we craft visual narratives that outlive the moment."}&rdquo;
                        </p>
                        <p className="text-[#6b6250] text-sm uppercase tracking-[0.3em] font-bold">
                            {data.philosophyAttribution || '- Mado Creatives Studio Philosophy'}
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 md:py-32 bg-[#060504]">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-5 mb-7 md:mb-8">
                                <span className="w-12 h-px bg-[#ffc000]" />
                                <p className="text-[#ffc000] font-bold tracking-[0.42em] uppercase text-[11px]">Work With Us</p>
                            </div>
                            <h2 className="text-[2.3rem] md:text-5xl font-display font-bold text-white leading-[1.02] mb-5 md:mb-6">
                                {data.ctaTitle}
                            </h2>
                            <p className="text-[#7a7260] text-base md:text-lg mb-8 md:mb-10 leading-[1.8]">
                                {data.ctaSubtitle}
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffc000] text-[#090805] px-8 sm:px-10 h-12 font-bold text-sm uppercase tracking-[0.2em] hover:bg-white hover:-translate-y-0.5 transition-all duration-300"
                            >
                                {data.ctaButton}
                                <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="divide-y divide-white/8"
                        >
                            {data.teamMembers.slice(0, 4).map((member, index) => (
                                <div key={index} className="flex items-start gap-4 py-4">
                                    <span className="text-[#ffc000]/40 font-display font-bold text-xs w-6 flex-shrink-0 pt-1">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-display font-bold text-base leading-tight">{member.name}</p>
                                        <p className="text-[#5c5544] text-[10px] uppercase tracking-[0.28em] font-bold mt-1">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
