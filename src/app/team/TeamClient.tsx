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
}

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function TeamClient({ data }: { data: PageData }) {
    const heroImgs = data.teamMembers.map(m => m.image).filter(Boolean);

    return (
        <div className="flex flex-col bg-[#0a0a08]">
            {/* ── Hero — solid background ─────────────────────────────── */}
            <section className="relative h-[45vh] overflow-hidden bg-[#111109]">
                <div className="absolute inset-0 bg-[#0a0a08]/25 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#0a0a08]" />
                <div className="absolute inset-0 flex flex-col items-start justify-end pb-20 px-6 lg:px-16 max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-2">The People</p>
                        <h1 className="text-4xl md:text-6xl font-display font-extrabold uppercase text-white leading-none">
                            {data.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* ── Subtitle ─────────────────────────────────────────────── */}
            <section className="bg-[#0a0a08] py-8 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <motion.p
                        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-3xl font-light leading-relaxed"
                    >
                        {data.subtitle}
                    </motion.p>
                </div>
            </section>

            {/* ── Team Grid ─────────────────────────────────────────────── */}
            <section className="bg-[#0a0a08] py-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                        {data.teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={fadeUp} initial="hidden" whileInView="show"
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.7, delay: (index % 3) * 0.1 }}
                                className="group relative aspect-[3/4] overflow-hidden bg-[#111109]"
                            >
                                {member.image && (
                                    <img
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={`${member.name}, ${member.role}`}
                                        src={member.image}
                                    />
                                )}

                                {/* Hard solid bottom name bar — always visible */}
                                <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a08] px-5 py-4 translate-y-0 group-hover:translate-y-full transition-transform duration-400">
                                    <p className="text-white font-bold text-sm uppercase tracking-wider">{member.name}</p>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest mt-0.5">{member.role}</p>
                                </div>

                                {/* Hover reveal — solid color block slides up */}
                                <div className="absolute bottom-0 left-0 right-0 bg-[#ffc000] px-5 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                                    <p className="text-[#0a0a08] font-display font-extrabold text-lg">{member.name}</p>
                                    <p className="text-[#0a0a08]/70 text-xs uppercase tracking-widest mt-0.5 font-bold">{member.role}</p>
                                </div>
                            </motion.div>
                        ))}

                        {data.teamMembers.length === 0 && (
                            <div className="col-span-full py-20 text-center border border-white/10 text-slate-500">
                                No team members added yet.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────────────── */}
            <motion.section
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.8 }}
                className="bg-[#ffc000] py-16"
            >
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="font-display text-3xl md:text-5xl font-extrabold text-[#0a0a08] mb-4 uppercase">{data.ctaTitle}</h3>
                    <p className="text-[#0a0a08]/70 text-lg mb-10 max-w-xl mx-auto">{data.ctaSubtitle}</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 bg-[#0a0a08] text-white px-10 py-4 font-bold text-lg uppercase tracking-wider hover:bg-[#1a1812] transition-colors"
                    >
                        {data.ctaButton}
                    </Link>
                </div>
            </motion.section>
        </div>
    );
}
