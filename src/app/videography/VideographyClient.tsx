'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { CreativeServicePageData, CreativeServiceVideoItem } from '@/lib/creativeServicePage';
import { videographyPageDefaults } from '@/lib/videographyPageDefaults';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function VideographyClient({ data = videographyPageDefaults }: { data?: CreativeServicePageData }) {
    const heroImages = data.heroImages.length > 0 ? data.heroImages : videographyPageDefaults.heroImages;
    const showcaseVideos: CreativeServiceVideoItem[] = data.showcaseVideos && data.showcaseVideos.length > 0
        ? data.showcaseVideos
        : (videographyPageDefaults.showcaseVideos ?? []);

    return (
        <div className="flex flex-col bg-[var(--app-bg)]">
            <section className="relative h-[72vh] overflow-hidden mx-3 md:mx-5 mt-[104px] md:mt-[116px] rounded-[1.55rem]">
                <div className="absolute inset-0 flex gap-px">
                    {heroImages.map((img, i) => (
                        <div key={`${img}-${i}`} className={`overflow-hidden ${i === 0 ? 'flex-[2]' : 'flex-1'}`}>
                            <img src={img} alt="" className="w-full h-full object-contain" />
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-[#0a0a08]/35 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0a08]" />
                <div className="absolute inset-0 flex flex-col items-start justify-end pb-24 px-6 lg:px-16 max-w-7xl mx-auto w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-3">{data.heroLabel}</p>
                        <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase text-white leading-none whitespace-pre-line">{data.title}</h1>
                    </motion.div>
                </div>
            </section>

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

            {showcaseVideos.length > 0 && (
                <section className="bg-[#111109] py-24 border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-6 lg:px-16">
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-3xl mb-14">
                            <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-3">{data.showcaseLabel || videographyPageDefaults.showcaseLabel}</p>
                            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white uppercase leading-none mb-5">
                                {data.showcaseTitle || videographyPageDefaults.showcaseTitle}
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                {data.showcaseSubtitle || videographyPageDefaults.showcaseSubtitle}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {showcaseVideos.map((video, index) => (
                                <motion.article
                                    key={`${video.videoUrl}-${index}`}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.7, delay: index * 0.08 }}
                                    className={`group bg-[#0a0a08] border border-white/5 overflow-hidden ${index === 0 && showcaseVideos.length > 1 ? 'lg:col-span-2' : ''}`}
                                >
                                    <div className="relative bg-black">
                                        <video
                                            src={video.videoUrl}
                                            poster={video.posterImage || undefined}
                                            controls
                                            preload="metadata"
                                            playsInline
                                            className="block w-full h-auto max-h-[78vh] bg-black"
                                        />
                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                                    </div>
                                    <div className="p-6 md:p-7">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-[#ffc000] font-mono text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                                            <div className="h-px w-10 bg-[#ffc000]/30" />
                                            <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Featured Film</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-display font-extrabold uppercase text-white mb-3 group-hover:text-[#ffc000] transition-colors">
                                            {video.title}
                                        </h3>
                                        {video.description && (
                                            <p className="text-slate-400 leading-relaxed max-w-3xl">
                                                {video.description}
                                            </p>
                                        )}
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

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
