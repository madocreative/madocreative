'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CreativeServiceHero from '@/components/CreativeServiceHero';
import type { CreativeServicePageData } from '@/lib/creativeServicePage';
import { digitalMarketingPageDefaults } from '@/lib/digitalMarketingPageDefaults';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function DigitalMarketingClient({ data = digitalMarketingPageDefaults }: { data?: CreativeServicePageData }) {
    const heroImages = data.heroImages.length > 0 ? data.heroImages : digitalMarketingPageDefaults.heroImages;
    const primaryHeroImage = heroImages[0] || '';

    return (
        <div className="flex flex-col bg-[var(--app-bg)]">
            <CreativeServiceHero heroImage={primaryHeroImage} heroLabel={data.heroLabel} title={data.title} />

            <section className="bg-[#0a0a08] py-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row gap-12 md:gap-20 items-start">
                    <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl font-light leading-relaxed flex-1">
                        {data.subtitle}
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
                        className="grid grid-cols-2 gap-x-12 gap-y-6 shrink-0">
                        {data.stats.map((stat) => (
                            <div key={stat.label}>
                                <p className="text-[#ffc000] font-bold text-3xl font-display mb-1">{stat.value}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <div className="w-full">
                {data.services.map((service, index) => {
                    const reverse = index % 2 !== 0;
                    const tags = service.tags.split(',').map((tag) => tag.trim()).filter(Boolean);

                    return (
                        <section key={`${service.title}-${index}`} className={`w-full ${index % 2 === 0 ? 'bg-[#0a0a08]' : 'bg-[#111109]'}`}>
                            <div className={`max-w-7xl mx-auto flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch`}>
                                <motion.div variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9 }}
                                    className="w-full lg:w-1/2 aspect-[4/5] lg:aspect-auto overflow-hidden group min-h-[400px]">
                                    <img className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                        src={service.image} alt={service.title} />
                                </motion.div>
                                <motion.div variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, delay: 0.2 }}
                                    className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="text-[#ffc000] font-mono text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                                        <div className="h-px w-8 bg-[#ffc000]/30" />
                                        <div className="flex gap-2 flex-wrap">
                                            {tags.map((tag) => (
                                                <span key={tag} className="text-[10px] uppercase tracking-widest text-slate-500 border border-white/10 px-3 py-1">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-white mb-6 leading-tight uppercase">{service.title}</h2>
                                    <p className="text-lg text-slate-400 mb-12 leading-relaxed font-light">{service.description}</p>
                                    <Link href={data.ctaLink} className="group/link flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs w-max hover:text-[#ffc000] transition-colors">
                                        <span className="w-8 h-px bg-[#ffc000] transition-all duration-300 group-hover/link:w-14" />
                                        {data.ctaButton}
                                        <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover/link:translate-x-1">arrow_right_alt</span>
                                    </Link>
                                </motion.div>
                            </div>
                        </section>
                    );
                })}
            </div>

            {data.process.length > 0 && (
                <section className="bg-[#111109] py-24 border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-6 lg:px-16">
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-16">
                            <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-3">{data.processLabel}</p>
                            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white uppercase leading-none">{data.processTitle}</h2>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
                            {data.process.map((step, i) => (
                                <motion.div key={`${step.step}-${i}`} variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className="bg-[#0a0a08] border border-white/5 p-8 group hover:border-[#ffc000]/30 transition-colors">
                                    <span className="text-[#ffc000] font-mono text-4xl font-bold block mb-6 opacity-40 group-hover:opacity-100 transition-opacity">{step.step}</span>
                                    <h3 className="text-white font-display font-extrabold text-xl uppercase mb-4">{step.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <motion.section variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.8 }}
                className="w-full bg-[#ffc000] py-32">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-6xl font-display font-extrabold text-[#0a0a08] mb-8 leading-tight uppercase">{data.ctaTitle}</h2>
                    <p className="text-xl text-[#0a0a08]/70 mb-12 max-w-2xl mx-auto font-medium">
                        {data.ctaSubtitle}
                    </p>
                    <Link href={data.ctaLink} className="inline-flex items-center gap-3 bg-[#0a0a08] text-white px-10 py-4 font-bold text-lg uppercase tracking-wider hover:bg-[#1a1812] transition-colors">
                        {data.ctaButton}
                    </Link>
                </div>
            </motion.section>
        </div>
    );
}
